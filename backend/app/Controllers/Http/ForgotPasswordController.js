const { randomBytes } = require('crypto');
const { promisify } = require('util');

const Mail = use('Mail');
const Env = use('Env');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class ForgotPasswordController {
  async store({ request }) {
    const email = request.input('email');

    const user = await User.findByOrFail('email', email);

    const random = await promisify(randomBytes)(24);
    const token = random.toString('hex');

    await user.tokens().create({
      token,
      type: 'forgotPassword'
    });

    const resetUrl = `${Env.get('FRONT_URL')}/reset?token=${token}`;

    await Mail.send(
      'emails.forgotPassword',
      { name: user.name, resetUrl },
      message => {
        message
          .to(user.email)
          .from('linkinparkbotelho@gmail.com')
          .subject('Recuperação de senha - RSXP');
      }
    );
  }
}

module.exports = ForgotPasswordController;
