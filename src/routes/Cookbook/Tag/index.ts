import express from "express";
import { auth, handleError } from "../../../utils/utils";
import TagController from "./TagController";
import { wrapAsync } from "../../../utils/utils";
import { logRoutes } from "../../../utils/logging";

const router = express.Router({ mergeParams: true });

router.get("", wrapAsync(TagController.get));
router.get("/:tag", wrapAsync(TagController.getById));
router.patch("/:tag", auth, wrapAsync(TagController.update));
router.delete("/:tag", auth, wrapAsync(TagController.delete));
router.post("", auth, wrapAsync(TagController.create));

logRoutes("/cookbooks/:cookbook/tags", router);
router.use(handleError);

export default router;
