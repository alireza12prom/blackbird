import { BaseException } from './base';
import { ErrorCodesConstants } from '../constants';

export class CreateSecureContextException extends BaseException {
  constructor(reason: string) {
    super(reason, ErrorCodesConstants.CREATE_SECURE_CONTEXT_FAILD);
  }
}
