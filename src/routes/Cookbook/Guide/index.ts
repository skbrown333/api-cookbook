import express from "express";
import { handleError } from "../../../utils/utils";
import GuideController from "./GuideController";
import { wrapAsync } from "../../../utils/utils";
import { logRoutes } from "../../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(GuideController.get));
router.get("/:guide", wrapAsync(GuideController.getById));
router.patch("/:guide", wrapAsync(GuideController.update));
router.delete("/:guide", wrapAsync(GuideController.delete));
router.post("", wrapAsync(GuideController.create));

logRoutes("/cookbooks/:cookbook/guides", router);
router.use(handleError);

export default router;
