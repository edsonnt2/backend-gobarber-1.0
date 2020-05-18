import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const usersRouter = Router();
const profileController = new ProfileController();

usersRouter.use(ensureAuthenticated);

usersRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      new_password: Joi.string().min(6),
      password_confirmation: Joi.string().valid(Joi.ref('new_password')),
    },
  }),
  profileController.update,
);
usersRouter.get('/', profileController.show);

export default usersRouter;
