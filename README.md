# Smart Todo List - Full Stack AI-Powered Task Management

A comprehensive full-stack task management application with AI-powered features, built with Django REST Framework backend and React frontend.

## Live Link
[View Live Demo](https://smart-todo-ai-one.vercel.app/) - Experience the full application with AI-powered features

> **Note:** Demo access uses shared API limits. For full functionality, clone and deploy with your own API keys.

## 🚀 Features

### Core Functionality
- **Smart Task Creation**: AI-powered task suggestions with improved descriptions, priority scoring, and deadline recommendations
- **Intelligent Context Processing**: Input emails, notes, or messages to automatically generate relevant tasks
- **Advanced Filtering**: Filter tasks by status, category, priority, and search terms
- **Real-time Updates**: Instant task updates with responsive UI
- **Category Management**: Organize tasks with custom categories and color coding

### AI-Powered Features
- **Task Enhancement**: AI improves task descriptions and suggests optimal priorities
- **Smart Deadlines**: Intelligent deadline suggestions based on task content
- **Context Analysis**: Extract actionable tasks from emails, notes, and messages
- **Priority Scoring**: AI-calculated priority scores (0-100) for better task management

### User Experience
- **Beautiful Design**: Modern glassmorphism UI with gradient backgrounds
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Dark Mode Ready**: Built with accessibility and modern design principles

## 🛠️ Tech Stack

### Backend
- **Django 4.2** with Django REST Framework
- **PostgreSQL** database (via Supabase)
- **OpenAI GPT-3.5 Turbo** for AI features
- **CORS Headers** for frontend integration

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons
- **Vite** for fast development

### AI Integration
- **OpenAI GPT-3.5 Turbo** for task intelligence
- **Context-aware suggestions** based on user input
- **Confidence scoring** for AI recommendations

## 🏗️ Project Structure

```
smart-todo-ai/
├── backend/                    # Django Backend
│   ├── smartapi/              # Django main project
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py           # Main URL configuration
│   │   └── wsgi.py           # WSGI application
│   ├── todos/                 # Main app
│   │   ├── models.py         # Task, Category, ContextEntry models
│   │   ├── views.py          # API viewsets
│   │   ├── serializers.py    # DRF serializers
│   │   ├── urls.py           # App URL patterns
│   │   └── admin.py          # Django admin
│   ├── ai_utils.py           # OpenAI integration
│   ├── requirements.txt      # Python dependencies
│   └── manage.py             # Django management
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API client and utilities
│   │   ├── pages/           # Page components
│   │   └── types/           # TypeScript types
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Vite configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ and pip
- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   SECRET_KEY=your_django_secret_key_here
   DEBUG=True
   DATABASE_URL=postgresql://username:password@localhost:5432/smart_todo_db
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Django development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Models

#### Task
- `id` (Primary Key)
- `title` (CharField, required)
- `description` (TextField)
- `priority` (IntegerField, 0-100)
- `status` (CharField: pending, in_progress, completed)
- `category` (ForeignKey to Category)
- `due_date` (DateTimeField, optional)
- `ai_suggested` (BooleanField)
- `user` (ForeignKey to User)
- `created_at`, `updated_at` (DateTimeFields)

#### Category
- `id` (Primary Key)
- `name` (CharField, required)
- `color` (CharField, hex color)
- `icon` (CharField, icon name)
- `user` (ForeignKey to User)
- `created_at` (DateTimeField)

#### ContextEntry
- `id` (Primary Key)
- `content` (TextField, required)
- `type` (CharField: email, note, message)
- `processed` (BooleanField)
- `user` (ForeignKey to User)
- `created_at` (DateTimeField)

## 🤖 AI Integration

### Task Enhancement
The AI system analyzes task titles and provides:
- **Improved Descriptions**: More detailed and actionable task descriptions
- **Priority Scoring**: Intelligent priority levels (0-100)
- **Deadline Suggestions**: Optimal due dates based on task complexity
- **Category Recommendations**: Suggested categories for better organization

### Context Processing
Input various types of content:
- **Email Content**: Extract actionable items from emails
- **Meeting Notes**: Convert notes into structured tasks
- **Message Threads**: Identify follow-up actions from conversations

### Example AI Output
```json
{
  "improved_description": "Review and analyze Q4 sales performance data, identify trends, and prepare executive summary with recommendations for Q1 strategy",
  "priority_score": 85,
  "suggested_deadline": "2024-01-15T17:00:00Z",
  "suggested_category": "work",
  "confidence": 92
}
```

## 🔧 API Endpoints

### Tasks
- `GET /api/tasks/` - List tasks with filtering
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get task details
- `PATCH /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task
- `PATCH /api/tasks/{id}/toggle_status/` - Toggle task status
- `GET /api/tasks/stats/` - Get task statistics
- `POST /api/tasks/ai_suggestions/` - Get AI suggestions

### Categories
- `GET /api/categories/` - List categories
- `POST /api/categories/` - Create category
- `POST /api/categories/create_defaults/` - Create default categories

### Context
- `GET /api/context/` - List context entries
- `POST /api/context/` - Create context entry
- `POST /api/context/{id}/process/` - Process context with AI

## 🎨 Design System

### Color Palette
- **Primary**: Purple to Blue gradient (#9333EA → #3B82F6)
- **Secondary**: Teal to Cyan gradient (#14B8A6 → #06B6D4)
- **Accent**: Orange gradient (#F97316 → #EF4444)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Inter font family, 120% line height
- **Body**: Inter font family, 150% line height
- **Weight Scale**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 🔒 Security Features

- **User Authentication**: Django's built-in authentication
- **CORS Configuration**: Proper CORS setup for frontend-backend communication
- **Input Validation**: Comprehensive validation on both frontend and backend
- **SQL Injection Protection**: Django ORM provides protection
- **XSS Protection**: React's built-in XSS protection

## 🚀 Deployment

### Backend Deployment
1. Set up production database
2. Configure environment variables
3. Run `python manage.py collectstatic`
4. Deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production

## 📈 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexing
- **API Pagination**: Paginated responses for large datasets
- **Frontend Optimization**: Code splitting and lazy loading
- **Caching**: Browser caching for static assets

## 🙏 Acknowledgments

- **OpenAI** for GPT-3.5 Turbo API
- **Django** team for the amazing framework
- **React** team for the frontend framework
- **Tailwind CSS** for the styling system

---

Built with ❤️ using Django, React, and OpenAI
