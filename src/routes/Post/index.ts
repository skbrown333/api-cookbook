import express from "express";
import { handleError } from "../../utils/utils";
import PostController from "./PostController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(PostController.get));
router.get("/:id", wrapAsync(PostController.getById));
router.patch("/:id", wrapAsync(PostController.update));
router.delete("/:id", wrapAsync(PostController.delete));
router.post("", wrapAsync(PostController.create));

logRoutes("/posts", router);
router.use(handleError);

export default router;
