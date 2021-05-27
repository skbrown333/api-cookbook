import express from "express";
import { handleError, superAuth } from "../../utils/utils";
import CharacterController from "./CharacterController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(CharacterController.get));
router.get("/:id", wrapAsync(CharacterController.getById));
router.patch("/:id", superAuth, wrapAsync(CharacterController.update));
router.delete("/:id", superAuth, wrapAsync(CharacterController.delete));
router.post("", superAuth, wrapAsync(CharacterController.create));

logRoutes("/characters", router);
router.use(handleError);

export default router;
