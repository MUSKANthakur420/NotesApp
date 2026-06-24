import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateNote = async (req, res) => {
    const { topic } = req.body;

    if (!topic?.trim()) {
        return res.status(400).json({ message: "Topic is required" });
    }

    try {
        // Set headers for SSE streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const stream = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            max_tokens: 1024,
            stream: true,
            messages: [
                {
                    role: "system",
                    content: `You are an expert tutor who explains concepts clearly and thoroughly. 
            You break down every topic with definitions, key points, formulas, and real examples.
            Always respond with clean HTML only — no markdown, no code blocks, no backticks.`,
                },
                {
                    role: "user",
                    content: `Create a detailed tutor-style note about: "${topic}".
            
            Structure it exactly like this:
            
            1. <h2>Overview</h2> — brief definition in simple words
            
            2. <h2> Key Concepts</h2> — use <ul><li> for each core point, explain each one clearly
            
            3. <h2> Formulas & Rules</h2> — use <ul><li> for each formula, wrap formula in <strong>, explain what each variable means
            
            4. <h2> Solved Example</h2> — one step by step example using <p> for each step, show working clearly
            
            5. <h2>⚡ Quick Tips</h2> — 3 to 5 exam tips or common mistakes as <ul><li>
            
            Rules:
            - Use <strong> for all key terms and formulas
            - Use <p> for explanations
            - Use <ul><li> for lists
            - Keep language simple like explaining to a student
            - Be thorough but concise (350-500 words)
            - Do NOT use markdown, only the HTML tags listed above
            - Do NOT wrap in any code block`,
                },
            ],
        });

        // Stream each chunk to the client
        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
            if (chunk.choices[0]?.finish_reason === "stop") {
                res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            }
        }

        res.end();
    } catch (err) {
        res.status(500).json({ message: "AI generation failed", error: err.message });
    }
};