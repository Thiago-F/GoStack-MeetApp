import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// middlewares
routes.use(authMiddleware);

routes.put('/users', UserController.update);

// banner
routes.post('/file', uploads.single('file'), FileController.store);

// add new meetup
routes.get('/meetups', MeetupController.list); // lista todos
routes.get('/meetup', MeetupController.index); // lista todos de um usuario
routes.post('/meetup', MeetupController.store);
routes.put('/meetup', MeetupController.update);
routes.delete('/meetup', MeetupController.delete);

// register in a meetup
routes.post('/register', SubscriptionController.store);

export default routes;
