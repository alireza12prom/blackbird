import { SslDto } from '../dtos/libs';

export class SslRepository {
  private _repository: SslDto.Repository[] = [];

  get repository() {
    return this._repository;
  }

  exists({ hostname }: SslDto.IsUniqueDto) {
    for (const ssl of this._repository) {
      if (ssl.hostname == hostname) return true;
    }
    return false;
  }

  add({ hostname, secureContext }: SslDto.AddDto) {
    this._repository.push({ hostname, secureContext });
  }

  remove({ hostname }: SslDto.RemoveDto) {
    let removed: undefined | SslDto.Repository = undefined;
    this._repository = this._repository.filter((ssl) => {
      if (ssl.hostname != hostname) return true;
      else {
        removed = ssl;
        return false;
      }
    });
    return removed;
  }

  find({ hostname }: SslDto.FindDto) {
    for (const ssl of this._repository) {
      if (ssl.hostname == hostname) return ssl;
    }
    return null;
  }
}
