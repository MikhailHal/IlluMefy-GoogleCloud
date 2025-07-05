# API実装TODO

## 🔴 最優先事項

### 1. Firebase認証ミドルウェアの実装
```typescript
// src/middleware/auth.ts
- Firebase Auth トークンの検証
- ユーザー情報の抽出とreq.userへの追加
- 認証エラーハンドリング
```

### 2. 基本APIエンドポイントの実装

#### クリエイター関連API
- [ ] `GET /api/creators/search?tags=tag1,tag2&limit=20`
  - SearchCreatorsUseCaseを使用
  - クエリパラメータ: tags（必須）, limit（オプション、デフォルト20）
  
- [ ] `GET /api/creators/popular?limit=20`
  - GetPopularCreatorsUseCaseを使用
  - クエリパラメータ: limit（オプション、デフォルト20）
  
- [ ] `GET /api/creators/:id`
  - GetCreatorByIdUseCaseを使用
  - パスパラメータ: id（必須）

#### ユーザー関連API（要認証）
- [ ] `GET /api/users/me/favorites`
  - GetUserFavoritesUseCaseを使用
  - 認証必須、req.user.uidを使用
  
- [ ] `POST /api/users/me/favorites/:creatorId`
  - AddFavoriteCreatorUseCaseを使用
  - パスパラメータ: creatorId（必須）
  - 認証必須
  
- [ ] `DELETE /api/users/me/favorites/:creatorId`
  - 新しいRemoveFavoriteCreatorUseCaseが必要
  - パスパラメータ: creatorId（必須）
  - 認証必須

#### タグ関連API
- [ ] `GET /api/tags`
  - GetAllTagsUseCaseを使用
  
- [ ] `GET /api/tags/popular?limit=10`
  - GetPopularTagsUseCaseを使用
  - クエリパラメータ: limit（オプション、デフォルト10）

## 🟡 重要だが後回し可能

### 3. 管理者API（要認証・要権限チェック）
- [ ] `POST /api/admin/creators` - クリエイター作成
- [ ] `PUT /api/admin/creators/:id` - クリエイター更新
- [ ] `DELETE /api/admin/creators/:id` - クリエイター削除

### 4. 履歴系API（要認証）
- [ ] `POST /api/users/me/search-history` - 検索履歴追加
- [ ] `POST /api/users/me/view-history` - 閲覧履歴追加

### 5. リクエストバリデーション
- [ ] Zodによるスキーマ定義
- [ ] バリデーションミドルウェアの作成
- [ ] 各エンドポイントへの適用

## 🟢 将来的な改善

### 6. ミドルウェアの追加
- [ ] レート制限（express-rate-limit）
- [ ] リクエストロギング（morgan）
- [ ] セキュリティヘッダー（helmet）
- [ ] 圧縮（compression）

### 7. API仕様・ドキュメント
- [ ] OpenAPI/Swagger定義
- [ ] 型定義の自動生成
- [ ] APIドキュメントページ

### 8. 高度な機能
- [ ] ページネーション（cursor-based）
- [ ] ソート機能（人気順、新着順など）
- [ ] 詳細フィルタリング
- [ ] レスポンスフィールドの選択
- [ ] WebSocket（リアルタイム更新）

## 実装の進め方

1. **まず認証ミドルウェアを実装**
   - これがないと他のAPIが保護できない

2. **公開API（認証不要）から実装**
   - クリエイター検索
   - クリエイター詳細
   - タグ一覧

3. **認証必要なAPIを実装**
   - お気に入り機能
   - 履歴系

4. **管理者APIは最後**
   - 権限管理の仕組みが必要

## 注意事項

- エラーハンドリングは既存のAppError系を活用
- UseCaseは既に実装済みなので、それをAPIに繋ぐだけ
- レスポンス形式は統一する（成功時・エラー時）
- CORSは既に設定済み

## レスポンス形式の例

### 成功時
```json
{
  "data": {
    // 実際のデータ
  }
}
```

### エラー時（既に実装済み）
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Creator not found"
  }
}
```