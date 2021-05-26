import express from "express";
import { handleError } from "../../utils/utils";
import Character from "./CharacterController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(Character.get));
router.post("", wrapAsync(Character.create));

logRoutes("/characters", router);
router.use(handleError);

export default router;
