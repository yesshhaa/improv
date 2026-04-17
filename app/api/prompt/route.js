import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { originalMessage, answers } = await request.json();

        if (!originalMessage || typeof originalMessage !== "string") {
            return NextResponse.json({ error: "originalMessage is required." }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "GROQ_API_KEY is not set in .env.local" }, { status: 500 });
        }

        const answersText = answers && Object.keys(answers).length > 0
            ? `\n\nUser refinements:\n${JSON.stringify(answers, null, 2)}`
            : "";

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 2048,
                messages: [
                    {
                        role: "system",
                        content: "You are a Master Prompt Engineer. Use the concept and refinements provided to write a highly structured, professional prompt that will get the best results from any LLM. Be specific, clear, and thorough.",
                    },
                    {
                        role: "user",
                        content: `Concept: ${originalMessage}${answersText}`,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errData = await response.json();
            return NextResponse.json({ error: errData?.error?.message || "Groq API error." }, { status: response.status });
        }

        const data = await response.json();
        const prompt = data?.choices?.[0]?.message?.content || "No response.";

        return NextResponse.json({ prompt });
    } catch (err) {
        console.error("Prompt route error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}