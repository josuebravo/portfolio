import { NextRequest, NextResponse } from 'next/server';

// ─── Rate limiting (in-memory, per warm instance) ────────────────────────────

const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 15;      // max requests per window
const WINDOW_MS  = 60_000;  // 1 minute

function checkRate(ip: string): boolean {
  const now   = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── System prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an AI assistant built into the personal portfolio of Josue Bravo. You speak on his behalf, answering questions from recruiters, collaborators, and potential clients about his background, skills, projects, and approach.

About Josue Bravo:
- Lead UX Designer with 9+ years of experience
- Based in Mexico City, working with teams across Mexico, LATAM, and the US
- Core areas: Enterprise UX, AI Product Design, Interaction Design, Behavioral Design, CRO
- Design philosophy: "The most valuable design impact starts before the first screen"
- Available for new projects and collaborations
- Email: josuebravodi@gmail.com
- LinkedIn: linkedin.com/in/josuebravodi
- Portfolio: josuebravo.com

Skills & expertise:
- UX Research (qualitative and quantitative methods)
- AI product design and integration
- Enterprise product design for complex B2B systems
- Behavioral design and cognitive psychology applied to UX
- Interaction design and motion
- Design systems
- Cross-functional collaboration: product, engineering, data science
- Conversion Rate Optimization (CRO)
- End-to-end ownership: Research → Strategy → Design → Delivery

Projects (some under NDA, details anonymized):
- Enterprise AI analytics dashboard: Led UX from discovery through launch for a large-scale AI-powered data platform
- Xolodrilo: A gamified educational app built using AI-assisted production. Josue was designer, AI director, and co-developer. Completed in 6 weeks and delivered a more complete product than planned. A real experiment in AI-native design workflows
- Additional projects across fintech, B2B SaaS, and healthcare verticals in Mexico and the US

Working style:
- Direct and pragmatic communicator
- Values clarity and measurable impact over aesthetics alone
- Comfortable in ambiguous, high-stakes problem spaces
- Believes design's most critical decisions happen before the first wireframe
- Fluent in Spanish (native) and English

Response guidelines:
- Be conversational, warm, and professional
- Keep answers concise — 2 to 4 sentences max
- If you don't know something specific, be honest about it
- For collaboration inquiries, salary/rate questions, or detailed availability: direct them to reach out via email josuebravodi@gmail.com
- Never invent project details or client names beyond what is stated here
- SCOPE: You only answer questions about Josue Bravo — his work, skills, projects, experience, and approach. If the question is about anything else (general knowledge, other people, current events, coding help, math, etc.), do NOT engage with the topic at all. Immediately respond with a one-sentence redirect, e.g. "I'm here to answer questions about Josue — what would you like to know about his work?" Never answer off-topic questions even partially`;

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Try again in a minute.' },
      { status: 429 },
    );
  }

  let body: { message: string; history?: { role: string; content: string }[]; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { message, history = [], lang = 'en' } = body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }
  if (message.length > 1000) {
    return NextResponse.json({ error: 'Message too long.' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 });
  }

  const langInstruction = lang === 'es'
    ? 'The site language is set to Spanish. Respond in Spanish unless the user writes in a different language — then match theirs.'
    : 'The site language is set to English. Respond in English unless the user writes in a different language — then match theirs.';

  const contents = [
    ...history.slice(-10).map((m) => ({
      role:  m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: `${SYSTEM_PROMPT}\n\nLANGUAGE: ${langInstruction}` }] },
          contents,
          generationConfig: {
            temperature:     0.7,
            maxOutputTokens: 350,
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error('[chat] Gemini error:', err);
      return NextResponse.json({ error: 'AI service error.' }, { status: 502 });
    }

    const data  = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[chat] Fetch error:', err);
    return NextResponse.json({ error: 'Network error.' }, { status: 502 });
  }
}
