import express from "express";
import { auth, handleError } from "../../../utils/utils";
import PostController from "./PostController";
import { wrapAsync } from "../../../utils/utils";
import { logRoutes } from "../../../utils/logging";

const router = express.Router({ mergeParams: true });

router.get("", wrapAsync(PostController.get));
router.get("/:post", wrapAsync(PostController.getById));
router.patch("/:post", auth, wrapAsync(PostController.update));
router.delete("/:post", auth, wrapAsync(PostController.delete));
router.post("", auth, wrapAsync(PostController.create));

logRoutes("/cookbooks/:cookbook/posts", router);
router.use(handleError);

export default router;
