# Chat Application with AI Integration

A modern, full-stack real-time chat application built with React and Node.js, featuring AI assistance powered by Google's Generative AI, user authentication, and project management capabilities.

## 🚀 Features

- **Real-time Chat**: Instant messaging with Socket.io
- **AI Integration**: Google Generative AI for intelligent responses
- **User Authentication**: Secure JWT-based authentication with bcrypt
- **Project Management**: Create and manage chat projects
- **Modern UI**: Beautiful responsive interface built with React and TailwindCSS
- **Real-time Collaboration**: Multi-user project collaboration
- **Secure**: Cookie-based session management and CORS protection

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for modern styling
- **React Router DOM** for navigation
- **Socket.io Client** for real-time communication
- **Axios** for HTTP requests
- **Markdown-to-JSX** for rich text rendering
- **Remixicon** for beautiful icons

### Backend
- **Node.js** with Express.js framework
- **Socket.io** for real-time WebSocket communication
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google Generative AI** for AI responses
- **bcrypt** for password hashing
- **CORS** and security middleware

## 📁 Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Route configurations
│   │   ├── auth/           # Authentication components
│   │   ├── context/        # React context providers
│   │   └── config/         # Configuration files
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
├── backend/                  # Express backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   ├── middleware/        # Custom middleware
│   ├── db/               # Database configuration
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
│
└── README.md             # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- MongoDB database
- Google Generative AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

5. **Start the Development Servers**
   
   **Backend** (from backend directory):
   ```bash
   npm start
   ```
   
   **Frontend** (from frontend directory):
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173` (Vite default)
   - Backend API: `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### AI Services
- `POST /api/ai` - Get AI response

## 🔧 Development Commands

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm start        # Start server
```

## 🚀 Deployment

The application is configured for deployment on Vercel with:
- Frontend: Automatically deployed from the `frontend` directory
- Backend: Serverless functions via `vercel.json` configuration

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. From project root: `vercel`
3. Follow the deployment prompts

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Socket.io authentication middleware
- Input validation with express-validator
- Cookie-based session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Ensure MongoDB connection is stable for real-time features
- Google AI API rate limits may apply
- WebSocket connections require proper CORS configuration

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Happy Coding! 🎉**
