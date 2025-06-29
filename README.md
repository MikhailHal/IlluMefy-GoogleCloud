# IlluMefy Backend
## 🛠️ Development Setup

### Prerequisites
- Node.js 18.0 or later
- npm 9.0 or later
- Firebase CLI
- Google Cloud SDK (optional for advanced features)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/YourUsername/IlluMefy-GoogleCloud.git
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

* RESTful API Design: Clean and intuitive endpoints for all client needs
* Real-time Updates: Firestore integration for instant data synchronization
* Content Moderation: Perspective API integration for safe community tagging
* Scalable Architecture: Serverless functions that auto-scale with demand
* Type Safety: Full TypeScript implementation with Zod validation
* Security First: Firebase Authentication and proper authorization checks

## 🚀 Our Vision
The backend serves as the foundation for IlluMefy's community-driven discovery system, processing millions of tags and recommendations to help users find their perfect content creators.

## 🔍 Current Status
IlluMefy Backend is under active development.  
MVP features are being implemented for the upcoming beta release.

## What are used in this backend?
### Basic Information
Runtime: Node.js 18+  
Language: TypeScript 5  
Framework: 
* Express.js
* CORS
Database: Firestore (NoSQL)  
Infrastructure: Firebase Functions → Cloud Run (for scaling)  
Package Manager: npm  
Testing: Jest  
Linting: ESLint + Prettier  
CI/CD: GitHub Actions

### Services & APIs
* Firebase Admin SDK
* Firebase Authentication
* Firestore Database
* Firebase Storage
* Perspective API (Content Filtering)

### Libraries
#### Web Framework
* Express.js
* Cors
* Helmet (Security)

#### Validation & Types
* TypeScript
* Zod (Schema Validation)

#### Logging & Monitoring
* Winston (Logging)
* Firebase Performance Monitoring

#### Testing
* Jest
* Supertest
* Firebase Emulators

### Architecture
The backend follows a layered architecture pattern:
- **API Layer**: RESTful endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access
- **Model Layer**: Data structures and validation

## 📚 API Documentation

### Authentication
All API endpoints (except health check) require Firebase Authentication:
```
Authorization: Bearer {idToken}
```

### Main Endpoints

#### Creators
- `GET /api/creators` - List creators with pagination
- `GET /api/creators/:id` - Get creator details
- `GET /api/creators/popular` - Get popular creators
- `GET /api/creators/recommended` - Get recommended creators
- `POST /api/creators/search` - Search creators by tags

#### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites/:creatorId` - Add to favorites
- `DELETE /api/favorites/:creatorId` - Remove from favorites

#### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular` - Get trending tags
- `POST /api/tags/apply` - Apply for new tag

For complete API documentation, see [API_SPECIFICATION.md](./API_SPECIFICATION.md)

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