// Logging is kind of a funny word. Just look at it. If a dwarf
// were sleeping under a tree, you might call that logging. It
// sounds far less important than it is.

// =================
// L I B R A R I E S
// =================
import winston from 'winston';

// Retrieve possible transports
const { Console } = winston.transports;

// Retrieve formatters
const { combine, timestamp, printf } = winston.format;

// Create a custom format
const logFormat = printf(info => {
  return `${info.timestamp} - ${info.level}: ${info.message}`;
});

// Customize transports
const defaultConsoleTransport = new Console({
  format: combine(timestamp(), logFormat)
});

// Define transport list
const transportArray = [defaultConsoleTransport];

// Create Custom logger
export const logger = winston.createLogger({
  transports: transportArray
});

export const logRoutes = function(prefix, routes) {
  let routeList = routes.stack;
  routeList.forEach(r => {
    let method = r.route.stack[0].method.toUpperCase();
    let path = prefix + r.route.path;
    logger.info(`${method} - ${path}`);
  });
};