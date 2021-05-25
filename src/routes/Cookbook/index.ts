import express from "express";
import { handleError } from "../../utils/utils";
import CookbookController from "./CookbookController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(CookbookController.get));
router.post("", wrapAsync(CookbookController.create));

logRoutes("/cookbooks", router);
router.use(handleError);

export default router;
