import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "GROQ_API_KEY is not set in .env.local" }, { status: 500 });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                max_tokens: 512,
                messages: [
                    {
                        role: "system",
                        content: `You are Improv, an expert prompt refinement assistant. A user has described a vision or idea. Ask 3 to 5 short, targeted clarifying questions to help turn their rough idea into a precise prompt.

Rules:
- Ask only what is genuinely unclear or missing
- Keep each question short and direct
- Return ONLY a valid JSON array of question strings, nothing else
- No preamble, no explanation, no markdown fences

Example: ["What programming language?", "Browser or server-side?", "What is the expected input?"]`,
                    },
                    {
                        role: "user",
                        content: `User vision: ${prompt}`,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errData = await response.json();
            return NextResponse.json({ error: errData?.error?.message || "Groq API error." }, { status: response.status });
        }

        const data = await response.json();
        const raw = data?.choices?.[0]?.message?.content || "[]";

        let questions = [];
        try {
            const cleaned = raw.replace(/```json|```/g, "").trim();
            questions = JSON.parse(cleaned);
            if (!Array.isArray(questions)) questions = [raw];
        } catch {
            questions = raw
                .split("\n")
                .map((q) => q.replace(/^[\d\-\.\*]+\s*/, "").trim())
                .filter(Boolean);
        }

        return NextResponse.json({ questions });
    } catch (err) {
        console.error("Questions route error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}