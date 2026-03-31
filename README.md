# 🌸 Cope — Your Personal Space to Reflect, Track, and Grow

Cope is a comprehensive, mobile-first mental health and wellbeing platform designed to help you navigate life's challenges with clarity and compassion. Built with a focus on privacy and ease of use, it brings professional-grade tools like CBT and mindfulness directly to your pocket.

![Cope App Preview](https://img.shields.io/badge/Status-Ready_to_Deploy-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React_%7C_Supabase_%7C_Vite-blue)

## ✨ Key Features

### 🧠 Mind & Emotion Tools
- **Daily Mood Check-ins:** Log your mood, anxiety, and energy levels with an intuitive visual picker.
- **Thought Records:** Challenge and reframe negative thoughts using structured CBT techniques.
- **5-4-3-2-1 Grounding:** A guided sensory exercise to anchor yourself in the present moment during high-stress times.
- **Interactive Breathing:** Visual guided breathing exercises (4-7-8, Box Breathing) to regulate your nervous system.

### 📓 Reflection & Growth
- **The Vault:** A secure personal journal for free-writing and expressive sessions with focused timers.
- **Guided Journals:** Reflection prompts for work stress, self-worth, and relationship clarity.
- **Habit Tracking:** Monitor your daily "rituals" (walking, meditation, hydration) to see how they impact your mood.
- **Medication Manager:** Simple tracking for your prescriptions and daily rituals.

### 📈 Insights & Privacy
- **Trend Analytics:** Visualize your mood history and see correlations between habits and wellbeing.
- **Private & Secure:** Built on Supabase with Row Level Security (RLS) — your data is yours alone.
- **Cross-Platform:** Log in from any device; your progress stays in sync.

---

## 🚀 Quick Deployment

### 1. Database Setup (Supabase)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of `SUPABASE_SETUP.sql`. This sets up your tables and security policies. ✓

### 2. Live Hosting (Vercel)
1. Push this folder to a new **GitHub repository**.
2. Connect the repo to [Vercel](https://vercel.com).
3. Add these **Environment Variables** in Vercel:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase "Anon/Public" API key.
4. Click **Deploy**. Your app will be live in ~60 seconds. ✓

---

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment:**
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

---

## 📦 Tech Stack
- **Frontend:** React (Vite)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Custom CSS-in-JS (Premium Motion & Glassmorphism)
- **Deployment:** Vercel

---

## 🔐 Security & Privacy
Cope is designed with privacy-first architecture. It uses **Row Level Security (RLS)** to ensure that each user's data is strictly isolated. Even though the app communicates with a central database, your personal reflections and logs are only accessible through your authenticated account.
