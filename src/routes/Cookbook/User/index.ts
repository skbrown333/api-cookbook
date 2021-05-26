import express from "express";
import { handleError } from "../../../utils/utils";
import UserController from "./UserController";
import { wrapAsync } from "../../../utils/utils";
import { logRoutes } from "../../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(UserController.get));
router.get("/:user", wrapAsync(UserController.getById));
router.patch("/:user", wrapAsync(UserController.update));
router.delete("/:user", wrapAsync(UserController.delete));
router.post("", wrapAsync(UserController.create));

logRoutes("/cookbooks/:cookbook/users", router);
router.use(handleError);

export default router;
