import { Knex } from "knex";
//import { hashPassword } from "../utils/hash";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    //const user = { username: "admin1234", password: await hashPassword("1234"), gender: "3"};
    await knex("users").insert();
};
