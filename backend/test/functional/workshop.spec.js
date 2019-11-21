const { test, trait } = use('Test/Suite')('Workshop');

/** @type {import('@adonisjs/lucid/src/Factory')} * */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should create a workshop', async ({
  assert,
  client
}) => {
  const { id } = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/workshops')
    .send({
      title: 'Node.js',
      user_id: id,
      description: 'A Node.js workshop',
      section: 1
    })
    .end();

  response.assertStatus(201);
  assert.exists(response.body.id);
});
