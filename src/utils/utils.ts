import { logger as log } from "./logging";

import * as admin from "firebase-admin";
import { CookbookModel } from "../models/Cookbook/cookbook.model";
import { UserModel } from "../models/User/user.model";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

export function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

export function handleError(error, req, res, next) {
  log.error(error.message);
  res.status(500).json({ message: error.message, status: error.status });
}

const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }
  next();
};

export const auth = (req, res, next) => {
  getAuthToken(req, res, async () => {
    console.log(req.authToken);
    console.log("params: ", req.params);
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      console.log(req.params);
      if (!req.params.cookbook) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      const cookbook = await CookbookModel.findById(req.params.cookbook);
      console.log(cookbook);
      if (
        cookbook &&
        cookbook.roles &&
        cookbook.roles[userInfo.uid] === "admin"
      ) {
        return next();
      }

      return res.status(401).send({ error: "Unauthorized" });
    } catch (e) {
      console.log(e.message);
      return res.status(401).send({ error: "Unauthorized" });
    }
  });
};

export const superAuth = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);

      const users = await UserModel.find({ uid: userInfo.uid });
      if (users[0] && users[0].super_admin) {
        return next();
      }

      return res.status(401).send({ error: "Unauthorized" });
    } catch (e) {
      console.log(e.message);
      return res.status(401).send({ error: "Unauthorized" });
    }
  });
};
