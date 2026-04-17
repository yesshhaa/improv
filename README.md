# Improv.
### *Refining thought into code — and everything else.*

Improv is an AI-powered prompt refinement tool for everyone. Type a rough idea, answer a few smart questions, and get a highly structured prompt that gets dramatically better results from any AI model.

Not just for developers. For your mom who wants a meal plan. For the designer building a brand. For anyone who knows what they want but doesn't know how to say it to an AI.

---

## What it does

Most people get bad results from AI because they don't know how to write good prompts. Improv fixes that.

1. **You describe your vision** — rough, vague, whatever. Just type it.
2. **Improv asks smart questions** — 3 to 5 targeted clarifying questions to understand exactly what you need.
3. **You get a refined prompt** — structured, specific, and engineered to get the best results from any LLM.
4. **Copy and use anywhere** — paste it into ChatGPT, Claude, Gemini, or any AI tool.

---

## Features

- ⚡ **Blazing fast** — powered by Groq's inference API with Llama 3.3 70B
- 🌗 **Dark / Light mode** — toggle between a deep gradient dark theme and a soft light theme
- 💡 **Sample prompts** — one-click chips for Health, Fitness, Finance, Cooking, Career, Creative and more
- 📚 **Ready-made prompt library** — 17+ detailed, copy-ready prompts across 8 life categories
- 🎨 **Visual prompt cards** — gradient thumbnails that match the vibe of each category
- 📖 **Docs page** — explains how Improv works with an FAQ
- 📱 **Fully responsive** — works on mobile, tablet and desktop

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | CSS Variables + Custom CSS |
| AI | Groq API — Llama 3.3 70B |
| Fonts | Instrument Serif, Syne, DM Mono |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/improv
cd improv
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at [console.groq.com](https://console.groq.com) — it's free with 14,400 requests/day.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running.

---

## Project Structure

```
app/
├── page.tsx                  # Home page — main refinement flow
├── examples/
│   └── page.tsx              # Ready-made prompt library
├── docs/
│   └── page.tsx              # How it works + FAQ
├── api/
│   ├── questions/
│   │   └── route.js          # Generates clarifying questions via Groq
│   └── prompt/
│       └── route.js          # Generates refined master prompt via Groq
├── globals.css               # All styles + dark/light theme tokens
└── layout.tsx                # Root layout
```

---

## How the AI flow works

```
User input
    ↓
/api/questions  →  Groq asks 3-5 clarifying questions
    ↓
User answers (or skips)
    ↓
/api/prompt  →  Groq generates structured master prompt
    ↓
Copy and use anywhere
```

---

## Prompt Categories

The examples page covers prompts for every area of life:

| Category | Examples |
|----------|----------|
| 🍎 Health | Personalized meal plans, sleep protocols, habit building |
| 💪 Fitness | Home workout programs, couch to 5K plans |
| 💰 Finance | Personal budgets, beginner investing roadmaps |
| 🎓 Learning | Language learning, skill acceleration frameworks |
| 🍳 Cooking | Learn to cook from zero, weekly meal prep systems |
| 💼 Career | Promotion strategies, career change roadmaps |
| 🎨 Creative | Brand identity briefs, SaaS landing page copy |
| 🏠 Life | Declutter systems, morning routine design |

---

## Deploying

The easiest way to deploy is [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repo on vercel.com
3. Add `GROQ_API_KEY` in the Environment Variables section
4. Deploy

---

## Contributing

Pull requests are welcome. For major changes please open an issue first to discuss what you'd like to change.

---

## License

MIT

---

<p align="center">Built with ✦ by someone who just wanted better AI prompts</p>