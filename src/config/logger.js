import winston from 'winston'

const { combine, timestamp, json, printf } = winston.format

const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        consoleFormat
      )
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
})

export default logger