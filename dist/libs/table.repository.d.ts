import { TableDto } from '../dtos/libs';
export declare class TableRepository {
    private _repository;
    get repository(): TableDto.Repository[];
    exists({ hostname }: TableDto.Exists): boolean;
    isUnique({ source, target }: TableDto.IsUniqueDto): boolean;
    add({ target, source }: TableDto.AddDto): void;
    remove({ source, target }: TableDto.RemoveDto): boolean;
    find({ hostname, path }: TableDto.FindDto): TableDto.Repository | null;
}
