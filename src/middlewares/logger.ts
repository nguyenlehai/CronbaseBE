import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import * as geoip from 'geoip-lite';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    let realIp = request.header('X-Real-IP') || ip;
    const cfIPCountry = request.header('CF-IPCountry');
    const userAgent = request.get('user-agent') || '';
    const location = geoip.lookup(realIp);
    if (realIp === '::1') {
      realIp = 'localhost';
    } else if (realIp.includes('::ffff:')) {
      realIp = realIp.replace('::ffff:', '');
    }
    request['realIp'] = realIp;
    request['location'] = location;
    request['isRegionJP'] =
      (cfIPCountry ? cfIPCountry : location?.country) == 'JP';
    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${realIp}:${location?.city}/${location?.region}`,
      );
    });

    next();
  }
}
