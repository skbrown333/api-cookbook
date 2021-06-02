/**
 * ENV
 */
require('dotenv').config()
const NODE_ENV = process.env.NODE_ENV;

const isLocal = NODE_ENV === "development";
const env: any = {};
env.db_url = isLocal ? "http://localhost:3000" : process.env.MONGO_URL;
env.isLocal = isLocal;
console.log(env.db_url);

export const ENV = env;
