require('dotenv').config();
import { logger as log } from './logging';
import createError from 'http-errors';

import * as admin from 'firebase-admin';
import { CookbookModel } from '../models/Cookbook/cookbook.model';
import { UserModel } from '../models/User/user.model';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { GuildModel } from '../models/Guild/guild.model';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : '',
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
  res.status(error.status || 500).json({ message: error.message });
}

export const auth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }

  if (!req.authToken) {
    return next(createError(401, 'Unauthorized'));
  }

  const { authToken } = req;
  const userInfo = await admin.auth().verifyIdToken(authToken);
  const users = await UserModel.find({ uid: userInfo.uid });

  if (!req.params.cookbook) {
    return next(createError(401, 'Unauthorized'));
  }
  if (users && users.length && users[0].super_admin) {
    return next();
  }

  const cookbook = await CookbookModel.findById(req.params.cookbook);
  const authRoles = ['admin', 'chef'];

  if (
    cookbook &&
    cookbook.roles &&
    authRoles.includes(cookbook.roles[userInfo.uid])
  ) {
    return next();
  }

  return next(createError(401, 'Unauthorized'));
};

export const superAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }

  if (!req.authToken) {
    return next(createError(401, 'Unauthorized'));
  }
  const { authToken } = req;
  const userInfo = await admin.auth().verifyIdToken(authToken);

  const users = await UserModel.find({ uid: userInfo.uid });
  if (users[0] && users[0].super_admin) {
    return next();
  }

  return next(createError(401, 'Unauthorized'));
};

export const login = async (req, res, next) => {
  const { code, redirectUrl } = req.body;
  const clientId = process.env.DISCORD_ID;
  const clientSecret = process.env.DISCORD_SECRET;
  const params = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}&scope=identify email`;
  const baseUrl = 'https://discord.com/api';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  // Get discord auth token
  const response = await axios.post(
    `${baseUrl}/oauth2/token`,
    encodeURI(params),
    {
      headers: headers,
    },
  );

  // Get user with auth token
  const newResponse = await axios.get(`${baseUrl}/users/@me`, {
    headers: {
      authorization: `${response.data.token_type} ${response.data.access_token}`,
    },
  });

  const user = newResponse.data;

  const userProfile = {
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
    email: user.email,
    discord_id: user.id,
  };

  try {
    const userRecord = await admin.auth().getUserByEmail(user.email);
    const token = await admin.auth().createCustomToken(userRecord.uid);
    const users = await UserModel.find({ uid: userRecord.uid });
    if (!users[0]) {
      await UserModel.create({ ...userProfile, ...{ uid: userRecord.uid } });
    } else {
      await UserModel.findOneAndUpdate({ uid: userRecord.uid }, userProfile);
    }
    return res.status(200).send(token);
  } catch (err) {
    const userRecord = await admin.auth().createUser({ email: user.email });
    await UserModel.create({ ...userProfile, ...{ uid: userRecord.uid } });
    const token = await admin.auth().createCustomToken(userRecord.uid);
    return res.status(200).send(token);
  }
};

export const getSessionCookie = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }

  if (!req.authToken) {
    return next(createError(401, 'Unauthorized'));
  }

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
    sameSite: 'strict',
    domain: '.cookbook.gg',
  };
  res.cookie('session', cookie, options);
  return res.end(JSON.stringify({ status: 'success' }));
};

export const loginWithCookie = async (req, res, next) => {
  let cookies = req.headers.cookie;
  if (cookies) {
    cookies = cookies.split(';').reduce((obj, c) => {
      const n = c.split('=');
      obj[n[0].trim()] = n[1].trim();
      return obj;
    }, {});
  } else {
    return next(createError(401, 'Unauthorized'));
  }

  const userRecord = await admin.auth().verifySessionCookie(cookies.session);
  return res
    .status(200)
    .send(await admin.auth().createCustomToken(userRecord.uid));
};

export const updateUsers = async () => {
  const baseUrl = 'https://discord.com/api';

  // Get discord auth token
  try {
    const users = await UserModel.find({});

    for (let i = 0; i < users.length; i++) {
      try {
        const user = users[i];
        // Get user with auth token
        const newResponse = await axios.get(
          `${baseUrl}/users/${user.discord_id}`,
          {
            headers: {
              Authorization: `Bot ${process.env.BOT_TOKEN}`,
            },
          },
        );

        const discordUser = newResponse.data;
        const userProfile = {
          username: discordUser.username,
          discriminator: discordUser.discriminator,
          avatar: discordUser.avatar,
        };
        await UserModel.findOneAndUpdate({ _id: user._id }, userProfile);
      } catch (err) {
        console.log('err: ', err);
      }
    }
  } catch (err) {
    console.log('err: ', err);
  }
};

export const gfyTransform = (url) => {
  if (!url) return { gif: null };
  const urlObject = { thumbnail: url, giant: url, gif: url };
  const [thumb, size, mobile, mp4, giant] = [
    'thumbs.',
    '-size_restricted.gif',
    '-mobile.mp4',
    '.mp4',
    'giant.',
  ];

  if (url.includes(thumb)) {
    urlObject.giant = url.replace(thumb, giant);
  }

  if (url.includes(size)) {
    urlObject.thumbnail = urlObject.thumbnail.replace(size, mobile);
    urlObject.giant = urlObject.giant.replace(size, mp4);
  }

  if (url.includes(mp4) && !url.includes(mobile)) {
    urlObject.thumbnail = urlObject.thumbnail.replace(mp4, mobile);
    urlObject.gif = urlObject.gif.replace(mp4, size);
  } else if (url.includes(mobile)) {
    urlObject.giant = urlObject.giant.replace(mobile, mp4);
    urlObject.gif = urlObject.gif.replace(mobile, size);
  }

  if (url.includes(giant)) {
    urlObject.thumbnail = url.replace(giant, thumb);
    urlObject.gif = urlObject.gif.replace(giant, thumb);
  }

  return urlObject;
};

export const parseBody = (string) => {
  const matches = string.match(/(gif:)\S*/g);
  const { gif } = gfyTransform(
    matches?.[0].split(',')?.[0].replace(/(gif:)/, ''),
  );
  return {
    gifs: gif,
    body: string.replace(/(gif:)|(vid:)|(loop:)|(tweet:)/g, ''),
  };
};

export const postEmbed = (post: any) => {
  const { gifs, body } = parseBody(post.body);
  return new MessageEmbed()
    .setColor('#09d3ac')
    .setTitle(post.title)
    .setURL(
      `https://melee.cookbook.gg/${encodeURI(post.cookbook.name)}/posts/${
        post._id
      }`,
    )
    .setAuthor({
      name: `${post.cre_account?.username}`,
      iconURL: `https://cdn.discordapp.com/avatars/${post.cre_account?.discord_id}/${post.cre_account?.avatar}.png`,
    })
    .setDescription(body)
    .setImage(gifs)
    .setFooter({
      text: post.tags.map((tag) => `#${tag.label}`).join(' '),
    });
};

export const guideEmbed = (guide: any, section: any) => {
  const { gifs, body } = parseBody(section.body);
  return new MessageEmbed()
    .setColor('#09d3ac')
    .setTitle(section.title)
    .setURL(
      `https://melee.cookbook.gg/${encodeURI(guide.cookbook.name)}/recipes/${
        guide._id
      }/section/${encodeURIComponent(section.title)}`,
    )
    .setAuthor({
      name: `${guide.cookbook.name} - ${guide.title}`,
      url: `https://melee.cookbook.gg/${encodeURI(guide.cookbook.name)}`,
    })
    .setDescription(body.substr(0, 1000) + '\u2026')
    .setImage(gifs);
};

export const updateFollowers = async (client, post) => {
  try {
    if (!post) return;
    const guilds = await GuildModel.find();
    client.guilds.cache.forEach(async (guild) => {
      const _guild = guilds.find((g) => g.guild === guild.id);
      if (
        !_guild ||
        _guild.cookbook === null ||
        _guild.cookbook.toString() === post.cookbook._id.toString()
      ) {
        guild.channels.cache.forEach((channel) => {
          if (
            channel.name === 'cookbook' &&
            (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_NEWS')
          ) {
            channel.send({
              embeds: [postEmbed(post)],
            });
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const parseGfy = async (url) => {
  async function replaceAsync(str, regex, asyncFn) {
    const promises: any = [];
    str.replace(regex, (match, ...args) => {
      const promise: any = asyncFn(match, ...args);
      promises.push(promise);
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
  }

  async function getUrl(match) {
    const data: any = await scrapeGfy(match);
    return `${data.miniUrl ? data.miniUrl : data.gifUrl}`;
  }

  async function scrapeGfy(url) {
    try {
      const token = await axios.post('https://api.gfycat.com/v1/oauth/token', {
        client_id: process.env.GFY_ID,
        client_secret: process.env.GFY_SECRET,
        grant_type: 'client_credentials',
      });
      const gfyRegex = /(?<=gfycat.com\/).*/;
      const res = await axios.get(
        `https://api.gfycat.com/v1/gfycats/${gfyRegex.exec(url)}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      const data = res.data;
      return data.gfyItem;
    } catch (err) {}
  }

  return await replaceAsync(url, /(https:\/\/)(gfycat)[^\s\,]*/g, getUrl);
};

export const replaceGfy = async (req, res, response) => {
  const url = await parseGfy(req.body.url);

  res.send(url);
};
