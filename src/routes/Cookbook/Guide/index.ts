import express from 'express';
import { auth, handleError } from '../../../utils/utils';
import GuideController from './GuideController';
import { wrapAsync } from '../../../utils/utils';
import { logRoutes } from '../../../utils/logging';

const router = express.Router({ mergeParams: true });

router.get('', wrapAsync(GuideController.get));
router.get('/:guide', wrapAsync(GuideController.getById));
router.patch('/:guide', wrapAsync(auth), wrapAsync(GuideController.update));
router.delete(
  '/:guide',
  wrapAsync(auth),
  wrapAsync(GuideController.deleteAndUpdateCookbook),
);
router.post('', wrapAsync(auth), wrapAsync(GuideController.create));

logRoutes('/cookbooks/:cookbook/guides', router);
router.use(handleError);

export default router;
