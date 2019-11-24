const { test, trait } = use('Test/Suite')('Forgot Password');
const Mail = use('Mail');
const Database = use('Database');
const { subHours, format } = require('date-fns');

/** @typedef {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {import('@adonisjs/lucid/src/Factory')} * */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should send an email with forgot password instructions', async ({
  assert,
  client
}) => {
  Mail.fake();

  const email = 'lucashenriqueblemos@gmail.com';

  const user = await Factory.model('App/Models/User').create({ email });

  await client
    .post('/forgot')
    .send({ email })
    .end();

  const token = await user.tokens().first();

  const recentEmail = Mail.pullRecent();

  assert.equal(recentEmail.message.to[0].address, email);

  assert.include(token.toJSON(), {
    type: 'forgotPassword'
  });

  Mail.restore();
});

test('it should reset password', async ({ assert, client }) => {
  const email = 'lucashenriqueblemos@gmail.com';
  const user = await Factory.model('App/Models/User').create({ email });
  const userToken = await Factory.model('App/Models/Token').make();

  await user.tokens().save(userToken);

  const response = await client
    .post('/reset')
    .send({
      token: userToken.token,
      password: '1234567',
      password_confirmation: '1234567'
    })
    .end();

  response.assertStatus(204);

  await user.reload();
  const checkPassword = await Hash.verify('1234567', user.password);

  assert.isTrue(checkPassword);
});

test('it should not be able to reset password after 2h of previous request', async ({
  client
}) => {
  const email = 'lucashenriqueblemos@gmail.com';
  const user = await Factory.model('App/Models/User').create({ email });
  const userToken = await Factory.model('App/Models/Token').make();

  await user.tokens().save(userToken);

  const dateWithSub = format(subHours(new Date(), 3), 'yyyy-MM-dd HH:ii:ss');

  await Database.table('tokens')
    .where('token', userToken.token)
    .update('created_at', dateWithSub);

  await userToken.reload();

  const response = await client
    .post('/reset')
    .send({
      token: userToken.token,
      password: '1234567',
      password_confirmation: '1234567'
    })
    .end();

  response.assertStatus(400);
});
