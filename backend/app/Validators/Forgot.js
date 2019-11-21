'use strict'

class Forgot {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      email: 'email|required'
    }
  }
}

module.exports = Forgot
