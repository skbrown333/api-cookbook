import express from "express";
import { handleError } from "../utils/utils";

import { default as CookbookRouter } from "./Cookbook";
import { default as CharacterRouter } from "./Character";
import { default as GameRouter } from "./Game";
import { default as GuideRouter } from "./Guide";
import { default as PostRouter } from "./Post";
import { default as TagRouter } from "./Tag";
import { default as UserRouter } from "./User";

const router = express.Router();

router.use("/cookbooks", CookbookRouter);
router.use("/characters", CharacterRouter);
router.use("/games", GameRouter);
router.use("/guides", GuideRouter);
router.use("/posts", PostRouter);
router.use("/tags", TagRouter);
router.use("/users", UserRouter);
router.use(handleError);

export default router;
