import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import OpenAI from "openai";

const app = express();

// Güvenlik & middleware
app.use(helmet());
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "*",
		credentials: true,
	})
);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(express.json({ limit: "10mb" }));

// OpenRouter setup
const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.OPENROUTER_API_KEY,
});

app.post("/api/explain-code", async (req, res) => {
	try {
		const { code, language } = req.body;
		if (!code || !language) {
			return res.status(400).json({ error: "code and language are required" });
		}

		const messages = [
			{
				role: "user",
				content: `Explain the following ${language || ""} code in simple terms:\n\n'''${language || ""}\n${code}\n'''`,
			},
		];

		const response = await openai.chat.completions.create({
			model: "tngtech/deepseek-r1t2-chimera:free",
			messages,
			temperature: 0.3,
			max_tokens: 800,
		});

		const explanation = response.choices[0]?.message?.content;
		if (!explanation) {
			return res.status(500).json({ error: "Failed to get explanation from AI" });
		}

		res.json({ explanation, language: language || "Unknown" });
	} catch (error) {
		console.error("Error in /api/explain-code:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export const handler = serverless(app);
