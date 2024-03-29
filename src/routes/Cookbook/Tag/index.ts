import express from 'express';
import { auth, handleError } from '../../../utils/utils';
import TagController from './TagController';
import { wrapAsync } from '../../../utils/utils';
import { logRoutes } from '../../../utils/logging';

const router = express.Router({ mergeParams: true });

router.get('', wrapAsync(TagController.get));
router.get('/:tag', wrapAsync(TagController.getById));
router.patch('/:tag', wrapAsync(auth), wrapAsync(TagController.update));
router.delete('/:tag', wrapAsync(auth), wrapAsync(TagController.delete));
router.post('', wrapAsync(auth), wrapAsync(TagController.create));

logRoutes('/cookbooks/:cookbook/tags', router);
router.use(handleError);

export default router;
