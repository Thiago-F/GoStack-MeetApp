import { Router } from 'express';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// cadastro de usuario
routes.post('/users', UserController.store);

// iniciar sessão de usuario
routes.post('/sessions', SessionController.store);

// middleware de autenticação
routes.use(authMiddleware);

// update de usuario
routes.put('/users', UserController.update);

export default routes;
