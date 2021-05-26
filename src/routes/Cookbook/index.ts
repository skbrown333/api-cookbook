import express from "express";
import { auth, handleError } from "../../utils/utils";
import CookbookController from "./CookbookController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";
import { default as GuideRouter } from "./Guide";
import { default as PostRouter } from "./Post";
import { default as TagRouter } from "./Tag";
import { default as UserRouter } from "./User";

const router = express.Router();

router.get("", wrapAsync(CookbookController.get));
router.get("/:cookbook", wrapAsync(CookbookController.getById));
router.patch("/:cookbook", auth, wrapAsync(CookbookController.update));
router.delete("/:cookbook", auth, wrapAsync(CookbookController.delete));
router.post("", auth, wrapAsync(CookbookController.create));

logRoutes("/cookbooks", router);

router.use("/:cookbook/guides", GuideRouter);
router.use("/:cookbook/posts", PostRouter);
router.use("/:cookbook/tags", TagRouter);
router.use("/:cookbook/users", UserRouter);

router.use(handleError);

export default router;
