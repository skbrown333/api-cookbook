import express from "express";
import { handleError } from "../../utils/utils";
import UserController from "./UserController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(UserController.get));
router.get("/:id", wrapAsync(UserController.getById));
router.patch("/:id", wrapAsync(UserController.update));
router.delete("/:id", wrapAsync(UserController.delete));
router.post("", wrapAsync(UserController.create));

logRoutes("/users", router);
router.use(handleError);

export default router;
