/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/files/:file', 'FileController.show');

Route.post('/sessions', 'SessionController.store').validator('Session');

Route.post('/forgot', 'ForgotPasswordController.store').validator('Forgot');
Route.post('/reset', 'ResetPasswordController.store').validator('Reset');

Route.group(() => {
  Route.put('/profile', 'ProfileController.update').validator('Profile');

  Route.put('/workshops/:id', 'WorkshopController.update').validator('Workshop');
  Route.post('/workshops', 'WorkshopController.store').validator('Workshop');

  Route.delete('/workshops/:id', 'WorkshopController.destroy');

  Route.get('/workshops/:id', 'WorkshopController.show');
  Route.get('/workshops', 'WorkshopController.index');
}).middleware('auth');
