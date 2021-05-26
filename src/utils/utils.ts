import { logger as log } from "./logging";

export function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

export function handleError(error, req, res, next) {
  log.error(error.message);
  res.status(500).json({ message: error.message, status: error.status });
}

export function auth(req, res, next) {
  next();
}
