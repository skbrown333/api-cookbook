import express from "express";
import { handleError } from "../utils/utils";

import { default as CookbookRouter } from "./Cookbook";

const router = express.Router();

router.use("/cookbooks", CookbookRouter);
router.use(handleError);

export default router;
