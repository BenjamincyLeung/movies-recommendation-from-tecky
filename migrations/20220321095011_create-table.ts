import { Knex } from "knex";

const usersTable = "users";
const categoriesTable = "categories";
const directorsTable = "directors";
const actorsTable = "actors";
const filmsTable = "films";
const ratingsTable = "ratings";
const collectionTable = "collection";
const choose3CategoriesTable = "choose3categories";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(usersTable, (table) =>{
        table.increments();
        table.string("username").notNullable().unique();
        table.string("password").notNullable();
        table.smallint("gender").unsigned().notNullable();
        table.timestamps(false, true);
    });

    await knex.schema.createTable(categoriesTable, (table) =>{
        table.increments();
        table.string("category").notNullable().unique();
        table.timestamps(false, true);
    });

    await knex.schema.createTable(directorsTable, (table) =>{
        table.increments();
        table.string("director").notNullable().unique();
        table.timestamps(false, true);
    });

    await knex.schema.createTable(actorsTable, (table) =>{
        table.increments();
        table.string("actor").notNullable().unique();
        table.timestamps(false, true);
    });

    await knex.schema.createTable(filmsTable, (table) =>{
        table.increments();
        // 你個film同category串錯左，不過唔洗改，我v2改左
        table.string("flim_name").notNullable().unique();
        table.string("image").notNullable();
        table.integer("categoriy_id").unsigned().notNullable();
        table.foreign("categoriy_id").references(`${categoriesTable}.id`);
        table.integer("director_id").unsigned().notNullable();
        table.foreign("director_id").references(`${directorsTable}.id`);
        table.integer("actor_id").unsigned().notNullable();
        table.foreign("actor_id").references(`${actorsTable}.id`);
        table.timestamps(false, true);
    });

    await knex.schema.createTable(choose3CategoriesTable, (table) =>{
        table.increments();
        table.integer("user_id").unsigned().notNullable();
        table.foreign("user_id").references(`${usersTable}.id`);
        table.integer("categoriy_id").unsigned().notNullable();
        table.foreign("categoriy_id").references(`${categoriesTable}.id`);
        table.timestamps(false, true);
    });
    
    await knex.schema.createTable(ratingsTable, (table) =>{
        table.increments();
        table.integer("user_id").unsigned().notNullable();
        table.foreign("user_id").references(`${usersTable}.id`);
        table.integer("film_id").unsigned().notNullable();
        table.foreign("film_id").references(`${filmsTable}.id`);
        table.smallint("rating").unsigned();
        table.date("create_time");
        table.timestamps(false, true);
    });

    await knex.schema.createTable(collectionTable, (table) =>{
        table.increments();
        table.integer("saved_user_id").unsigned().notNullable();
        table.foreign("saved_user_id").references(`${usersTable}.id`);
        table.integer("film_id").unsigned().notNullable();
        table.foreign("film_id").references(`${filmsTable}.id`);
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(collectionTable);
    await knex.schema.dropTable(ratingsTable);
    await knex.schema.dropTable(choose3CategoriesTable);
    await knex.schema.dropTable(filmsTable);
    await knex.schema.dropTable(actorsTable);
    await knex.schema.dropTable(directorsTable);
    await knex.schema.dropTable(categoriesTable);
    await knex.schema.dropTable(usersTable);
}

