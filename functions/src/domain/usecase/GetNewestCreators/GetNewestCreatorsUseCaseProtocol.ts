import {Creator} from "../../../models/creator";

export interface GetNewestCreatorsUseCaseProtocol {
    execute(fetchCount: number): Promise<Creator[]>
}
