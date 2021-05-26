/**
 * ENV
 */
const NODE_ENV = process.env.NODE_ENV;

const isLocal = NODE_ENV === "development";
const env: any = {};
env.db_url = isLocal ? "http://localhost:3000" : process.env.MONGO_URL;
env.isLocal = isLocal;

export const ENV = env;
