import express from "express";
import { handleError, superAuth } from "../../utils/utils";
import CharacterController from "./CharacterController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(CharacterController.get));
router.get("/:id", wrapAsync(CharacterController.getById));
router.patch(
  "/:id",
  wrapAsync(superAuth),
  wrapAsync(CharacterController.update)
);
router.delete(
  "/:id",
  wrapAsync(superAuth),
  wrapAsync(CharacterController.delete)
);
router.post("", wrapAsync(superAuth), wrapAsync(CharacterController.create));

logRoutes("/characters", router);
router.use(handleError);

export default router;
