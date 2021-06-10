import express from "express";
import {
  getSessionCookie,
  handleError,
  login,
  loginWithCookie,
  wrapAsync,
} from "../utils/utils";

import { default as CookbookRouter } from "./Cookbook";
import { default as CharacterRouter } from "./Character";
import { default as GameRouter } from "./Game";
import { default as UserRouter } from "./User";

const router = express.Router();

router.use("/cookbooks", CookbookRouter);
router.use("/characters", CharacterRouter);
router.use("/games", GameRouter);
router.use("/users", UserRouter);
router.post("/login", wrapAsync(login));
router.get("/session", wrapAsync(getSessionCookie));
router.get("/loginWithCookie", wrapAsync(loginWithCookie));

router.use(handleError);

export default router;
