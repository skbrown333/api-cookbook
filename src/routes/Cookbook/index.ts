import express from "express";
import { handleError } from "../../utils/utils";
import CookbookController from "./CookbookController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";
import { default as GuideRouter } from "./Guide";
import { default as PostRouter } from "./Post";
import { default as TagRouter } from "./Tag";
import { default as UserRouter } from "./User";

const router = express.Router({ mergeParams: true });

router.get("", wrapAsync(CookbookController.get));
router.post("", wrapAsync(CookbookController.create));
router.get("/:cookbook", wrapAsync(CookbookController.getById));
router.patch("/:cookbook", wrapAsync(CookbookController.update));
router.delete("/:cookbook", wrapAsync(CookbookController.delete));

logRoutes("/cookbooks", router);

router.use("/:cookbook/guides", GuideRouter);
router.use("/:cookbook/posts", PostRouter);
router.use("/:cookbook/tags", TagRouter);
router.use("/:cookbook/users", UserRouter);

router.use(handleError);

export default router;
