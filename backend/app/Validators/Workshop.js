'use strict'
const { sanitize, rule } = use('Validator');

class Workshop {
  get rules() {
    return {
      title: [
        rule('required')
      ],
      description: [
        rule('required')
      ],
      section: [
        rule('required'),
        rule('in', [1, 2, 3])
      ],
      user_id: [
        rule('required'),
        rule('exists', ['users', 'id'])
      ]
    }
  }
}

module.exports = Workshop
