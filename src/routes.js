import { Router } from 'express';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

// cadastro de usuario
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// iniciar sessão de usuario

// update de usuario

export default routes;
