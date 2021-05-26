import express from "express";
import { handleError } from "../../utils/utils";
import CharacterController from "./CharacterController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(CharacterController.get));
router.get("/:id", wrapAsync(CharacterController.getById));
router.post("", wrapAsync(CharacterController.create));

logRoutes("/characters", router);
router.use(handleError);

export default router;
