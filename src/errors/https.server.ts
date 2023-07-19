import { BaseException } from './base';
import { ErrorCodesConstants } from '../constants';

export class HttpsServerException extends BaseException {
  constructor(reason: string) {
    super(reason, ErrorCodesConstants.HTTPS_SERVER);
  }
}
