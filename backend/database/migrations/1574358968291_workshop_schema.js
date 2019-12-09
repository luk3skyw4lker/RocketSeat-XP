'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkshopSchema extends Schema {
  up() {
    this.create('workshops', (table) => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table
        .string('color')
        .notNullable()
        .defaultTo('#7159c1');
      table.string('title').notNullable();
      table.text('description').notNullable();
      table.enu('section', [1, 2, 3]).notNullable();
      table.timestamps();
    })
  }

  down() {
    this.drop('workshops')
  }
}

module.exports = WorkshopSchema
