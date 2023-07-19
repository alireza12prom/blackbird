export class BaseException extends Error {
  constructor(reason: string, private code: string) {
    super(reason);
  }
}
