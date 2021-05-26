import express from "express";
import { handleError } from "../../utils/utils";
import GameController from "./GameController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(GameController.get));
router.get("/:id", wrapAsync(GameController.getById));
router.patch("/:id", wrapAsync(GameController.update));
router.delete("/:id", wrapAsync(GameController.delete));
router.post("", wrapAsync(GameController.create));

logRoutes("/games", router);
router.use(handleError);

export default router;
