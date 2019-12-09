const { test, trait } = use('Test/Suite')('Workshop');

/** @type {import('@adonisjs/lucid/src/Factory')} * */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should create a workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/workshops')
    .loginVia(user, 'jwt')
    .send({
      title: 'Node.js',
      user_id: user.id,
      description: 'A Node.js workshop',
      section: 1
    })
    .end();

  response.assertStatus(201);
  assert.exists(response.body.id);
});

test('it should list all workshops', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').make({ section: 2 });

  await user.workshops().save(workshop);

  const response = await client
    .get('/workshops')
    .query({ section: 2 })
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.deepEqual(response.body[0].title, workshop.title);
  assert.deepEqual(response.body[0].user.id, user.id);
});

test('it should list a specific workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();

  await user.workshops().save(workshop);

  const response = await client
    .get(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.deepEqual(response.body.title, workshop.title);
  assert.deepEqual(response.body.user.id, user.id);
});

test('it should update a workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create({
    title: 'Old workshop'
  });

  await user.workshops().save(workshop);

  const response = await client
    .put(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .send({
      ...workshop.toJSON(),
      title: 'New workshop',
    })
    .end();

  response.assertStatus(200);
  assert.deepEqual(response.body.title, 'New workshop');
});

test('it should destroy a workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();

  await user.workshops().save(workshop);

  const response = await client
    .delete(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  assert.deepEqual(response.body, {});
});
