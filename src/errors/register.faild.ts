import { BaseException } from './base';
import { ErrorCodesConstants } from '../constants';

export class RegisterFailedException extends BaseException {
  constructor(reason: string) {
    super(reason, ErrorCodesConstants.REGISTER_FAILD);
  }
}
