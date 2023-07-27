import urlParser from 'url-parse';
import validateUrl from 'valid-url';
import * as urlJoin from 'url-join-ts';
import { UrlDto } from '../dtos/libs';

export function digest({ url }: UrlDto.DigestDto) {
  let { pathname, host, origin, hostname } = new urlParser(url);

  return {
    hostname: host,
    path: pathname,
    host: hostname,
    isValid: validateUrl.isWebUri(url) ? true : false,
    url: origin + pathname,
  };
}

export function detachHostFromPort(hostname: string) {
  const [host, port] = hostname.split(':');
  return { host, port: port || '80' };
}

/**
 * @description
 *  1. the `sourcePath` shoud start with `incomePath`
 *  otherwise the result will be `targetPath`
 *
 *  2. the returned path always containt `/` at the first.
 * @example
 *  let incomePath = '/well/done/okey'
 *  let sourcePath = '/well/done'
 *  let targetPath = '/'
 *
 *  let result = targetPath + '/okey'
 *
 */
export function merge({ incomePath, sourcePath, targetPath }: UrlDto.MergeDto) {
  if (!incomePath.startsWith(sourcePath)) return '';

  const longPath = incomePath.split('/').filter((s) => s != '');
  const shortPath = sourcePath.split('/').filter((s) => s != '');

  return (
    urlJoin.urlJoin('/' + targetPath, longPath.slice(shortPath.length).join('/')) || '/'
  );
}
