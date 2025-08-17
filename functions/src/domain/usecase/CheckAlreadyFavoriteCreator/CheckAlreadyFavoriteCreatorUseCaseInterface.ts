export interface CheckAlreadyFavoriteCreatorUseCaseInterface {
    execute(userId: string, creatorId: string): Promise<boolean>
}
