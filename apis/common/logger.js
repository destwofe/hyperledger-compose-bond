var winston = require('winston')
var fs = require('fs')

// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

const loggerBuilder = function (label) {
  var dir = `${__dirname}/../logs`
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  return winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
      winston.format.label({label}),
      winston.format.timestamp(), winston.format.printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`)),
    transports: [
      new winston.transports.Console()
    ]
  })

  // return new (winston.Logger)({
  //   transports: [
  //     new (winston.transports.Console)({
  //       colorize: 'all',
  //       level: 'debug',
  //       label: label,
  //       prettyPrint: true
  //     }),
  //     new (winston.transports.File)({
  //       name: 'error-file',
  //       filename: `${__dirname}/../logs/winstonlog-error.log`,
  //       level: 'error',
  //       label: label,
  //       json: false,
  //       prettyPrint: true
  //     }),
  //     new (winston.transports.File)({
  //       name: 'log-file',
  //       filename: `${__dirname}/../logs/winstonlog.log`,
  //       level: 'info',
  //       label: label,
  //       json: false,
  //       prettyPrint: true
  //     })
  //   ]
  // })
}

// console.log = (...args) => logger.info(...args)
// console.error = (...args) => logger.error(...args)
// console.warn = (...args) => logger.warn(...args)
// console.info = (...args) => logger.info(...args)
// console.debug = (...args) => logger.debug(...args)

module.exports = loggerBuilder
