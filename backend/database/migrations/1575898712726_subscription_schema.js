'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubscriptionSchema extends Schema {
  up() {
    this.create('subscriptions', (table) => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .integer('workshop_id')
        .unsigned()
        .references('id')
        .inTable('workshops')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.timestamps();
    })
  }

  down() {
    this.drop('subscriptions')
  }
}

module.exports = SubscriptionSchema
