import {Tag} from "../../models/tag";

export interface IAlgoliaTagRepository {
    syncTags(tagList: Tag[]): Promise<void>;
    tagIncrementalSearch(query: string): Promise<Tag[] | null> ;
}
