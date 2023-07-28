import { UrlDto } from '../dtos/libs';
export declare function digest({ url }: UrlDto.DigestDto): {
    hostname: string;
    path: string;
    host: string;
    isValid: boolean;
    url: string;
};
export declare function detachHostFromPort(hostname: string): {
    host: string;
    port: string;
};
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
export declare function merge({ incomePath, sourcePath, targetPath }: UrlDto.MergeDto): string;
