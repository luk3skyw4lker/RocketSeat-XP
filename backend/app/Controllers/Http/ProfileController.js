const Helpers = use('Helpers');

class ProfileController {
  async update({ request, auth }) {
    const user = await auth.getUser();

    const avatar = request.file('avatar', {
      types: ['image'],
      size: '2mb'
    });

    await avatar.move(Helpers.tmpPath('uploads'), {
      name: `${new Date().getTime()}.${avatar.subtype}`
    });

    if (!avatar.moved()) {
      return avatar.error();
    }

    user.avatar = avatar.fileName;

    await user.save();

    return user;
  }
}

module.exports = ProfileController
