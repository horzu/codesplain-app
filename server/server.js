import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import OpenAI from "openai";

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3001",
		credentials: true,
	})
);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(express.json({ limit: "10mb" })); // Body limit is 10mb

const API_KEY = process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: API_KEY,
});

app.post("/api/explain-code", async (req, res) => {
	try {
		const { code, language } = req.body;
		console.log("BODY:", req.body);
		if (!code || !language) {
			return res.status(400).json({ error: "code and language are required" });
		}

		const messages = {
			role: "user",
			content: `Explain the following ${language || ""} code in simple terms:\n\n\'\'\'${
				language || ""
			}\n${code}\n\'\'\'`,
		};

		const response = await openai.chat.completions.create({
			model: "tngtech/deepseek-r1t2-chimera:free",
			messages: [messages],
			temprature: 0.3,
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

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});