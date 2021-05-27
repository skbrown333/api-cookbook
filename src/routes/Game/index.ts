import express from "express";
import { handleError, superAuth } from "../../utils/utils";
import GameController from "./GameController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(GameController.get));
router.get("/:id", wrapAsync(GameController.getById));
router.patch("/:id", superAuth, wrapAsync(GameController.update));
router.delete("/:id", superAuth, wrapAsync(GameController.delete));
router.post("", superAuth, wrapAsync(GameController.create));

logRoutes("/games", router);
router.use(handleError);

export default router;
