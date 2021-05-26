import express from "express";
import { handleError } from "../../utils/utils";
import TagController from "./TagController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(TagController.get));
router.get("/:id", wrapAsync(TagController.getById));
router.patch("/:id", wrapAsync(TagController.update));
router.delete("/:id", wrapAsync(TagController.delete));
router.post("", wrapAsync(TagController.create));

logRoutes("/tags", router);
router.use(handleError);

export default router;
