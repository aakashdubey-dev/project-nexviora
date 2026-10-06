const express = require("express");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config({ path: path.join(__dirname, "backend", ".env") });

const app = express();
const PORT = 3000;

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

app.use(express.json({ limit: "12mb" }));

const frontendPath = path.join(__dirname, "backend", "frontend");

app.use(express.static(frontendPath));

app.post("/api/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        const response = await openai.chat.completions.create({
            model: "nvidia/nemotron-3.5-lightning:free",
            messages: [
                {
                    role: "user",
                    content: question
                }
            ]
        });

        res.json({
            answer: response.choices[0].message.content
        });

    } catch (error) {
        console.error("OpenRouter Error:", error);

        res.status(500).json({
            error: "AI response generate nahi ho paaya."
        });
    }
});

// ==========================================
// AI ANSWER EVALUATION
// ==========================================

app.post("/api/evaluate", async (req, res) => {

    try {

        const {
            question,
            answer,
            level,
            subject,
            topic
        } = req.body;

        if (!question || !answer) {

            return res.status(400).json({
                error: "Question and answer are required"
            });

        }

        const evaluationPrompt = `
Evaluate a student's answer.

Education Level: ${level}
Subject: ${subject}
Topic: ${topic}

Question:
${question}

Student's Answer:
${answer}

Evaluate the answer fairly according to the student's education level.

Return ONLY valid JSON in this exact format:

{
  "score": 0,
  "verdict": "Correct",
  "feedback": "Short feedback explaining the answer."
}

Rules:
- score must be a number from 0 to 10.
- Give partial marks when the answer is partially correct.
- "verdict" should be one of: "Correct", "Partially Correct", "Incorrect".
- Keep feedback short and easy to understand.
- Do not include markdown.
- Do not include anything outside the JSON.
`;

        const response =
            await openai.chat.completions.create({

                model: "nvidia/nemotron-3.5-lightning:free",

                messages: [
                    {
                        role: "user",
                        content: evaluationPrompt
                    }
                ]

            });

        const aiResponse =
            response.choices[0].message.content.trim();

        let evaluation;

        try {

            evaluation = JSON.parse(aiResponse);

        } catch (parseError) {

            console.error(
                "AI JSON Parse Error:",
                aiResponse
            );

            return res.status(500).json({
                error: "AI evaluation format invalid."
            });

        }

        res.json({
            score: evaluation.score,
            verdict: evaluation.verdict,
            feedback: evaluation.feedback
        });

    } catch (error) {

        console.error(
            "OpenRouter Evaluation Error:",
            error
        );

        res.status(500).json({
            error: "AI answer evaluation nahi ho paaya."
        });

    }

});

app.post("/api/assistant", async (req, res) => {
    try {
        const { message, imageData } = req.body;

        if ((!message || !message.trim()) && !imageData) {
            return res.status(400).json({
                error: "Message or image is required."
            });
        }

        let content;

        if (imageData) {
            if (
                typeof imageData !== "string" ||
                !/^data:image\/(png|jpeg|webp);base64,/i.test(imageData) ||
                imageData.length > 10_000_000
            ) {
                return res.status(400).json({
                    error: "Please upload a valid image under the size limit."
                });
            }

            content = [
                {
                    type: "text",
                    text: `You are Nexviora JARVIS, a friendly educational assistant.
Explain the uploaded image to a student in simple language.
Answer the student's question if one is provided.
If it contains a textbook question, explain how to solve it.

Student's message: ${message || "Please explain this image."}`
                },
                {
                    type: "image_url",
                    image_url: { url: imageData }
                }
            ];
        } else {
            content = message.trim();
        }

const response = await openai.chat.completions.create({
    model: imageData
        ? (process.env.OPENROUTER_VISION_MODEL || "qwen/qwen3.8-27b")
        : "nvidia/nemotron-3.5-lightning:free",
    max_tokens: 1000,
    messages:  [
                {
                    role: "system",
                    content: "You are Nexviora JARVIS, a helpful educational assistant. Give clear, student-friendly answers."
                },
                {
                    role: "user",
                    content
                }
            ]
        });

        const answer = response.choices?.[0]?.message?.content;

        if (!answer) {
            throw new Error("The AI returned an empty response.");
        }

        res.json({ answer });
    } catch (error) {
        console.error("JARVIS Error:", error.message);

        res.status(500).json({
            error: "JARVIS could not respond. Check the server terminal and model availability."
        });
    }
});
app.listen(PORT, () => {
    console.log(`Nexviora server running at http://localhost:${PORT}`);
});