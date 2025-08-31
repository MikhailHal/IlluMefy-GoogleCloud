# IlluMefy Backend

IlluMefyクリエイター発見プラットフォームのサーバーサイドインフラストラクチャ。

## 🛠️ 開発環境セットアップ

### 前提条件
- Node.js 22.0以上
- npm 9.0以上
- Firebase CLI
- Google Cloud SDK（高度な機能用、オプション）

### セットアップ手順

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/MikhailHal/IlluMefy-GoogleCloud.git
   cd IlluMefy-GoogleCloud
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **環境変数を設定**
   ```bash
   cp .env.example .env
   # .envファイルにFirebaseとAPIキーを設定
   ```

4. **Firebase CLIをインストール**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

5. **ローカル開発を開始**
   ```bash
   # Firebaseエミュレーターを起動
   firebase emulators:start
   
   # 別のターミナルで開発サーバーを起動
   npm run dev
   ```

## このバックエンドについて
IlluMefy BackendはIlluMefyモバイルアプリケーションのサーバーサイドインフラストラクチャです。  
クリエイター発見、タグ管理、ユーザーインタラクション用のRESTful APIを提供します。  
Node.jsとFirebaseで構築され、コミュニティ主導のフォークソノミーシステムのためのスケーラブルでリアルタイムな機能を保証します。  
バックエンドは認証、コンテンツフィルタリング、iOSおよびAndroidクライアント向けのデータ管理を処理します。

## 🌟 主要機能

* **RESTful API設計**: 全クライアントニーズに対応するクリーンで直感的なエンドポイント
* **リアルタイム更新**: 即座のデータ同期のためのFirestore統合
* **スケーラブルアーキテクチャ**: 需要に応じて自動スケールするサーバーレス関数
* **型安全性**: Zodバリデーション付きの完全なTypeScript実装
* **セキュリティ優先**: Firebase Authenticationと適切な認可チェック
* **Clean Architecture**: ユースケースとリポジトリによる階層化アーキテクチャ
* **スマートタグ管理**: ベクター検索駆動の重複検出と自動修正
* **AI搭載タグ生成**: Claude AIを使用したYouTubeチャンネルからの自動タグ作成
* **ウェブ検索統合**: 包括的なクリエイター情報のリアルタイムウェブ検索
* **コンテンツモデレーション**: 有害コンテンツ検出のためのPerspective API統合
* **編集履歴追跡**: 全てのコンテンツ変更の完全な監査証跡
* **コミュニティ主導**: モデレーションと品質管理付きのユーザー編集可能タグ

## 🚀 私たちのビジョン
バックエンドはIlluMefyのコミュニティ主導の発見システムの基盤として機能し、数百万のタグとレコメンデーションを処理して、ユーザーが完璧なコンテンツクリエイターを見つけるのを支援します。

## 🔍 現在のステータス
IlluMefy Backendは活発に開発中です。  
今後のベータリリースに向けてMVP機能が実装されています。

## このバックエンドで使用されているもの
### 基本情報
Runtime: Node.js 22  
Language: TypeScript 4.9  
Framework: 
* Express.js 5.1
* CORS 2.8
Database: Firestore (NoSQL)  
Infrastructure: Firebase Functions  
Package Manager: npm  
Linting: ESLint

### サービス・API
* Firebase Admin SDK
* Firebase Authentication
* Firebase Functions
* Firestore Database
* Firestore Vector Search
* Google Secret Manager
* YouTube Data API
* OpenAI Embeddings API
* Anthropic Claude API
* Brave Search API
* Google Perspective API

### ライブラリ
#### Web Framework
* Express.js - 高速で意見を持たないWebフレームワーク
* CORS - クロスオリジンリソース共有ミドルウェア

#### バリデーション・型
* TypeScript - 型安全なJavaScript開発
* Zod - ランタイム型バリデーションとスキーマ定義

#### 環境・設定
* dotenv - 環境変数管理
* firebase-functions - Firebase Functions SDK

#### 開発ツール
* ESLint - コード品質と一貫性
* @typescript-eslint - TypeScript リンティングルール
* Firebase Emulators - ローカル開発環境

### アーキテクチャ
バックエンドはClean Architectureパターンに従います：
- **API Layer**: Express.jsによるRESTfulエンドポイント
- **Use Case Layer**: ビジネスロジックとオーケストレーション
- **Repository Layer**: データアクセス抽象化
- **Domain Layer**: エンティティ、スキーマ、バリデーション
- **Infrastructure Layer**: Firebaseと外部サービス

## 📚 APIドキュメンテーション

### 認証
すべてのAPIエンドポイント（ヘルスチェック以外）はFirebase Authenticationが必要です：
```
Authorization: Bearer {idToken}
```

### メインエンドポイント

#### クリエイター
- `GET /api/creators/popular` - 人気のクリエイターを取得
- `GET /api/creators/search?q=tag1,tag2` - タグでクリエイターを検索
- `GET /api/creators/:id` - クリエイター詳細を取得

#### ユーザー
- `GET /api/users/favorites` - ユーザーのお気に入りを取得
- `POST /api/users/favorites/:creatorId` - お気に入りに追加
- `DELETE /api/users/favorites/:creatorId` - お気に入りから削除
- `POST /api/users/search-history` - 検索履歴を記録
- `POST /api/users/view-history/:creatorId` - 閲覧履歴を記録

#### タグ
- `GET /api/tags` - 全タグを取得
- `GET /api/tags/popular` - 人気のタグを取得
- `POST /api/tags` - 新しいタグを作成（スマート重複検出付き）
- `PUT /api/tags/:id` - タグを更新
- `DELETE /api/tags/:id` - タグを削除

#### 編集履歴
- `GET /api/creators/:id/edit-history` - クリエイター編集履歴を取得
- `GET /api/users/edit-history` - ユーザーの編集履歴を取得

#### 管理者
- `POST /api/admin/creators` - 新しいクリエイターを作成
- `POST /api/admin/creators/youtube` - YouTube チャンネルURLからクリエイターを作成（AIタグ生成付き）
- `PUT /api/admin/creators/:id` - クリエイターを更新
- `DELETE /api/admin/creators/:id` - クリエイターを削除

## 関連URL
・[iOS App](https://github.com/MikhailHal/IlluMefy-iOS)  
・[Android App](https://github.com/MikhailHal/IlluMefy-Android)