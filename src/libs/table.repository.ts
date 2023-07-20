import { TableDto } from '../dtos/libs';

export class TableRepository {
  private _repository: TableDto.Repository[] = [];

  get repository() {
    return this._repository;
  }

  exists({ hostname }: TableDto.Exists) {
    for (const host of this._repository) {
      if (host.hostname == hostname) return true;
    }
    return false;
  }

  isUnique({ source, target }: TableDto.IsUniqueDto) {
    let isUnique = true;
    for (const host of this._repository) {
      if (host.hostname == source.hostname && host.path == source.path) {
        host.subscriber.map((s) => {
          if (s.hostname == target.hostname && s.path == target.path) {
            isUnique = false;
          }
        });
        break;
      }
    }
    return isUnique;
  }

  add({ target, source }: TableDto.AddDto) {
    // create a subscriber
    const subscriber: TableDto.Subscriber = {
      hostname: target.hostname,
      path: target.path,
      redirect: target.redirect,
      ws: target.ws,
    };

    // add to subscriber if host already exists
    for (const host of this._repository) {
      if (host.hostname == source.hostname && host.path == source.path) {
        host.subscriber.push(subscriber);
        return;
      }
    }

    // create a new host object
    const host: TableDto.Repository = {
      hostname: source.hostname,
      path: source.path,
      rr: { http: 0, ws: 0 },
      subscriber: [subscriber],
    };
    this._repository.push(host);
  }

  remove({ source, target }: TableDto.RemoveDto) {
    let isRemoved: boolean = false;

    for (const host of this._repository) {
      if (host.hostname == source.hostname && host.path == source.path) {
        host.subscriber = host.subscriber.filter((sub) => {
          if (sub.hostname == target.hostname && sub.path == target.path) {
            isRemoved = true;
            return false;
          }
          return true;
        });

        // delete host if it doesn't have any subscribers
        if (host.subscriber.length) {
          this._repository = this._repository.filter((h) => h != host);
        }
        break;
      }
    }
    return isRemoved;
  }

  find({ hostname, path }: TableDto.FindDto) {
    for (const host of this._repository) {
      if (host.hostname == hostname) {
        if (!path || (path && (host.path == path || path.startsWith(host.path)))) {
          return host;
        }
      }
    }
    return null;
  }
}
