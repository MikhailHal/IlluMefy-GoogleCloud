import {Tag} from "../../../models/tag";

export interface GetTagsByIdListUseCaseProtocol {
    execute(tagIds: string[]): Promise<Tag[]>;
}
