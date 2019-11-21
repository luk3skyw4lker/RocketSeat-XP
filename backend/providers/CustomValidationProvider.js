const { ServiceProvider } = require('@adonisjs/fold')

class CustomValidationProvider extends ServiceProvider {
  async existsFn(data, field, message, args, get) {
    const value = get(data, field)
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return
    }

    const [table, column] = args

    const row = await use('App/Models/User').find(value);
    if (!row) {
      throw message
    }
  }

  boot() {
    const Validator = use('Validator')
    Validator.extend('userExists', this.existsFn.bind(this))
  }
}

module.exports = CustomValidationProvider;