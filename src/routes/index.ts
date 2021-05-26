import express from "express";
import { handleError } from "../utils/utils";

import { default as CookbookRouter } from "./Cookbook";
import { default as CharacterRouter } from "./Character";
import { default as GameRouter } from "./Game";
import { default as GuideRouter } from "./Cookbook/Guide";

const router = express.Router({ mergeParams: true });

router.use("/cookbooks", CookbookRouter);
router.use("/characters", CharacterRouter);
router.use("/games", GameRouter);
router.use(handleError);

export default router;
