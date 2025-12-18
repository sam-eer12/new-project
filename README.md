# 🌾 AgriTracker - Smart Farming Management System

A comprehensive full-stack web application designed to help farmers track crop health, instantly detect diseases using Multimodal AI, and manage their farming data.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system
- **Crop Management**: Full CRUD operations for tracking crops from planting to harvest
- **AI Disease Detection**: Upload leaf images for instant disease diagnosis using Google Gemini 2.5 Flash
- **Dashboard Analytics**: Real-time statistics and insights about your farming operations
- **Modern UI**: Beautiful, responsive interface built with React 19 and TailwindCSS 4

## 🏗️ Tech Stack

### Frontend
- **React 19** with Vite for fast development
- **React Router DOM** for navigation
- **TailwindCSS 4** for styling
- **Axios** for API calls

### Backend
- **FastAPI** (Python 3.12+) with async/await
- **MongoDB** with pymongo for data storage
- **Google Gemini 2.5 Flash** for AI-powered disease detection
- **JWT Authentication** with python-jose
- **Password Hashing** with passlib and bcrypt

## 📂 Project Structure

```
new-project/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar, Sidebar, Work)
│   │   ├── context/       # AuthContext and API configuration
│   │   ├── pages/         # Page components (Home, Login, Dashboard, etc.)
│   │   ├── App.jsx        # Main app with routing
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── server/                # Backend FastAPI application
    ├── main.py           # API routes and endpoints
    ├── security.py       # Authentication utilities
    ├── requirements.txt  # Python dependencies
    └── .env             # Environment variables
```

## 🔧 Setup Instructions

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with the following variables:
```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key_for_jwt
FRONTEND_URL=http://localhost:5173
PORT=8000
```

5. Run the server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```env
VITE_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/verify-token` - Verify JWT token

### Crop Management
- `GET /api/crops` - Get all user crops
- `POST /api/crops` - Create new crop
- `PUT /api/crops/{crop_id}` - Update crop
- `DELETE /api/crops/{crop_id}` - Delete crop

### AI Analysis
- `POST /api/analyze-leaf` - Analyze leaf by file upload
- `POST /api/analyze-leaf-url` - Analyze leaf by image URL

### Dashboard
- `GET /api/dashboard/stats` - Get user dashboard statistics

## 🎯 Usage

1. **Register/Login**: Create an account or login to access the dashboard
2. **Dashboard Home**: View your farming statistics and quick actions
3. **My Crops**: Add, edit, and manage your crops with detailed information
4. **Leaf Analyzer**: Upload leaf images to detect diseases and get cure suggestions
5. **Profile**: View and manage your account settings

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Secure token storage

## 🌟 Key Features Explained

### Crop Tracking
- Track crop name, type, planting date, expected harvest
- Monitor crop status (Active, Harvested, Planning)
- Add notes and area information
- Full CRUD operations

### AI Disease Detection
- Upload images or provide URLs
- Powered by Google Gemini 2.5 Flash
- Instant disease identification
- Organic cure suggestions
- Image preview and analysis history

### Dashboard Analytics
- Total crops count
- Active crops monitoring
- Harvested crops tracking
- Quick action buttons

## 🚧 Future Enhancements

- Video consultation with agricultural experts
- Advanced analytics and reporting
- Weather integration
- Mobile app development
- Multi-language support

## 📝 License

This project is part of a learning initiative for modern full-stack development.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ for farmers worldwide
