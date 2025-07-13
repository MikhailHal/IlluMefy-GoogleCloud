# IlluMefy Backend
## 🛠️ Development Setup

### Prerequisites
- Node.js 22.0 or later
- npm 9.0 or later
- Firebase CLI
- Google Cloud SDK (optional for advanced features)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/MikhailHal/IlluMefy-GoogleCloud.git
   cd IlluMefy-GoogleCloud
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and API keys
   ```

4. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

5. **Start local development**
   ```bash
   # Start Firebase emulators
   firebase emulators:start
   
   # In another terminal, start the development server
   npm run dev
   ```

## What's this backend?
IlluMefy Backend is the server-side infrastructure for the IlluMefy mobile application.  
It provides RESTful APIs for creator discovery, tag management, and user interactions.  
Built with Node.js and Firebase, it ensures scalable and real-time features for the community-driven folksonomy system.  
The backend handles authentication, content filtering, and data management for both iOS and Android clients.

## 🌟 Key Features

* **RESTful API Design**: Clean and intuitive endpoints for all client needs
* **Real-time Updates**: Firestore integration for instant data synchronization
* **Scalable Architecture**: Serverless functions that auto-scale with demand
* **Type Safety**: Full TypeScript implementation with Zod validation
* **Security First**: Firebase Authentication and proper authorization checks
* **Clean Architecture**: Layered architecture with use cases and repositories
* **Smart Tag Management**: Vector search-powered duplicate detection and auto-correction
* **Edit History Tracking**: Complete audit trail for all content modifications
* **Community-Driven**: User-editable tags with moderation and quality control

## 🚀 Our Vision
The backend serves as the foundation for IlluMefy's community-driven discovery system, processing millions of tags and recommendations to help users find their perfect content creators.

## 🔍 Current Status
IlluMefy Backend is under active development.  
MVP features are being implemented for the upcoming beta release.

## What are used in this backend?
### Basic Information
Runtime: Node.js 22  
Language: TypeScript 4.9  
Framework: 
* Express.js 5.1
* CORS 2.8
Database: Firestore (NoSQL)  
Infrastructure: Firebase Functions  
Package Manager: npm  
Linting: ESLint

### Services & APIs
* Firebase Admin SDK
* Firebase Authentication
* Firebase Functions
* Firestore Database
* Firestore Vector Search
* Google Secret Manager
* YouTube Data API
* OpenAI Embeddings API

### Libraries
#### Web Framework
* Express.js - Fast, unopinionated web framework
* CORS - Cross-Origin Resource Sharing middleware

#### Validation & Types
* TypeScript - Type-safe JavaScript development
* Zod - Runtime type validation and schema definition

#### Environment & Configuration
* dotenv - Environment variable management
* firebase-functions - Firebase Functions SDK

#### Development Tools
* ESLint - Code quality and consistency
* @typescript-eslint - TypeScript linting rules
* Firebase Emulators - Local development environment

### Architecture
The backend follows Clean Architecture pattern:
- **API Layer**: RESTful endpoints with Express.js
- **Use Case Layer**: Business logic and orchestration
- **Repository Layer**: Data access abstraction
- **Domain Layer**: Entities, schemas, and validation
- **Infrastructure Layer**: Firebase and external services

## 📚 API Documentation

### Authentication
All API endpoints (except health check) require Firebase Authentication:
```
Authorization: Bearer {idToken}
```

### Main Endpoints

#### Creators
- `GET /api/creators/popular` - Get popular creators
- `GET /api/creators/search?q=tag1,tag2` - Search creators by tags
- `GET /api/creators/:id` - Get creator details

#### Users
- `GET /api/users/favorites` - Get user's favorites
- `POST /api/users/favorites/:creatorId` - Add to favorites
- `DELETE /api/users/favorites/:creatorId` - Remove from favorites
- `POST /api/users/search-history` - Record search history
- `POST /api/users/view-history/:creatorId` - Record view history

#### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular` - Get popular tags
- `POST /api/tags` - Create new tag (with smart duplicate detection)
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

#### Edit History
- `GET /api/creators/:id/edit-history` - Get creator edit history
- `GET /api/users/edit-history` - Get user's edit history

#### Admin
- `POST /api/admin/creators` - Create new creator
- `PUT /api/admin/creators/:id` - Update creator
- `DELETE /api/admin/creators/:id` - Delete creator

## 🤝 Contributing

We welcome contributions to IlluMefy Backend! Here's how you can help:

### How to Contribute

1. **Fork the repository**
   - Click the "Fork" button at the top of this repository

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style and patterns
   - Add tests for new functionality
   - Update documentation as needed

4. **Run tests and linting**
   ```bash
   npm run lint
   npm test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: Add your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes in detail

### Code Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write comprehensive tests
- Keep functions small and focused
- Document complex logic
- Use meaningful variable names

### Reporting Issues

- Use GitHub Issues to report bugs
- Include API endpoint and request details
- Attach error logs if available
- Mention Node.js version and environment

## Related URL
・[iOS App](https://github.com/MikhailHal/IlluMefy-iOS)  
・[Android App](https://github.com/MikhailHal/IlluMefy-Android)