# IlluMefy GoogleCloud

IlluMefyクリエイター発見プラットフォームのサーバーサイドインフラストラクチャ。

## このバックエンドについて
IlluMefy GoogleCloudはIlluMefyモバイルアプリケーションのサーバーサイドインフラストラクチャです。  
クリエイター発見、タグ管理、ユーザーインタラクション用のRESTful APIを提供します。  
Node.jsとFirebaseで構築され、コミュニティ主導のフォークソノミーシステムのためのスケーラブルでリアルタイムな機能を保証します。  
バックエンドは認証、コンテンツフィルタリング、iOSおよびAndroidクライアント向けのデータ管理を処理します。

## 🌟 主要機能

* **RESTful API設計**: 全クライアントニーズに対応するクリーンで直感的なエンドポイント
* **型安全性**: Zodバリデーション付きの完全なTypeScript実装
* **セキュリティ優先**: Firebase Authenticationと適切な認可チェック
* **Clean Architecture**: ユースケースとリポジトリによる階層化アーキテクチャ
* **スマートタグ管理**: ベクター管理による重複検出と自動修正
* **AI搭載タグ生成**: OpenAIを使用したYouTubeチャンネル及び下記のウェブ検索統合からの自動タグ作成
* **ウェブ検索統合**: BraveSearch APIを用いたクリエイター情報のリアルタイムウェブ検索
* **コンテンツモデレーション**: 有害コンテンツ検出のためのPerspective API統合
* **編集履歴追跡**: 全てのコンテンツ変更の完全な監査証跡
* **コミュニティ主導**: モデレーションと品質管理付きのユーザー編集可能タグ

## 🔍 現在のステータス
IlluMefy Backendは活発に開発中です。  
今後のベータリリースに向けてMVP機能が実装されています。

## このバックエンドで使用されているもの
### 基本情報
Runtime: Node.js 22  
Language: TypeScript 4.9  
Framework: 
* Express.js 5.1
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
* Algolia

### ライブラリ
#### Web Framework
* Express.js - 高速で意見を持たないWebフレームワーク

#### バリデーション・型
* TypeScript - 型安全なJavaScript開発
* Zod - ランタイム型バリデーションとスキーマ定義

#### 環境・設定
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
- **Lib Layer**: Firebaseと外部サービス