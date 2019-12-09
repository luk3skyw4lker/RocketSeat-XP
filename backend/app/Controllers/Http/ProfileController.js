const Helpers = use('Helpers');

class ProfileController {
  /**
   * Create/save a new subscription.
   * POST workshops/:workshop_id/subscriptions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {import('@adonisjs/auth/src/Schemes/Session')} ctx.auth
   */
  async update({ request, auth }) {
    const data = request.only([
      'name',
      'title',
      'bio',
      'github',
      'linkedin',
      'password'
    ]);

    const user = await auth.getUser();

    const avatar = request.file('avatar');

    if (avatar) {
      await avatar.move(Helpers.tmpPath('uploads'), {
        name: `${new Date().getTime()}.${avatar.subtype}`
      });

      if (!avatar.moved()) {
        return avatar.error();
      }

      user.avatar = avatar.fileName;
    }

    user.merge(data);

    const password = request.input('password');
    if (password) {
      user.password = password;
    }

    await user.save();

    return user;
  }
}

module.exports = ProfileController;
