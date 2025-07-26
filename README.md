# LangQuest Backend

A comprehensive language learning platform backend built with Node.js, Express, TypeScript, and Prisma. This API powers interactive language learning experiences with AI-generated content, text-to-speech capabilities, and user progress tracking.

## 🌐 Live Deployment

**Backend URL:** [https://langquest-backend.onrender.com](https://langquest-backend.onrender.com)

## 🚀 Features

### Core Functionality
- **AI-Powered Scene Generation**: Create interactive language learning scenarios using Google Gemini AI
- **Text-to-Speech Integration**: Generate audio for script lines using Murf AI
- **User Response Tracking**: Store and manage user interactions with learning content
- **Multi-Language Support**: Support for various target languages
- **Progress Tracking**: Monitor user learning progress and mistakes

### API Endpoints
- **Scene Management**: Create and retrieve learning scenes with script lines
- **User Responses**: Track user interactions and responses
- **Lesson System**: Generate and manage lessons with AI-powered content
- **Tutorial Progress**: Track completion status and user progress

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: 
  - Google Gemini AI for content generation
  - Murf AI for text-to-speech
- **Database Hosting**: Neon (PostgreSQL)
- **Deployment**: Render

## 📁 Project Structure

```
langquest-backend/
├── controllers/           # Business logic controllers
│   └── lesson-controller/ # Lesson generation and management
├── prisma/               # Database schema and migrations
├── routes/               # API route definitions
│   ├── scene.ts         # Scene management endpoints
│   ├── userResponse.ts  # User response tracking
│   └── lesson.ts        # Lesson management
├── utils/               # Utility functions
│   └── prisma.ts       # Database client singleton
├── types/               # TypeScript type definitions
├── prompt/              # AI prompt templates
└── dist/               # Compiled JavaScript (production)
```

## 🗄 Database Schema

### Core Models
- **Scene**: Learning scenarios with metadata
- **ScriptLine**: Individual dialogue lines with TTS audio
- **UserResponse**: User interactions and responses
- **User**: User accounts and preferences
- **Lesson**: AI-generated lesson content
- **Tutorial**: Learning tutorials and progress tracking

## 🔧 API Endpoints

### Scene Management
```
POST /scene              # Create new learning scene
GET /scene               # Get latest scene with script lines
```

### User Responses
```
POST /userResponse       # Record user response to script line
GET /userResponse        # Retrieve all user responses
```

### Lessons
```
POST /lesson             # Generate new lesson content
GET /lesson/:userId      # Get user's lessons
```

### Health Check
```
GET /                    # API health check
GET /health              # Detailed health status
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Google AI API key
- Murf AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dev-Dhruba/LangQuest-backend.git
   cd LangQuest-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   GOOGLE_API_KEY="your_google_ai_api_key"
   MURF_API_KEY="your_murf_ai_api_key"
   PORT=8000
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Production Build

```bash
npm run build
npm start
```

## 🔧 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run compile` - Compile TypeScript

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `GOOGLE_API_KEY` | Google Gemini AI API key | ✅ |
| `MURF_API_KEY` | Murf AI TTS API key | ✅ |
| `PORT` | Server port (default: 8000) | ❌ |
| `NODE_ENV` | Environment (production/development) | ❌ |

## 📊 Database Migrations

The project uses Prisma for database management:

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 🔒 Security Features

- **CORS enabled** for cross-origin requests
- **Environment variables** for sensitive data
- **Input validation** for API endpoints
- **Error handling** with detailed logging

## 🧪 Testing API Endpoints

### Create a Scene
```bash
curl -X POST https://langquest-backend.onrender.com/scene \
  -H "Content-Type: application/json" \
  -d '{"language": "Korean"}'
```

### Get Latest Scene
```bash
curl https://langquest-backend.onrender.com/scene
```

### Record User Response
```bash
curl -X POST https://langquest-backend.onrender.com/userResponse \
  -H "Content-Type: application/json" \
  -d '{"scriptLineId": 1, "response": "안녕하세요"}'
```

## 🚀 Deployment

### Render Deployment
1. Connect GitHub repository to Render
2. Configure build settings:
   - **Build Command**: `npm ci && npx prisma generate && npx tsc`
   - **Start Command**: `npm start`
3. Add environment variables in Render dashboard
4. Deploy automatically on git push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 API Documentation

### Response Format
All API responses follow this structure:
```json
{
  "message": "Success message",
  "data": {...},
  "count": 10 // (for list responses)
}
```

### Error Format
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Dev-Dhruba** - [GitHub Profile](https://github.com/Dev-Dhruba)

## 🔗 Related Projects

- Frontend Repository: [Add your frontend repo link here]
- Mobile App: [Add your mobile app repo link here]

---

**Live API**: [https://langquest-backend.onrender.com](https://langquest-backend.onrender.com)

For questions or support, please open an issue in the GitHub repository.
