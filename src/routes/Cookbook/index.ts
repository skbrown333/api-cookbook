import express from "express";
import { auth, handleError, superAuth } from "../../utils/utils";
import CookbookController from "./CookbookController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";
import { default as GuideRouter } from "./Guide";
import { default as PostRouter } from "./Post";
import { default as TagRouter } from "./Tag";

const router = express.Router();

router.get("", wrapAsync(CookbookController.get));
router.get("/:cookbook", wrapAsync(CookbookController.getById));
router.patch(
  "/:cookbook",
  wrapAsync(auth),
  wrapAsync(CookbookController.update)
);
router.delete(
  "/:cookbook",
  wrapAsync(superAuth),
  wrapAsync(CookbookController.delete)
);
router.post("", wrapAsync(superAuth), wrapAsync(CookbookController.create));

logRoutes("/cookbooks", router);

router.use("/:cookbook/guides", GuideRouter);
router.use("/:cookbook/posts", PostRouter);
router.use("/:cookbook/tags", TagRouter);

router.use(handleError);

export default router;
