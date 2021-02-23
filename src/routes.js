import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multer from 'multer';

import multerConfig from './config/multer';

import AppointmentController from './app/controllers/AppointmentController';
import authMiddlewares from './app/middlewares/auth';
import AvailableController from './app/controllers/AvailableController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';
import ProviderController from './app/controllers/ProviderController';
import ScheduleController from './app/controllers/ScheduleController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import validatedUserStore from './app/validators/UserStore';
import validatedUserUpdate from './app/validators/UserUpdate';
import validatedSessionStore from './app/validators/SessionStore';
import validatedAppointmentStore from './app/validators/AppointmentStore';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

routes.post('/users', validatedUserStore, UserController.store);
routes.post(
  '/sessions',
  bruteForce.prevent,
  validatedSessionStore,
  SessionController.store
);

routes.use(authMiddlewares);

routes.put('/users', validatedUserUpdate, UserController.update);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/schedule', ScheduleController.index);
routes.get('/appointments', AppointmentController.index);
routes.post(
  '/appointments',
  validatedAppointmentStore,
  AppointmentController.store
);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
