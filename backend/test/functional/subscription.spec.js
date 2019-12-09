const { test, trait } = use('Test/Suite')('Subscription');

/** @type {import('@adonisjs/lucid/src/Factory')} * */
const Factory = use('Factory');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should subscripe user to workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();

  const response = await client
    .post(`/workshop/${workshop.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(201);

  const subscription = await user.subscriptions().first();

  assert.equal(subscription.pivot_workshop_id, workshop.id);
});

test('it should unsubscripe user from workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();

  await user.subscriptions().attach(workshop.id);

  const response = await client
    .delete(`/workshop/${workshop.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);

  const subscription = await user.subscriptions().first();

  assert.isNull(subscription);
});

test('it should not subscripe user to workshop in the same section', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const workshop1 = await Factory.model('App/Models/Workshop').create({ section: 1 });

  const workshop2 = await Factory.model('App/Models/Workshop').create({ section: 1 });

  await user.subscriptions().attach(workshop1.id);

  const response = await client
    .post(`/workshop/${workshop2.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(400);

  const subscription = await user.subscriptions().count();

  assert.equal(subscription[0]['count(*)'], 1);
});

test('workshop should not have more than 48 subscriptions', async ({ assert, client }) => {
  const originalHashMake = Hash.make;

  Hash.make = () => '1';

  const users = await Factory.model('App/Models/User').createMany(48);
  const workshop = await Factory.model('App/Models/Workshop').create();

  Hash.make = originalHashMake;

  const userIds = users.map(user => user.id);

  await workshop.subscriptions().attach(userIds);

  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post(`/workshop/${workshop.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(400);

  const subscription = await workshop.subscriptions().count();

  assert.equal(subscription[0]['count(*)'], 48);
});