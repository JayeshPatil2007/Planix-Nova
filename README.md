<div align="center">

# 🚀 Planix Nova
### AI Learning Operating System powered by Amazon Nova

Planix Nova is an intelligent AI learning system that generates structured learning roadmaps, teaches concepts interactively, analyzes documents and images, and guides users through personalized skill development using Amazon Nova models via AWS Bedrock.

Built for the **Amazon Nova AI Hackathon**.

</div>

---

# 🌟 Overview

Planix Nova is an AI-powered learning operating system that helps users turn learning goals into structured execution systems.

Instead of browsing scattered tutorials, users can define:

• what they want to learn  
• how many days they have  
• how many hours per day they can dedicate  

Planix Nova then generates a **complete AI learning roadmap**, teaches concepts interactively, analyzes uploaded materials, and tracks learning progress.

---

# 🎯 Problem

Modern learners face several major challenges:

• information overload  
• no structured learning path  
• random tutorials without progression  
• lack of accountability and tracking  

Even with AI tools available today, most solutions simply answer questions rather than **design a full learning system**.

---

# 🧠 Solution

Planix Nova acts as an **AI learning architect**.

Instead of simply responding to prompts, the system:

• generates structured learning roadmaps  
• teaches each concept interactively  
• analyzes uploaded learning materials  
• provides contextual tutoring  
• tracks progress across milestones  

This transforms learning into a **clear, structured system for skill development**.

---

# 🚀 Core Features

## AI Roadmap Generator

Users define:

• learning goal  
• number of days  
• hours per day  

Amazon Nova generates a **structured learning roadmap** consisting of phases and objectives.

---

## AI Teaching Mode

Users can ask the AI to explain roadmap topics.

The AI returns structured explanations including:

• concept explanation  
• examples  
• practical applications  
• practice tasks

---

## Structured Notes Generation

Users can generate structured notes including:

• topic definitions  
• key concepts  
• examples  
• summaries

---

## Multimodal Learning Agent

Planix Nova can analyze:

• uploaded images  
• uploaded PDF documents  

The AI integrates this information into responses and explanations.

---

## Voice Interaction

Users can speak directly to the AI using voice input.

Voice is converted to text and processed by the AI assistant.

---

## Progress Tracking

Each roadmap objective includes a checkbox.

Progress bars automatically update based on completed objectives.

---

# 🛠 Tech Stack

Frontend

• Next.js 15 (App Router)  
• React  
• TypeScript  
• Tailwind CSS  
• Framer Motion  

Backend

• Next.js API Routes  

AI Model

• Amazon Nova via AWS Bedrock  

Database

• Prisma ORM  
• SQLite (development) or Supabase PostgreSQL

---

# 🤖 Amazon Nova Integration

Planix Nova uses **Amazon Nova models via AWS Bedrock** to power the AI reasoning system.

The AI is responsible for:

• generating learning roadmaps  
• tutoring users  
• analyzing uploaded documents  
• generating structured notes  
• answering contextual learning questions  

This allows the system to function as an **intelligent learning agent rather than a simple chatbot**.

---

# 🏗 Architecture

```
User
 ↓
Next.js Frontend
 ↓
API Routes
 ↓
AWS Bedrock
 ↓
Amazon Nova Model
 ↓
Database (Prisma / Supabase)
```

Amazon Nova provides the reasoning engine responsible for roadmap generation, tutoring, and multimodal document understanding.

---

# 📂 Project Structure

```
planix-nova/
│
├── app/
│   ├── api/
│   │   ├── roadmap/
│   │   ├── chat/
│   │   └── notes/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── views/
│   │   ├── SplashIntro.tsx
│   │   ├── Onboarding.tsx
│   │   └── Workspace.tsx
│   │
│   ├── workspace/
│   │   ├── Navbar.tsx
│   │   ├── Roadmap.tsx
│   │   └── HistoryDrawer.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx
│
├── lib/
│   ├── bedrock.ts
│   ├── prisma.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── hooks/
│   └── use-mobile.ts
│
├── README.md
├── package.json
└── tsconfig.json
```

---

# ⚙️ Installation

### Prerequisites

Node.js 18+

AWS account with Bedrock access

---

# Clone Repository

```
git clone https://github.com/YOUR_USERNAME/planix-nova.git
cd planix-nova
```

---

# Install Dependencies

```
npm install
```

---

# Environment Variables

Create `.env.local`

```
BEDROCK_API_KEY=your_bedrock_api_key
DATABASE_URL="file:./dev.db"
```

---

# Run Development Server

```
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

# 🧩 How It Works

1. User enters a learning goal
2. Amazon Nova generates a structured roadmap
3. Roadmap phases and objectives are displayed
4. Users interact with the AI tutor
5. Documents and images can be uploaded for analysis
6. Progress is tracked across roadmap milestones

---

# 🏆 Hackathon Highlights

Planix Nova demonstrates:

• AI roadmap generation  
• multimodal reasoning  
• conversational tutoring  
• voice interaction  
• structured notes generation  
• progress tracking  

This transforms AI from a simple chatbot into a **full learning operating system**.

---

# 📈 Future Scope

• collaborative learning environments  
• adaptive roadmap recalculation  
• shared learning roadmaps  
• mobile application

---

# 📜 License

MIT License

---

<div align="center">

Built by **Jayesh Patil**

AI Builder | Hackathon Developer

</div>
