// Define file as CJS

const fs = require('fs');
const { join: joinPath } = require('path');
const util = require('util');

const getSrc = (arg) => {
  if (typeof arg === 'function') {
    return arg.toString();
  }
  return util.inspect(arg, {
    showHidden: true,
    depth: null,
    getters: true,
    showProxy: true,
  });
};

function removeFileExtension(filename) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    // If there's no dot in the file name, return the original name
    return filename;
  }
  return filename.substring(0, lastDotIndex);
}
const createLogger = (filename = 'app') => {
  const logStream = fs.createWriteStream(
    joinPath('log', `${removeFileExtension(filename)}.log`),
    {
      flags: 'a',
    }
  );
  let ended = false;

  const log = (...args) => {
    const message = args
      .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
      .join(' ');

    const time = new Date().toISOString();
    logStream.write(`${time} | ${message}\n`);
  };

  const end = () => {
    if (!ended) logStream.end();
    ended = true;
  };

  log.src = (name, arg) => {
    log(name, getSrc(arg));
  };

  // Close the file when the program exits
  process.on('exit', end);
  // Close the file when the program is interrupted (e.g. by pressing Ctrl+C)
  process.on('SIGINT', () => {
    end();
    process.exit(0);
  });

  // Close the file when an uncaught exception is thrown
  process.on('uncaughtException', () => {
    end();
    process.exit(1);
  });

  return log;
};

module.exports = createLogger;
