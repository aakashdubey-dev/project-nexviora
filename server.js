const express = require("express");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config({ path: path.join(__dirname, "backend", ".env") });

const app = express();
const PORT = 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

const frontendPath = path.join(__dirname, "backend", "frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.post("/api/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        const response = await openai.responses.create({
            model: "gpt-5-mini",
            input: question
        });

        res.json({
            answer: response.output_text
        });

    } catch (error) {
        console.error("OpenAI Error:", error);

        res.status(500).json({
            error: "AI response generate nahi ho paaya."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Nexviora server running at http://localhost:${PORT}`);
});