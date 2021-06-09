require("dotenv").config();
import { logger as log } from "./logging";
import createError from "http-errors";

import * as admin from "firebase-admin";
import { CookbookModel } from "../models/Cookbook/cookbook.model";
import { UserModel } from "../models/User/user.model";
import axios from "axios";

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
  res.status(error.status).json({ message: error.message });
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
    const { authToken } = req;
    const userInfo = await admin.auth().verifyIdToken(authToken);

    if (!req.params.cookbook) {
      return next(createError(401, "Unauthorized"));
    }

    const cookbook = await CookbookModel.findById(req.params.cookbook);

    if (
      cookbook &&
      cookbook.roles &&
      cookbook.roles[userInfo.uid] === "admin"
    ) {
      return next();
    }
    return next(createError(401, "Unauthorized"));
  });
};

export const superAuth = (req, res, next) => {
  getAuthToken(req, res, async () => {
    const { authToken } = req;
    const userInfo = await admin.auth().verifyIdToken(authToken);

    const users = await UserModel.find({ uid: userInfo.uid });
    if (users[0] && users[0].super_admin) {
      return next();
    }

    return next(createError(401, "Unauthorized"));
  });
};

export const login = (req, res, next) => {
  const { code, redirectUrl } = req.body;
  const clientId = process.env.DISCORD_ID;
  const clientSecret = process.env.DISCORD_SECRET;
  const params = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}&scope=identify email`;
  const baseUrl = "https://discord.com/api";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  let user;

  createProfile()
    .then((token) => {
      res.status(200).send(token);
    })
    .catch((err) => {
      return next(createError(500, "Error Logging In"));
    });

  async function createProfile() {
    try {
      // Get discord auth token
      const response = await axios.post(
        `${baseUrl}/oauth2/token`,
        encodeURI(params),
        {
          headers: headers,
        }
      );

      // Get user with auth token
      const newResponse = await axios.get(`${baseUrl}/users/@me`, {
        headers: {
          authorization: `${response.data.token_type} ${response.data.access_token}`,
        },
      });

      user = newResponse.data;
    } catch (err) {
      throw err;
    }

    const userProfile = {
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      email: user.email,
      discord_id: user.id,
    };

    try {
      const userRecord = await admin.auth().getUserByEmail(user.email);
      return await admin.auth().createCustomToken(userRecord.uid);
    } catch (err) {
      try {
        const userRecord = await admin.auth().createUser({ email: user.email });
        await UserModel.create({ ...userProfile, ...{ uid: userRecord.uid } });
        return await admin.auth().createCustomToken(userRecord.uid);
      } catch (err) {
        throw err;
      }
    }
  }
};

export const getSessionCookie = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      await admin.auth().verifyIdToken(authToken);
      // Set session expiration to 5 days.
      const expiresIn = 60 * 60 * 24 * 14 * 1000;
      const cookie = await admin
        .auth()
        .createSessionCookie(authToken, { expiresIn });
      // Set cookie policy for session cookie.
      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        domain: ".cookbook.gg",
      };
      res.cookie("session", cookie, options);
      return res.end(JSON.stringify({ status: "success" }));
    } catch (e) {
      return next(createError(401, "Unauthorized"));
    }
  });
};

export const loginWithCookie = (req, res, next) => {
  let cookies = req.headers.cookie;
  if (cookies) {
    cookies = cookies.split(";").reduce((obj, c) => {
      var n = c.split("=");
      obj[n[0].trim()] = n[1].trim();
      return obj;
    }, {});
  }

  getToken()
    .then((token) => {
      res.status(200).send(token);
    })
    .catch((err) => {
      return next(createError(500, "Error Logging In"));
    });

  async function getToken() {
    try {
      const userRecord = await admin
        .auth()
        .verifySessionCookie(cookies.session);
      return await admin.auth().createCustomToken(userRecord.uid);
    } catch (err) {
      throw err;
    }
  }
};
