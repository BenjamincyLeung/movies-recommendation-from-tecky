import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('ratings',(table)=>{ 
        table.dropForeign('user_id');
    });

    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 600001')
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('ratings',(table)=>{ 
        table.foreign("user_id").references(`users.id`);
    });
}

