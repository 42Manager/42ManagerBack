import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

const logDir = 'logs';
const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
  };
};

export const winstonLogger = winston.createLogger({
  transports: [
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('error')),
  ],
});
