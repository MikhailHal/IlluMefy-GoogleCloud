import {FavoriteMode} from "../../../util/enum/FavoriteMode";

export interface ToggleFavoriteUseCaseProtocol {
    execute(userId: string, creatorId: string, mode: FavoriteMode): Promise<void>
}