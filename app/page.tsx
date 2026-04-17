"use client";

import { useState, useRef, useEffect } from "react";

type Step = "idle" | "asking" | "answering" | "refining" | "done" | "error";

const SAMPLE_PROMPTS = [
  { label: "🍎 Give me a weekly meal plan", category: "Health" },
  { label: "💪 Build me a home workout", category: "Fitness" },
  { label: "💰 Help me create a budget", category: "Finance" },
  { label: "🎓 Teach me Spanish fast", category: "Learning" },
  { label: "🍳 Teach me to cook from zero", category: "Cooking" },
  { label: "💼 Help me get promoted", category: "Career" },
  { label: "🎨 Build my brand identity", category: "Creative" },
  { label: "🏠 Help me declutter my home", category: "Life" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [output, setOutput] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const prefill = sessionStorage.getItem("improv_prefill");
    if (prefill) {
      setInput(prefill);
      sessionStorage.removeItem("improv_prefill");
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [input]);

  const handleRefine = async () => {
    const trimmed = input.trim();
    if (!trimmed || step === "asking") return;
    setStep("asking");
    setQuestions([]);
    setAnswers({});
    setOutput("");
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) { setOutput(data.error || "Failed to generate questions."); setStep("error"); return; }
      setQuestions(data.questions || []);
      setStep("answering");
    } catch {
      setOutput("Network error. Check your connection.");
      setStep("error");
    }
  };

  const handleGenerate = async () => {
    setStep("refining");
    setOutput("");
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalMessage: input.trim(), answers }),
      });
      const data = await res.json();
      if (!res.ok) { setOutput(data.error || "Failed to generate prompt."); setStep("error"); return; }
      setOutput(data.prompt);
      setStep("done");
    } catch {
      setOutput("Network error. Check your connection.");
      setStep("error");
    }
  };

  const handleReset = () => {
    setInput(""); setQuestions([]); setAnswers({}); setOutput(""); setStep("idle");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleRefine(); }
  };

  const isLoading = step === "asking" || step === "refining";

  return (
    <main className="page">
      <header className="header">
        <span className="header-brand">I.</span>
        <nav className="header-nav">
          <a href="/docs">Docs</a>
          <a href="/examples">Examples</a>
          <button className="theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} title="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </header>

      <section className="hero">
        <h1 className="logo">
          <span className="logo-text">Improv</span>
          <span className="logo-period">.</span>
        </h1>
        <p className="tagline"><em>Turn any rough idea into a perfect AI prompt.</em></p>
      </section>

      {(step === "idle" || step === "error") && (
        <div className="samples-section">
          {SAMPLE_PROMPTS.map((s) => (
            <button
              key={s.label}
              className="sample-chip"
              onClick={() => {
                setInput(s.label.replace(/^[\p{Emoji}\s]+/u, "").trim());
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <section className="input-section">
        <div className={`input-wrap ${isLoading ? "loading" : ""}`}>
          <textarea
            ref={textareaRef}
            className="vision-input"
            placeholder="Describe what you need help with..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            spellCheck={false}
            autoComplete="off"
            disabled={isLoading || step === "answering"}
          />
          <button className="refine-btn" onClick={handleRefine} disabled={isLoading || !input.trim() || step === "answering"}>
            {step === "asking" ? <span className="spinner" /> : (
              <>Refine <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></>
            )}
          </button>
        </div>
        <p className="input-hint">
          <kbd>Enter</kbd> to refine &nbsp;·&nbsp; <kbd>Shift+Enter</kbd> for new line &nbsp;·&nbsp; <a href="/examples" style={{ color: "var(--accent)", textDecoration: "none" }}>Browse ready-made prompts →</a>
        </p>
      </section>

      {step === "answering" && questions.length > 0 && (
        <section className="questions-section">
          <div className="questions-card">
            <div className="questions-header">
              <span className="status-dot done" />
              <span className="questions-title">A few quick questions</span>
            </div>
            <div className="questions-list">
              {questions.map((q, i) => (
                <div className="question-item" key={i}>
                  <label className="question-label">
                    <span className="question-num">{i + 1}</span>{q}
                  </label>
                  <input
                    className="question-input"
                    type="text"
                    placeholder="Your answer..."
                    value={answers[i] || ""}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
                  />
                </div>
              ))}
            </div>
            <div className="questions-footer">
              <button className="skip-btn" onClick={handleGenerate}>Skip &amp; Generate</button>
              <button className="generate-btn" onClick={handleGenerate}>
                Generate Prompt
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {(step === "refining" || step === "done" || step === "error") && (
        <section className="output-section">
          <div className={`output-card ${step}`}>
            <div className="output-header">
              <div className="output-status">
                <span className={`status-dot ${step === "refining" ? "loading" : step}`} />
                <span className="status-label">
                  {step === "refining" && "generating..."}
                  {step === "done" && "refined prompt ready"}
                  {step === "error" && "error"}
                </span>
              </div>
              {step === "done" && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText(output)}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2H3.5A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.5" /></svg>
                    Copy
                  </button>
                  <button className="copy-btn" onClick={handleReset}>↺ Reset</button>
                </div>
              )}
            </div>
            <div className="output-body">
              {step === "refining" && <div className="thinking"><span /><span /><span /></div>}
              {(step === "done" || step === "error") && <pre className="output-text">{output}</pre>}
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        <span>Improv. © 2026</span>
        <span>Powered by Groq</span>
      </footer>
    </main>
  );
}
