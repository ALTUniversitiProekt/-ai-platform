/* ============================================================
   ARUZHAN AI — APP.JS
   FRONTEND AI CHAT APPLICATION
   ============================================================ */

"use strict";

/* ============================================================
   1. BACKEND CONFIGURATION
   ============================================================ */

// Render-ге server.js орналастырғаннан кейін
// осы жерге өз backend URL-іңді жазасың.
//
// Мысалы:
// const BACKEND_URL = "https://aruzhan-ai.onrender.com";

const BACKEND_URL =
    "https://YOUR-BACKEND-URL.onrender.com";


/* ============================================================
   2. APPLICATION STATE
   ============================================================ */

let chatHistory = [];

let currentMode =
    "companion";

let isLoading =
    false;

let conversationId =
    null;


/* ============================================================
   3. DOM ELEMENTS
   ============================================================ */

const messageInput =
    document.querySelector(
        "#messageInput"
    );

const sendButton =
    document.querySelector(
        "#sendButton"
    );

const chatMessages =
    document.querySelector(
        "#chatMessages"
    );

const modeSelector =
    document.querySelector(
        "#modeSelector"
    );

const clearButton =
    document.querySelector(
        "#clearChat"
    );

const typingIndicator =
    document.querySelector(
        "#typingIndicator"
    );


/* ============================================================
   4. INITIALIZE APP
   ============================================================ */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeApp();

    }

);


/* ============================================================
   5. INITIALIZE APPLICATION
   ============================================================ */

function initializeApp() {

    setupEventListeners();

    setupModeSelector();

    setupKeyboardShortcuts();

    loadChatHistory();

}


/* ============================================================
   6. EVENT LISTENERS
   ============================================================ */

function setupEventListeners() {

    if (
        sendButton
    ) {

        sendButton.addEventListener(

            "click",

            sendMessage

        );

    }


    if (
        messageInput
    ) {

        messageInput.addEventListener(

            "keydown",

            handleInputKeydown

        );

        messageInput.addEventListener(

            "input",

            autoResizeInput

        );

    }


    if (
        clearButton
    ) {

        clearButton.addEventListener(

            "click",

            clearChat

        );

    }

}


/* ============================================================
   7. KEYBOARD SHORTCUTS
   ============================================================ */

function setupKeyboardShortcuts() {

    document.addEventListener(

        "keydown",

        event => {

            // Ctrl + Enter
            if (
                event.ctrlKey &&
                event.key === "Enter"
            ) {

                event.preventDefault();

                sendMessage();

            }

        }

    );

}


/* ============================================================
   8. INPUT KEYDOWN
   ============================================================ */

function handleInputKeydown(
    event
) {

    // Enter sends message
    // Shift + Enter creates new line

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();

    }

}


/* ============================================================
   9. AUTO RESIZE INPUT
   ============================================================ */

function autoResizeInput() {

    if (
        !messageInput
    ) {

        return;

    }


    messageInput.style.height =
        "auto";


    messageInput.style.height =
        Math.min(

            messageInput.scrollHeight,

            180

        ) + "px";

}


/* ============================================================
   10. MODE SELECTOR
   ============================================================ */

function setupModeSelector() {

    if (
        !modeSelector
    ) {

        return;

    }


    modeSelector.addEventListener(

        "change",

        event => {

            currentMode =
                event.target.value;

        }

    );

}


/* ============================================================
   11. SEND MESSAGE
   ============================================================ */

async function sendMessage() {

    if (
        isLoading
    ) {

        return;

    }


    if (
        !messageInput
    ) {

        return;

    }


    const message =

        messageInput
            .value
            .trim();


    if (
        !message
    ) {

        return;

    }


    /* --------------------------------------------------------
       ADD USER MESSAGE
    -------------------------------------------------------- */

    addMessage(

        message,

        "user"

    );


    /* --------------------------------------------------------
       CLEAR INPUT
    -------------------------------------------------------- */

    messageInput.value =
        "";

    autoResizeInput();


    /* --------------------------------------------------------
       SHOW LOADING
    -------------------------------------------------------- */

    setLoading(
        true
    );


    /* --------------------------------------------------------
       SAVE USER MESSAGE
    -------------------------------------------------------- */

    chatHistory.push({

        role:
            "user",

        content:
            message

    });


    try {

        /* ----------------------------------------------------
           SEND REQUEST TO BACKEND
        ---------------------------------------------------- */

        const response =

            await fetch(

                `${BACKEND_URL}/api/chat`,

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:

                        JSON.stringify({

                            message:
                                message,

                            mode:
                                currentMode,

                            history:

                                chatHistory
                                    .slice(-20),

                            conversationId:
                                conversationId

                        })

                }

            );


        /* ----------------------------------------------------
           CHECK RESPONSE
        ---------------------------------------------------- */

        if (
            !response.ok
        ) {

            throw new Error(

                `Server error: ${response.status}`

            );

        }


        const data =

            await response.json();


        /* ----------------------------------------------------
           CHECK AI RESPONSE
        ---------------------------------------------------- */

        if (
            !data.success
        ) {

            throw new Error(

                data.error ||

                "AI response error."

            );

        }


        const aiReply =

            data.reply;


        conversationId =

            data.conversationId ||

            conversationId;


        /* ----------------------------------------------------
           ADD AI RESPONSE
        ---------------------------------------------------- */

        addMessage(

            aiReply,

            "assistant"

        );


        /* ----------------------------------------------------
           SAVE AI RESPONSE
        ---------------------------------------------------- */

        chatHistory.push({

            role:
                "assistant",

            content:
                aiReply

        });


        /* ----------------------------------------------------
           SAVE HISTORY
        ---------------------------------------------------- */

        saveChatHistory();


    } catch (
        error
    ) {

        console.error(

            "ARUZHAN AI ERROR:",

            error

        );


        addMessage(

            "Кешіріңіз, AI серверіне қосылу кезінде қате пайда болды.",

            "error"

        );

    } finally {

        setLoading(
            false
        );

    }

}


/* ============================================================
   12. ADD MESSAGE TO CHAT
   ============================================================ */

function addMessage(

    text,

    role

) {

    if (
        !chatMessages
    ) {

        return;

    }


    const messageElement =

        document.createElement(
            "div"
        );


    messageElement.className =

        `message message-${role}`;


    /* --------------------------------------------------------
       MESSAGE AVATAR
    -------------------------------------------------------- */

    const avatar =

        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    if (
        role === "user"
    ) {

        avatar.textContent =
            "You";

    } else {

        avatar.textContent =
            "AI";

    }


    /* --------------------------------------------------------
       MESSAGE CONTENT
    -------------------------------------------------------- */

    const content =

        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    /* --------------------------------------------------------
       MESSAGE TEXT
    -------------------------------------------------------- */

    const messageText =

        document.createElement(
            "div"
        );


    messageText.className =
        "message-text";


    if (
        role === "assistant"
    ) {

        messageText.innerHTML =

            formatAIResponse(
                text
            );

    } else {

        messageText.textContent =
            text;

    }


    /* --------------------------------------------------------
       MESSAGE TIME
    -------------------------------------------------------- */

    const time =

        document.createElement(
            "div"
        );


    time.className =
        "message-time";


    time.textContent =

        new Date()
            .toLocaleTimeString(

                "kk-KZ",

                {

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"

                }

            );


    /* --------------------------------------------------------
       BUILD MESSAGE
    -------------------------------------------------------- */

    content.appendChild(
        messageText
    );

    content.appendChild(
        time
    );


    messageElement.appendChild(
        avatar
    );

    messageElement.appendChild(
        content
    );


    chatMessages.appendChild(
        messageElement
    );


    /* --------------------------------------------------------
       SCROLL TO BOTTOM
    -------------------------------------------------------- */

    scrollToBottom();

}


/* ============================================================
   13. FORMAT AI RESPONSE
   ============================================================ */

function formatAIResponse(
    text
) {

    if (
        !text
    ) {

        return "";

    }


    let formatted =

        escapeHTML(
            text
        );


    /* --------------------------------------------------------
       CODE BLOCKS
    -------------------------------------------------------- */

    formatted =

        formatted.replace(

            /```([\s\S]*?)```/g,

            (

                match,

                code

            ) => {

                return `

                    <pre class="ai-code">

                        <code>

                            ${code.trim()}

                        </code>

                    </pre>

                `;

            }

        );


    /* --------------------------------------------------------
       BOLD
    -------------------------------------------------------- */

    formatted =

        formatted.replace(

            /\*\*(.*?)\*\*/g,

            "<strong>$1</strong>"

        );


    /* --------------------------------------------------------
       INLINE CODE
    -------------------------------------------------------- */

    formatted =

        formatted.replace(

            /`([^`]+)`/g,

            "<code>$1</code>"

        );


    /* --------------------------------------------------------
       NEW LINES
    -------------------------------------------------------- */

    formatted =

        formatted.replace(

            /\n/g,

            "<br>"

        );


    return formatted;

}


/* ============================================================
   14. ESCAPE HTML
   ============================================================ */

function escapeHTML(
    text
) {

    const div =

        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* ============================================================
   15. LOADING STATE
   ============================================================ */

function setLoading(
    loading
) {

    isLoading =
        loading;


    if (
        sendButton
    ) {

        sendButton.disabled =
            loading;

    }


    if (
        messageInput
    ) {

        messageInput.disabled =
            loading;

    }


    if (
        typingIndicator
    ) {

        typingIndicator.style.display =

            loading

                ? "flex"

                : "none";

    }


    if (
        loading
    ) {

        scrollToBottom();

    }

}


/* ============================================================
   16. SCROLL CHAT
   ============================================================ */

function scrollToBottom() {

    if (
        !chatMessages
    ) {

        return;

    }


    setTimeout(

        () => {

            chatMessages.scrollTo({

                top:
                    chatMessages.scrollHeight,

                behavior:
                    "smooth"

            });

        },

        50

    );

}


/* ============================================================
   17. CLEAR CHAT
   ============================================================ */

function clearChat() {

    const confirmed =

        confirm(

            "Чат тарихын өшіруге сенімдісіз бе?"

        );


    if (
        !confirmed
    ) {

        return;

    }


    chatHistory =
        [];

    conversationId =
        null;


    localStorage.removeItem(

        "aruzhan_ai_history"

    );


    if (
        chatMessages
    ) {

        chatMessages.innerHTML =
            "";

    }


    addWelcomeMessage();

}


/* ============================================================
   18. WELCOME MESSAGE
   ============================================================ */

function addWelcomeMessage() {

    addMessage(

        "Сәлем! Мен ARUZHAN AI. Қандай сұрағың бар?",

        "assistant"

    );

}


/* ============================================================
   19. LOCAL STORAGE
   ============================================================ */

function saveChatHistory() {

    try {

        localStorage.setItem(

            "aruzhan_ai_history",

            JSON.stringify(
                chatHistory
            )

        );

    } catch (
        error
    ) {

        console.error(

            "Could not save chat history:",

            error

        );

    }

}


/* ============================================================
   20. LOAD CHAT HISTORY
   ============================================================ */

function loadChatHistory() {

    try {

        const saved =

            localStorage.getItem(

                "aruzhan_ai_history"

            );


        if (
            saved
        ) {

            chatHistory =

                JSON.parse(
                    saved
                );


            chatHistory.forEach(

                message => {

                    addMessage(

                        message.content,

                        message.role

                    );

                }

            );

        } else {

            addWelcomeMessage();

        }

    } catch (
        error
    ) {

        console.error(

            "Could not load chat history:",

            error

        );


        addWelcomeMessage();

    }

}


/* ============================================================
   21. CHECK BACKEND
   ============================================================ */

async function checkBackend() {

    try {

        const response =

            await fetch(

                `${BACKEND_URL}/api/health`

            );


        const data =

            await response.json();


        if (
            data.success
        ) {

            console.log(

                "ARUZHAN AI backend: ONLINE"

            );

        }

    } catch (
        error
    ) {

        console.warn(

            "ARUZHAN AI backend is offline."

        );

    }

}


/* ============================================================
   22. START BACKEND CHECK
   ============================================================ */

checkBackend();


/* ============================================================
   23. GLOBAL FUNCTIONS
   ============================================================ */

window.ARUZHAN_AI = {

    sendMessage,

    clearChat,

    checkBackend,

    setMode: (

        mode

    ) => {

        currentMode =
            mode;

    },

    getHistory: () => {

        return chatHistory;

    }

};
