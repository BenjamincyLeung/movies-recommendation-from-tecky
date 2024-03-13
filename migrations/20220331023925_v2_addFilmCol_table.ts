import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("films")) {
        
        await knex.schema.alterTable("films", (table) => {
            table.renameColumn("flim_name","film_name")
            table.dropForeign("categoriy_id");
            table.dropColumn("categoriy_id");
            table.dropForeign("director_id");
            table.dropColumn("director_id");
            table.dropForeign("actor_id");
            table.dropColumn("actor_id");
            table.boolean("adult").notNullable();
            table.text("overview");
            table.date("release_date");
        })
    }

    await knex.schema.createTable("film_categories", (table) => {
        table.increments();
        table.integer("film_id").unsigned().notNullable;
        table.foreign("film_id").references('films.id');
        table.integer("category_id").unsigned().notNullable;
        table.foreign("category_id").references("categories.id")
    })

    await knex.schema.dropTable("actors")
    await knex.schema.dropTable("directors")
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.createTable("directors", (table) =>{
        table.increments();
        table.string("director").notNullable().unique();
        table.timestamps(false, true);
    });

    await knex.schema.createTable("actors", (table) =>{
        table.increments();
        table.string("actor").notNullable().unique();
        table.timestamps(false, true);
    });

    await knex.schema.dropTable("film_categories");

    await knex.schema.alterTable("films", (table) => {
        table.renameColumn("film_name", "flim_name")
        table.integer("categoriy_id").unsigned().notNullable();
        table.foreign("categoriy_id").references('categories.id');
        table.dropColumn("adult");
        table.dropColumn("overview");
        table.dropColumn("release_date");
        table.integer("director_id").unsigned().notNullable();
        table.foreign("director_id").references("directors.id");
        table.integer("actor_id").unsigned().notNullable();
        table.foreign("actor_id").references("actors.id");
    })

}

