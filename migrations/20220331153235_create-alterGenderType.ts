import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  if(await knex.schema.hasTable('users')){ 
    await knex.schema.alterTable('users',(table)=>{ 
      table.string('gender',255).alter()
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  if(await knex.schema.hasTable('users')){ 
    await knex.schema.alterTable('users',(table)=>{ 
      table.integer('gender').alter()
    })
  }
}


