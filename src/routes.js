import { Router } from 'express';

// Controllers
import UserController from './app/controllers/UserController';

const routes = new Router();

// cadastro de usuario
routes.post('/users', UserController.store);

// iniciar sessão de usuario

// update de usuario

export default routes;
