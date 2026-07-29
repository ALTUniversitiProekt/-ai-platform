/* ============================================================
   ARUZHAN AI — SERVER.JS
   AI COMPANION BACKEND SERVER
   ============================================================ */

"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");


/* ============================================================
   1. CONFIGURATION
   ============================================================ */

const app = express();

const PORT =
    process.env.PORT || 3000;

const HOST =
    "0.0.0.0";


/* ============================================================
   2. OPENAI CLIENT
   ============================================================ */

const client =
    new OpenAI({

        apiKey:
            process.env.OPENAI_API_KEY

    });


/* ============================================================
   3. MIDDLEWARE
   ============================================================ */

app.use(

    cors({

        origin:
            true,

        credentials:
            true

    })

);


app.use(

    express.json({

        limit:
            "10mb"

    })

);


app.use(

    express.urlencoded({

        extended:
            true,

        limit:
            "10mb"

    })

);


/* ============================================================
   4. SERVE FRONTEND
   ============================================================ */

app.use(

    express.static(

        path.join(
            __dirname,
            "public"
        )

    )

);


/* ============================================================
   5. AI MODES
   ============================================================ */

const AI_MODES = {

    companion: {

        name:
            "Companion",

        instructions: `
Сен ARUZHAN AI Companion режимісің.

Пайдаланушымен табиғи және жылы сөйлес.
Жауаптарың түсінікті болсын.
Пайдаланушының нақты сұрағына нақты жауап бер.
Артық сөздерді қолданба.
Қажет болса мысал келтір.
Пайдаланушы қазақ тілінде жазса, қазақша жауап бер.
Орысша жазса, орысша жауап бер.
Ағылшынша жазса, ағылшынша жауап бер.
        `

    },


    smart: {

        name:
            "Smart AI",

        instructions: `
Сен ARUZHAN AI Smart режимісің.

Сен әмбебап жасанды интеллект көмекшісісің.
Кез келген тақырыптағы сұрақтарды түсінуге тырыс.
Ақпаратты нақты және логикалық түрде түсіндір.
Күрделі тақырыптарды қарапайым тілге аудар.
Егер ақпаратқа сенімді болмасаң, оны анық айт.
        `

    },


    study: {

        name:
            "Study",

        instructions: `
Сен ARUZHAN AI Study режимісің.

Сен студенттер мен оқушыларға көмектесесің.
Математика, физика, тарих, география,
информатика, тілдер және басқа пәндерді түсіндір.

Есептерді шешкен кезде шешу жолын көрсет.
Оқушыға дайын жауаппен қатар түсінуге көмектес.
        `

    },


    developer: {

        name:
            "Developer",

        instructions: `
Сен ARUZHAN AI Developer режимісің.

HTML, CSS, JavaScript, React, Vue,
Next.js, Node.js, Python, C++, C#,
Java, PHP, SQL және басқа технологиялар
бойынша көмектес.

Кодты толық және жұмыс істейтін түрде бер.
Қате кодты тексеруге көмектес.
Қажет болса файл құрылымын көрсет.
Кодтың қай файлға жазылатынын түсіндір.
        `

    },


    motivation: {

        name:
            "Motivation",

        instructions: `
Сен ARUZHAN AI Motivation режимісің.

Пайдаланушыға мақсат қоюға,
жоспар жасауға және өзіне сенімді болуға көмектес.

Жауаптарың шынайы, қысқа және пайдалы болсын.
        `

    }

};


/* ============================================================
   6. DEFAULT AI SYSTEM
   ============================================================ */

const DEFAULT_SYSTEM_PROMPT = `

Сен ARUZHAN AI деп аталатын заманауи
жасанды интеллект көмекшісісің.

Сенің негізгі міндетің —
пайдаланушының сұрақтарын түсініп,
мүмкіндігінше пайдалы, нақты және табиғи жауап беру.

Негізгі ережелер:

1. Пайдаланушының тілінде жауап бер.

2. Сұрақ түсініксіз болса,
   қысқа нақтылау сұрағын қой.

3. Қажетсіз ұзақ кіріспе жазба.

4. Фактілерді ойдан шығарма.

5. Код сұралса, кодты таза форматта бер.

6. Егер пайдаланушы белгілі бір технология,
   тіл немесе формат сұраса,
   соған бейімдел.

7. Жауапты құрылымды түрде бер.

8. Пайдаланушыға көмектесуге тырыс.

`;


/* ============================================================
   7. HEALTH CHECK
   ============================================================ */

app.get(

    "/api/health",

    (req, res) => {

        res.json({

            success:
                true,

            status:
                "online",

            service:
                "ARUZHAN AI",

            timestamp:
                new Date()
                    .toISOString()

        });

    }

);


/* ============================================================
   8. AI CHAT ENDPOINT
   ============================================================ */

app.post(

    "/api/chat",

    async (req, res) => {

        try {

            const {

                message,

                mode =
                    "companion",

                history =
                    [],

                conversationId

            } = req.body;


            /* --------------------------------------------
               VALIDATION
            -------------------------------------------- */

            if (
                !message ||
                typeof message !==
                    "string"
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    error:
                        "Message is required."

                });

            }


            const cleanMessage =
                message.trim();


            if (
                !cleanMessage
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    error:
                        "Message cannot be empty."

                });

            }


            /* --------------------------------------------
               SELECT AI MODE
            -------------------------------------------- */

            const selectedMode =

                AI_MODES[mode] ||

                AI_MODES.companion;


            /* --------------------------------------------
               SYSTEM PROMPT
            -------------------------------------------- */

            const systemPrompt =

                DEFAULT_SYSTEM_PROMPT +

                "\n\n" +

                selectedMode.instructions;


            /* --------------------------------------------
               PREPARE CHAT HISTORY
            -------------------------------------------- */

            const safeHistory =

                Array.isArray(history)

                    ? history
                        .slice(-20)
                        .filter(

                            item =>

                                item &&
                                (
                                    item.role ===
                                        "user" ||

                                    item.role ===
                                        "assistant"
                                ) &&
                                typeof item.content ===
                                    "string"

                        )

                    : [];


            /* --------------------------------------------
               CREATE MESSAGES
            -------------------------------------------- */

            const messages = [

                {

                    role:
                        "system",

                    content:
                        systemPrompt

                }

            ];


            safeHistory.forEach(

                item => {

                    messages.push({

                        role:
                            item.role,

                        content:
                            item.content

                    });

                }

            );


            messages.push({

                role:
                    "user",

                content:
                    cleanMessage

            });


            /* --------------------------------------------
               CALL AI
            -------------------------------------------- */

            const completion =

                await client.chat.completions.create({

                    model:
                        "gpt-4o-mini",

                    messages:

                        messages,

                    temperature:
                        0.7,

                    max_tokens:
                        4000

                });


            /* --------------------------------------------
               GET AI RESPONSE
            -------------------------------------------- */

            const reply =

                completion
                    .choices?.[0]
                    ?.message
                    ?.content
                    ?.trim();


            if (
                !reply
            ) {

                throw new Error(
                    "AI returned an empty response."
                );

            }


            /* --------------------------------------------
               RETURN RESPONSE
            -------------------------------------------- */

            return res.json({

                success:
                    true,

                reply:
                    reply,

                mode:
                    mode,

                conversationId:
                    conversationId ||
                    null,

                model:
                    "gpt-4o-mini",

                timestamp:
                    new Date()
                        .toISOString()

            });


        } catch (error) {

            console.error(

                "ARUZHAN AI ERROR:",

                error

            );


            /* --------------------------------------------
               ERROR RESPONSE
            -------------------------------------------- */

            return res.status(

                500

            ).json({

                success:
                    false,

                error:
                    "AI серверінде қате пайда болды.",

                details:

                    process.env.NODE_ENV ===
                    "development"

                        ? error.message

                        : undefined

            });

        }

    }

);


/* ============================================================
   9. STREAMING CHAT ENDPOINT
   ============================================================ */

app.post(

    "/api/chat/stream",

    async (req, res) => {

        try {

            const {

                message,

                mode =
                    "companion",

                history =
                    []

            } = req.body;


            if (
                !message
            ) {

                return res.status(
                    400
                ).json({

                    error:
                        "Message is required."

                });

            }


            const selectedMode =

                AI_MODES[mode] ||

                AI_MODES.companion;


            const systemPrompt =

                DEFAULT_SYSTEM_PROMPT +

                "\n\n" +

                selectedMode.instructions;


            const messages = [

                {

                    role:
                        "system",

                    content:
                        systemPrompt

                }

            ];


            if (
                Array.isArray(
                    history
                )
            ) {

                history
                    .slice(-20)
                    .forEach(

                        item => {

                            if (

                                (
                                    item.role ===
                                        "user" ||

                                    item.role ===
                                        "assistant"

                                ) &&

                                typeof item.content ===
                                    "string"

                            ) {

                                messages.push({

                                    role:
                                        item.role,

                                    content:
                                        item.content

                                });

                            }

                        }

                    );

            }


            messages.push({

                role:
                    "user",

                content:
                    message

            });


            const stream =

                await client.chat.completions.create({

                    model:
                        "gpt-4o-mini",

                    messages:
                        messages,

                    temperature:
                        0.7,

                    max_tokens:
                        4000,

                    stream:
                        true

                });


            res.setHeader(

                "Content-Type",

                "text/event-stream"

            );


            res.setHeader(

                "Cache-Control",

                "no-cache"

            );


            res.setHeader(

                "Connection",

                "keep-alive"

            );


            for await (

                const chunk of stream

            ) {

                const content =

                    chunk
                        .choices?.[0]
                        ?.delta
                        ?.content;


                if (
                    content
                ) {

                    res.write(

                        `data: ${JSON.stringify({

                            content:
                                content

                        })}\n\n`

                    );

                }

            }


            res.write(

                "data: [DONE]\n\n"

            );


            res.end();


        } catch (error) {

            console.error(

                "STREAM ERROR:",

                error

            );


            if (
                !res.headersSent
            ) {

                res.status(
                    500
                ).json({

                    error:
                        "Streaming error."

                });

            } else {

                res.end();

            }

        }

    }

);


/* ============================================================
   10. AI MODE LIST
   ============================================================ */

app.get(

    "/api/modes",

    (req, res) => {

        const modes =

            Object.entries(
                AI_MODES
            ).map(

                ([id, mode]) => ({

                    id:
                        id,

                    name:
                        mode.name

                })

            );


        res.json({

            success:
                true,

            modes:
                modes

        });

    }

);


/* ============================================================
   11. FALLBACK FRONTEND ROUTE
   ============================================================ */

app.get(

    "*",

    (req, res) => {

        res.sendFile(

            path.join(

                __dirname,

                "public",

                "index.html"

            )

        );

    }

);


/* ============================================================
   12. ERROR HANDLER
   ============================================================ */

app.use(

    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            error
        );


        res.status(

            error.status ||
            500

        ).json({

            success:
                false,

            error:
                "Internal server error."

        });

    }

);


/* ============================================================
   13. START SERVER
   ============================================================ */

app.listen(

    PORT,

    HOST,

    () => {

        console.log(

            "===================================="

        );

        console.log(

            "      ARUZHAN AI SERVER ONLINE"

        );

        console.log(

            "===================================="

        );

        console.log(

            `Server:
            http://localhost:${PORT}`

        );

        console.log(

            `AI:
            ${process.env.OPENAI_API_KEY
                ? "API KEY CONNECTED"
                : "API KEY NOT FOUND"}`

        );

        console.log(

            "===================================="

        );

    }

);


/* ============================================================
   14. PROCESS ERROR HANDLING
   ============================================================ */

process.on(

    "unhandledRejection",

    error => {

        console.error(

            "Unhandled Rejection:",

            error

        );

    }

);


process.on(

    "uncaughtException",

    error => {

        console.error(

            "Uncaught Exception:",

            error

        );

    }

);
