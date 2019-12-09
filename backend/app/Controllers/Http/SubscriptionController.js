/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Workshop = use('App/Models/Workshop');

class SubscriptionController {
  /**
   * Create/save a new subscription.
   * POST workshops/:workshop_id/subscriptions
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store({ response, params, auth }) {
    const user = await auth.getUser();
    const { workshop_id } = params;

    const workshop = await Workshop.find(workshop_id);

    const subscriptionExists = await user.subscriptions().where('section', workshop.section).first();
    if (subscriptionExists) {
      return response.status(400).json({ error: 'Cannot subscribe to two workshops within same section' });
    }

    const countSubscriptions = await workshop.subscriptions().count();
    if (countSubscriptions[0]['count(*)'] === 48) {
      return response.status(400).json({ error: 'Workshop cannot have more than 48 subscriptions, already full' });
    }

    await user.subscriptions().attach(workshop_id);

    return response.status(201).send();
  }

  /**
   * Delete a subscription.
   * DELETE workshops/:workshop_id/subscriptions
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async destroy({ params, auth }) {
    const user = await auth.getUser();
    const { workshop_id } = params;

    await user.subscriptions().detach(workshop_id);
  }
}

module.exports = SubscriptionController
