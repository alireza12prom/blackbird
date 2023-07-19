import { BaseException } from './base';
import { ErrorCodesConstants } from '../constants';

export class AttachSSLFailedException extends BaseException {
  constructor(reason: string) {
    super(reason, ErrorCodesConstants.ATTACH_SSL_FAILD);
  }
}
