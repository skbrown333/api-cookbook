import express from 'express';
import { superAuth, handleError } from '../../utils/utils';
import UserController from './UserController';
import { wrapAsync } from '../../utils/utils';
import { logRoutes } from '../../utils/logging';

const router = express.Router();

router.get('', wrapAsync(UserController.get));
router.get('/:user', wrapAsync(UserController.getById));
router.patch('/:user', wrapAsync(superAuth), wrapAsync(UserController.update));
router.delete('/:user', wrapAsync(superAuth), wrapAsync(UserController.delete));
router.post('', wrapAsync(superAuth), wrapAsync(UserController.create));

logRoutes('/users', router);
router.use(handleError);

export default router;
