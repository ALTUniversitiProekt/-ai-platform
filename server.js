// ============================================================
// ARUZHAN AI — SERVER.JS
// AI CHAT BACKEND
// ============================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;

// ============================================================
// OPENAI CLIENT
// ============================================================

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
    cors({
        origin: "*"
    })
);

app.use(
    express.json({
        limit: "10mb"
    })
);

// ============================================================
// AI MODES
// ============================================================

const MODES = {

    companion: `
You are ARUZHAN AI Companion.

Speak naturally, warmly and clearly.
Answer the user's actual question directly.
Do not use unnecessary introductions.
If the user writes in Kazakh, answer in Kazakh.
If the user writes in Russian, answer in Russian.
If the user writes in English, answer in English.
Be helpful and natural.
`,

    smart: `
You are ARUZHAN AI Smart Assistant.

You are a universal AI assistant.
Answer questions about many different topics.
Explain complicated topics in simple language.
Give accurate and useful answers.
If you are uncertain about something, clearly say so.
`,

    study: `
You are ARUZHAN AI Study Assistant.

Help students understand educational topics.
Explain mathematics, physics, history,
geography, programming, languages and other subjects.

When solving problems, explain the solution step by step.
Focus on helping the user understand the topic.
`,

    developer: `
You are ARUZHAN AI Developer.

Help users with programming and technology.

You can help with:
HTML
CSS
JavaScript
React
Next.js
Node.js
Python
C++
C#
Java
PHP
SQL
Firebase
APIs
Databases
and other technologies.

When the user asks for code:
- provide complete code
- use correct syntax
- explain which file the code belongs to
- help debug errors
- suggest better architecture when useful
`,

    motivation: `
You are ARUZHAN AI Motivation Assistant.

Help users with goals, planning,
productivity and personal development.

Be supportive, realistic and practical.
Do not give unnecessary motivational speeches.
Focus on useful advice.
`

};

// ============================================================
// DEFAULT SYSTEM PROMPT
// ============================================================

const DEFAULT_PROMPT = `

You are ARUZHAN AI, an advanced AI assistant.

Your goal is to understand the user's request
and provide the most useful answer possible.

Rules:

1. Answer in the user's language.

2. Be direct and clear.

3. Do not invent facts.

4. If the question is unclear,
ask a short clarification question.

5. If the user asks for code,
provide clean and complete code.

6. If the user asks to build a website,
help with architecture, UI and functionality.

7. If the user asks for a project,
provide practical implementation steps.

8. Do not repeat the user's question unnecessarily.

9. Avoid unnecessary filler text.

10. Be helpful and natural.

`;

// ============================================================
// HOME / HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        name: "ARUZHAN AI",
        status: "online",
        message: "ARUZHAN AI server is running."
    });

});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        status: "online",

        service: "ARUZHAN AI",

        time: new Date().toISOString()

    });

});

// ============================================================
// AVAILABLE MODES
// ============================================================

app.get("/api/modes", (req, res) => {

    res.json({

        success: true,

        modes: [
            {
                id: "companion",
                name: "Companion"
            },
            {
                id: "smart",
                name: "Smart AI"
            },
            {
                id: "study",
                name: "Study"
            },
            {
                id: "developer",
                name: "Developer"
            },
            {
                id: "motivation",
                name: "Motivation"
            }
        ]

    });

});

// ============================================================
// MAIN AI CHAT
// ============================================================

app.post("/api/chat", async (req, res) => {

    try {

        const {

            message,

            mode = "companion",

            history = [],

            conversationId = null

        } = req.body;


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (
            !message ||
            typeof message !== "string"
        ) {

            return res.status(400).json({

                success: false,

                error: "Message is required."

            });

        }


        const cleanMessage =
            message.trim();


        if (!cleanMessage) {

            return res.status(400).json({

                success: false,

                error: "Message cannot be empty."

            });

        }


        // ----------------------------------------------------
        // SELECT MODE
        // ----------------------------------------------------

        const selectedMode =

            MODES[mode] ||

            MODES.companion;


        // ----------------------------------------------------
        // CREATE SYSTEM PROMPT
        // ----------------------------------------------------

        const systemPrompt =

            DEFAULT_PROMPT +

            "\n\n" +

            selectedMode;


        // ----------------------------------------------------
        // PREPARE HISTORY
        // ----------------------------------------------------

        const safeHistory =

            Array.isArray(history)

                ? history
                    .slice(-20)
                    .filter(item =>

                        item &&

                        (
                            item.role === "user" ||
                            item.role === "assistant"
                        ) &&

                        typeof item.content === "string"

                    )

                : [];


        // ----------------------------------------------------
        // CREATE MESSAGES
        // ----------------------------------------------------

        const messages = [

            {
                role: "system",

                content: systemPrompt
            }

        ];


        for (
            const item of safeHistory
        ) {

            messages.push({

                role: item.role,

                content: item.content

            });

        }


        messages.push({

            role: "user",

            content: cleanMessage

        });


        // ----------------------------------------------------
        // SEND REQUEST TO AI
        // ----------------------------------------------------

        const completion =

            await openai.chat.completions.create({

                model: "gpt-4o-mini",

                messages: messages,

                temperature: 0.7,

                max_tokens: 4000

            });


        // ----------------------------------------------------
        // GET AI ANSWER
        // ----------------------------------------------------

        const answer =

            completion
                .choices
                ?.at(0)
                ?.message
                ?.content
                ?.trim();


        if (!answer) {

            throw new Error(
                "AI returned an empty response."
            );

        }


        // ----------------------------------------------------
        // SEND RESPONSE TO FRONTEND
        // ----------------------------------------------------

        return res.json({

            success: true,

            reply: answer,

            mode: mode,

            conversationId:
                conversationId,

            timestamp:
                new Date().toISOString()

        });


    } catch (error) {

        console.error(
            "ARUZHAN AI ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                "ARUZHAN AI серверінде қате пайда болды."

        });

    }

});

// ============================================================
// 404
// ============================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        error: "API route not found."

    });

});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "SERVER ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            error: "Internal server error."

        });

    }
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
    PORT,
    () => {

        console.log(
            "===================================="
        );

        console.log(
            "       ARUZHAN AI SERVER"
        );

        console.log(
            "===================================="
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            "AI backend is ready."
        );

        console.log(
            "===================================="
        );

    }
);
