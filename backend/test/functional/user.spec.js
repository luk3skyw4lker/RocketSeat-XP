const { test, trait } = use('Test/Suite')('User');

/** @type {import('@adonisjs/lucid/src/Factory')} * */
const Factory = use('Factory');
const Helpers = use('Helpers');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should update user and add avatar', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .attach('avatar', Helpers.tmpPath('test/github_avatar.png'))
    .end();

  response.assertStatus(200);
  assert.exists(response.body.avatar);
});
