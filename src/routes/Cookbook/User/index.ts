import express from "express";
import { auth, handleError } from "../../../utils/utils";
import UserController from "./UserController";
import { wrapAsync } from "../../../utils/utils";
import { logRoutes } from "../../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(UserController.get));
router.get("/:user", wrapAsync(UserController.getById));
router.patch("/:user", auth, wrapAsync(UserController.update));
router.delete("/:user", auth, wrapAsync(UserController.delete));
router.post("", auth, wrapAsync(UserController.create));

logRoutes("/cookbooks/:cookbook/users", router);
router.use(handleError);

export default router;
