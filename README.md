# AI-Powered Personalized Storybook

A modern web application that creates personalized children's stories using advanced AI technology. Built with Next.js 14, TypeScript, and powered by OpenAI's GPT-4, DALL-E 3, and Whisper AI.

## 🚀 Features

- **AI Story Generation**: Create unique, personalized stories using GPT-4
- **Custom Illustrations**: Generate beautiful images with DALL-E 3
- **User Authentication**: Secure sign-in/sign-up with Clerk
- **Story Management**: Save, organize, and manage your story collection
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Collaboration**: Multiple users can work on the same story
- **Social Sharing**: Share stories across multiple platforms

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Clerk
- **Database**: Firebase/Firestore
- **AI Services**: OpenAI (GPT-4, DALL-E 3, Whisper)
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- OpenAI API Key with GPT-4, DALL-E 3, and Whisper access
- Clerk Account for authentication
- Firebase Project for database

## 🔧 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ai-storybook
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your API keys in `.env.local`:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   # ... other Firebase config
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

\`\`\`
ai-storybook/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── create-story/      # Story creation
│   ├── my-stories/        # User's stories
│   └── story/[id]/        # Story viewer
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
├── types/                # TypeScript definitions
└── public/               # Static assets
\`\`\`

## 🔐 Authentication & Security

- **User Isolation**: Each user can only access their own stories
- **Secure API Routes**: All endpoints require authentication
- **Data Privacy**: User data is properly isolated in Firebase
- **Environment Variables**: All secrets stored securely

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the project**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start production server**
   \`\`\`bash
   npm start
   \`\`\`

## 🔧 Configuration

### OpenAI Setup
1. Create account at [OpenAI Platform](https://platform.openai.com)
2. Generate API key with GPT-4, DALL-E 3, and Whisper access
3. Add to `.env.local`

### Clerk Authentication
1. Create application at [Clerk Dashboard](https://dashboard.clerk.com)
2. Configure authentication methods
3. Add publishable and secret keys to `.env.local`

### Firebase Setup
1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore database
3. Add configuration to `.env.local`

## 📊 Features Overview

### ✅ Completed Features
- [x] User authentication with Clerk
- [x] AI story generation with GPT-4
- [x] Custom image generation with DALL-E 3
- [x] Story management (CRUD operations)
- [x] Responsive design
- [x] User dashboard
- [x] Story gallery
- [x] Data isolation per user

### 🔄 Future Enhancements
- [ ] Real-time collaboration
- [ ] Audio narration
- [ ] Story templates
- [ ] Advanced analytics
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README
- **Issues**: Create a GitHub issue
- **Email**: support@ai-storybook.com

## 🎯 Production Checklist

- ✅ TypeScript errors resolved
- ✅ ESLint issues fixed
- ✅ Build passes without warnings
- ✅ Authentication working
- ✅ User data isolation
- ✅ Environment variables configured
- ✅ Production-ready deployment
- ✅ Clean code structure
- ✅ Proper error handling

---

**Happy Storytelling! 📚✨**
