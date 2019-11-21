'use strict'

class Reset {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      token: 'required',
      password: 'required|confirmed'
    }
  }
}

module.exports = Reset
