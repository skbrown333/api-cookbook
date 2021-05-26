import express from "express";
import { handleError } from "../../utils/utils";
import GuideController from "./GuideController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(GuideController.get));
router.get("/:id", wrapAsync(GuideController.getById));
router.patch("/:id", wrapAsync(GuideController.update));
router.delete("/:id", wrapAsync(GuideController.delete));
router.post("", wrapAsync(GuideController.create));

logRoutes("/guides", router);
router.use(handleError);

export default router;
