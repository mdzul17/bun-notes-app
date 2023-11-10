import winston from "winston"
import path from "path"
import DailyRotateFile from "winston-daily-rotate-file"

const logDestination = path.join(path.dirname(import.meta.dir), "../tmp/log");

export class Logger {
    public filename: string
    private logger: any
    constructor(filename: string) {
        this.filename = filename
        this.logger = winston.createLogger({
            level: "silly",
            format: winston.format.printf(log => { return `${new Date()}: ${log.level.toUpperCase()} : ${log.message}` }),
            transports: [
                new winston.transports.Console({
                    level: "silly"
                }),
                new DailyRotateFile({
                    level: "info",
                    filename: `${logDestination}/${filename}-watch-%DATE%.log`,
                    zippedArchive: true,
                    maxSize: "1m",
                    maxFiles: "14d"
                }),
                new DailyRotateFile({
                    handleExceptions: true,
                    handleRejections: true,
                    filename: `${logDestination}/${filename}-excre-%DATE%.log`,
                    maxSize: "1m",
                    maxFiles: "14d"
                })
            ]
        })
    }

    info(message: any) {
        this.logger.info(message)
    }

    error(message: any) {
        this.logger.error(message)
    }

    warn(message: any) {
        this.logger.warn(message)
    }

    http(message: any) {
        this.logger.http(message)
    }

    verbose(message: any) {
        this.logger.verbose(message)
    }

    debug(message: any) {
        this.logger.debug(message)
    }

    silly(message: any) {
        this.logger.silly(message)
    }
}