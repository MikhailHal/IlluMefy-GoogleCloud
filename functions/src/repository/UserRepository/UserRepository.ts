import {db, FieldValue} from "../../lib/firebase/firebase";
import {User, UserDocument} from "../../models/user";
import {Timestamp} from "firebase-admin/firestore";
import {FavoriteMode} from "../../util/enum/FavoriteMode";
import {ValidationError} from "../../base/error/ValidationError";

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
     * お気に入り操作の切り替え
     *
     * @param {string} userId ユーザーId
     * @param {string} creatorId クリエイターId
     * @param {FavoriteMode} mode 切り替えモード
     */
    public async toggleFavorite(
        userId: string,
        creatorId: string,
        mode: FavoriteMode,
    ): Promise<void> {
        if (!userId || !creatorId) {
            throw new ValidationError("userId and creatorId are required.");
        }
        switch (mode) {
        case FavoriteMode.Add:
            await this.addFavorite(
                userId,
                creatorId,
            );
            break;
        case FavoriteMode.Remove:
            await this.deleteFavorite(
                userId,
                creatorId,
            );
            break;
        }
    }

    /**
     * お気に入り追加
     *
     * @param {string} userId ユーザーId
     * @param {string} creatorId クリエイターId
     */
    private async addFavorite(
        userId: string,
        creatorId: string,
    ): Promise<void> {
        const ref = this.collection
            .doc(userId)
            .collection("favorites")
            .doc(creatorId);

        await ref.set({
            creatorId: creatorId,
            createdAt: FieldValue.serverTimestamp(),
        });
    }

    /**
     * お気に入り削除
     *
     * @param {string} userId ユーザーId
     * @param {string} creatorId クリエイターId
     */
    private async deleteFavorite(
        userId: string,
        creatorId: string,
    ): Promise<void> {
        await this.collection
            .doc(userId)
            .collection("favorites")
            .doc(creatorId)
            .delete();
    }

    /**
     * 検索履歴を追加する（100件制限）
     *
     * @param {string} userId 検索履歴を追加するユーザーid
     * @param {string[]} tagIds 検索に使用したタグIDの配列
     */
    public async addSearchHistory(
        userId: string,
        tagIds: string[]
    ): Promise<void> {
        const user = await this.getUserById(userId);
        const searchEntry = {
            tagIds: tagIds,
            timestamp: FieldValue.serverTimestamp(),
        };

        let updatedHistory = [...user.searchTagHistories, searchEntry as unknown as {
            tagIds: string[];
            timestamp: Timestamp;
        }];

        // 100件制限：古いものから削除
        if (updatedHistory.length > 100) {
            updatedHistory = updatedHistory.slice(-100);
        }

        await this.collection.doc(userId).update({
            searchTagHistories: updatedHistory,
        });
    }

    /**
     * 閲覧履歴を追加する（100件制限）
     *
     * @param {string} userId 閲覧履歴を追加するユーザーid
     * @param {string} creatorId 閲覧したクリエイターのid
     */
    public async addViewHistory(
        userId: string,
        creatorId: string
    ): Promise<void> {
        const user = await this.getUserById(userId);
        const viewEntry = {
            creatorId: creatorId,
            timestamp: FieldValue.serverTimestamp(),
        };

        let updatedHistory = [...user.viewCreatorHistories, viewEntry as unknown as {
            creatorId: string;
            timestamp: Timestamp;
        }];

        // 100件制限：古いものから削除
        if (updatedHistory.length > 100) {
            updatedHistory = updatedHistory.slice(-100);
        }

        await this.collection.doc(userId).update({
            viewCreatorHistories: updatedHistory,
        });
    }
}
