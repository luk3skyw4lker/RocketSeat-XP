'use strict'
/** @typedef {import('@adonisjs/lucid/src/Lucid/Model')} */
const Workshop = use('App/Models/Workshop');

class WorkshopController {
  /**
   * Show a list of all workshops.
   * GET workshops
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request }) {
    const section = request.input('section', 1);

    const workshops = await Workshop.query()
      .where('section', section)
      .with('user', builder => {
        builder.select(['id', 'name', 'avatar']);
      })
      .fetch();

    return workshops;
  }

  /**
   * Create/save a new workshop.
   * POST workshops
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only([
      'title',
      'color',
      'description',
      'user_id',
      'section'
    ]);

    const workshop = await Workshop.create(data);

    return response.status(201).json(workshop);
  }

  /**
   * Display a single workshop.
   * GET workshops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const workshop = await Workshop.find(params.id);

    await workshop.load('user', builder => {
      builder.select(['id', 'name', 'github', 'linkedin', 'avatar']);
    });

    return workshop;
  }

  /**
   * Update workshop details.
   * PUT or PATCH workshops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request }) {
    const data = request.only([
      'title',
      'color',
      'description',
      'user_id',
      'section'
    ]);

    const workshop = await Workshop.find(params.id);

    workshop.merge(data);

    await workshop.save();

    return workshop;
  }

  /**
   * Delete a workshop with id.
   * DELETE workshops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const workshop = await Workshop.find(params.id);

    workshop.delete();

    return response.status(204).json(null);
  }
}

module.exports = WorkshopController
