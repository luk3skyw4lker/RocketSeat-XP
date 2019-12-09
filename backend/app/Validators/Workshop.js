const { rule } = use('Validator');
const Antl = use('Antl');

class Workshop {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      title: [rule('required')],
      description: [rule('required')],
      section: [rule('required'), rule('in', [1, 2, 3])],
      user_id: [rule('required'), rule('exists', ['users', 'id'])]
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Workshop;
