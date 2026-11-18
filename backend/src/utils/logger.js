/* eslint-disable no-console */
const levels = ["error", "warn", "info", "debug"];

function timestamp() {
  return new Date().toISOString();
}

const logger = {};

levels.forEach((level) => {
  logger[level] = (...args) => {
    const method = level === "debug" ? "log" : level;
    console[method](`[${timestamp()}] [${level.toUpperCase()}]`, ...args);
  };
});

module.exports = logger;
