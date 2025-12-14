import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        process.env.NODE_ENV === 'production'
          ? winston.format.json() // Produção = JSON
          : nestWinstonModuleUtilities.format.nestLike('MicroSaaS', {
              colors: true,
              prettyPrint: true,
            }), // Dev = Colorido
      ),
    }),
  ],
};