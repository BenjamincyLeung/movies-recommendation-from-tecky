import type { Knex } from "knex";
import { hashPassword } from "../utils/hash";
import { v4 as uuidv4 } from "uuid";
export class UserService {
  constructor(private knex: Knex) {}
  /*SECTION A  -- SIGN A NEW USERS*/

  loginGoogle = async (username: string, gender: string) => {
    let checkIfUserExist = await this.knex
      .select("*")
      .from("users")
      .where("username", `${username}`)
      .first();

    let GoogleLoginPassword = uuidv4().toString();
    const hashedPassword = await hashPassword(GoogleLoginPassword);
    console.log(hashedPassword);

    if (!checkIfUserExist) {
      const createGoogleUser = await this.knex
        .insert({
          username: `${username}`,
          password: `${hashedPassword}`,
          gender: `${gender}`,
        })
        .returning("*")
        .into("users");
      console.log(createGoogleUser);
    }
    return checkIfUserExist;
  };

  signUpRequest = async (name: string, password: string, gender: string) => {
    const result = await this.knex
      .select("username")
      .from("users")
      .where("username", `${name}`)
      .limit(1);
    const sameUsername = JSON.stringify(result[0]);
    if (sameUsername) {
      return "false";
    }
    const returnId = await this.knex
      .insert({
        username: `${name}`,
        password: `${password}`,
        gender: `${gender}`,
      })
      .returning("id")
      .into("users");
    return returnId;
  };

  /*SECTION B  -- GET USERNAME AND PREVENT FROM DUPLICATED SIGN UP*/
  getUsername = async (username: string) => {
    const result = await this.knex("users")
      .select("*")
      .where({ username: `${username}` })
      .first();
    return result;
  };
}
