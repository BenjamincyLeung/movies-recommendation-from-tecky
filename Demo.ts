import {userService} from "./server"
import type { Knex } from "knex";
// // import { user } from "./model";

export class UserService {
  constructor(private knex: Knex) {}
  /*SECTION A  -- SIGN A NEW USERS*/
  signUpRequest = async (name: string, password: string, gender: string) => {
    const result = await this.knex
      .select("username")
      .from("users")
      .where("username", `${name}`)
      .limit(1);
    const sameUsername = JSON.stringify(result[0]);
    console.log(sameUsername);
    if (sameUsername) {
      return "false";
    }
    const returnId=await this.knex
      .insert({
        username: `${name}`,
        password: `${password}`,
        gender: `${gender}`,
      }).returning('id')
      .into("users");
    return returnId;
  };

  gerMMMovie = async () => {
    const result = await this.knex.select("*").from('user')
    return result
}
}
