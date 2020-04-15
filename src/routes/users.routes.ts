import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import CreateUsersService from '../services/CreateUsersService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const createUser = new CreateUsersService();

    const user = await createUser.execute({
      email,
      name,
      password,
    });

    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  (req, res) => {
    console.log(req.file);
    return res.json({ ok: true });
  },
);

export default usersRouter;
