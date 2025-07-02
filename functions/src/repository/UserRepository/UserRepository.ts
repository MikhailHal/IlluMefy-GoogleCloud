import {db, FieldValue} from "../../config/firebase";
import {User, UserDocument} from "../../models/user";

/**
 * ユーザーデータの基本操作に関するクラス
 */
export class UserRepository {
    private collection = db.collection("users");

    /**
     * idを用いたユーザー検索
     *
     * @param {string} id 検索対象のユーザーid
     * @return {User} ユーザー情報
     * @throws {Error} ユーザーが見つからない場合
     */
    public async getUserById(id: string): Promise<User> {
        const doc = await this.collection.doc(id).get();

        if (!doc.exists) {
            throw new Error(`User with id ${id} not found`);
        }

        return {
            id: doc.id,
            ...doc.data(),
        } as User;
    }

    /**
     * ユーザーの作成
     *
     * @param {string} id Firebase Auth UID
     * @param {UserDocument} userDocument 登録するユーザー
     * @return {string}  作成したユーザーのid
     */
    public async createUser(
        id: string,
        userDocument: UserDocument
    ): Promise<string> {
        await this.collection.doc(id).set(userDocument);
        return id;
    }

    /**
     * ユーザー情報の更新
     *
     * @param {string} id 更新対象のユーザーid
     * @param {Partial<UserDocument>} updates 更新するフィールド
     * @return {void}
     */
    public async updateUser(
        id: string,
        updates: Partial<UserDocument>
    ): Promise<void> {
        await this.collection.doc(id).update(updates);
    }

    /**
     * ユーザーの削除
     *
     * @param {string} id 削除対象のユーザーid
     * @return {void}
     */
    public async deleteUser(id: string): Promise<void> {
        await this.collection.doc(id).delete();
    }

    /**
     * クリエイターをお気に入り追加する
     *
     * @param {string} userId お気に入り追加操作を行うユーザーid
     * @param {string} creatorId お気に入り追加するクリエイターid
     * @throws {Error} 既にお気に入り追加されていた場合
     */
    public async addFavoriteCreator(
        userId: string,
        creatorId: string
    ): Promise<void> {
        const user = await this.getUserById(userId);

        if (user.favoriteCreators.includes(creatorId)) {
            throw new Error("Creator is already in favorites");
        }

        await this.collection.doc(userId).update({
            favoriteCreators: FieldValue.arrayUnion(creatorId),
        });
    }

    /**
     * クリエイターをお気に入りから削除する
     *
     * @param {string} userId お気に入り削除操作を行うユーザーid
     * @param {string} creatorId お気に入りから削除するクリエイターid
     * @throws {Error} 元々クリエイター情報がお気に入りリストに追加されていなかった場合
     */
    public async removeFavoriteCreator(
        userId: string,
        creatorId: string
    ): Promise<void> {
        const user = await this.getUserById(userId);

        if (!user.favoriteCreators.includes(creatorId)) {
            throw new Error("Creator is not in favorites");
        }

        await this.collection.doc(userId).update({
            favoriteCreators: FieldValue.arrayRemove(creatorId),
        });
    }
}
