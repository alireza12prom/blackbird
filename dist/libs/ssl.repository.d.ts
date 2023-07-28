import { SslDto } from '../dtos/libs';
export declare class SslRepository {
    private _repository;
    get repository(): SslDto.Repository[];
    exists({ hostname }: SslDto.IsUniqueDto): boolean;
    add({ hostname, secureContext }: SslDto.AddDto): void;
    remove({ hostname }: SslDto.RemoveDto): undefined;
    find({ hostname }: SslDto.FindDto): SslDto.Repository | null;
}
