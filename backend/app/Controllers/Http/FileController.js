const Helpers = use('Helpers');

class FileController {
  /**
   * Display a single file.
   * GET files/:file
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/${params.file}`));
  }
}

module.exports = FileController;
