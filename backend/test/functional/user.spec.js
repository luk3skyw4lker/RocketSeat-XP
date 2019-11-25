const { test, trait } = use('Test/Suite')('User');

/** @type {import('@adonisjs/lucid/src/Factory')} * */
const Factory = use('Factory');

/** @type {import('@adonisjs/ignitor/src/Helpers')} * */
const Helpers = use('Helpers');

/** @type {import('@adonisjs/framework/src/Hash')} * */
const Hash = use('Hash');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should update user and add avatar', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    name: 'Lucas',
    password: '123'
  });

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .field('name', 'Henrique')
    .field('password', '12345')
    .field('password_confirmation', '12345')
    .attach('avatar', Helpers.tmpPath('test/github_avatar.png'))
    .end();

  response.assertStatus(200);
  assert.exists(response.body.avatar);

  await user.reload();

  assert.isTrue(await Hash.verify('12345', user.password));
  assert.equal(response.body.name, 'Henrique');
});
