import { BaseException } from './base';
import { ErrorCodesConstants } from '../constants';

export class HttpServerException extends BaseException {
  constructor(reason: string) {
    super(reason, ErrorCodesConstants.HTTP_SERVER);
  }
}
