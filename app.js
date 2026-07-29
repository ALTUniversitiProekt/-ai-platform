```javascript
/* =========================================================
   ERNURVYNX AI — APP.JS
   Main Application Logic
   ========================================================= */

"use strict";

/* =========================================================
   1. GLOBAL APP CONFIG
   ========================================================= */

const APP_CONFIG = {
    name: "ERNURVYNX AI",
    version: "1.0.0",
    defaultLanguage: "kz",
    defaultTheme: "dark",
    maxMessageLength: 4000,
    typingSpeed: 25,
    storagePrefix: "ernurvynx_"
};


/* =========================================================
   2. GLOBAL STATE
   ========================================================= */

const AppState = {
    language: localStorage.getItem("ernurvynx_language") || APP_CONFIG.defaultLanguage,

    theme: localStorage.getItem("ernurvynx_theme") || APP_CONFIG.defaultTheme,

    isChatOpen: false,

    isMobileMenuOpen: false,

    isTyping: false,

    messages: JSON.parse(
        localStorage.getItem("ernurvynx_chat_history") || "[]"
    ),

    user: {
        name: localStorage.getItem("ernurvynx_user_name") || "Қонақ",
        loggedIn: false
    }
};


/* =========================================================
   3. DOM ELEMENTS
   ========================================================= */

const DOM = {
    body: document.body,

    html: document.documentElement,

    navbar: document.querySelector(".navbar"),

    mobileMenu: document.querySelector(".mobile-menu"),

    mobileMenuButton: document.querySelector(".mobile-menu-btn"),

    mobileMenuClose: document.querySelector(".mobile-menu-close"),

    chatWidget: document.querySelector(".chat-widget"),

    chatButton: document.querySelector(".chat-button"),

    chatWindow: document.querySelector(".chat-window"),

    chatClose: document.querySelector(".chat-close"),

    chatMessages: document.querySelector(".chat-messages"),

    chatInput: document.querySelector(".chat-input"),

    chatSend: document.querySelector(".chat-send"),

    typingIndicator: document.querySelector(".typing-indicator"),

    languageButton: document.querySelector(".language-btn"),

    languageMenu: document.querySelector(".language-menu"),

    themeButton: document.querySelector(".theme-toggle"),

    scrollTopButton: document.querySelector(".scroll-top"),

    contactForm: document.querySelector("#contactForm"),

    newsletterForm: document.querySelector("#newsletterForm"),

    preloader: document.querySelector(".preloader")
};


/* =========================================================
   4. INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        `%c${APP_CONFIG.name} v${APP_CONFIG.version}`,
        "color:#00e5ff;font-size:18px;font-weight:bold;"
    );

    initializeApp();

});


function initializeApp() {

    applyTheme();

    applyLanguage();

    initializeNavigation();

    initializeMobileMenu();

    initializeChat();

    initializeThemeToggle();

    initializeLanguageSwitcher();

    initializeScrollEffects();

    initializeForms();

    initializeAnimations();

    initializePreloader();

    restoreChatHistory();

    updateCurrentYear();

}


/* =========================================================
   5. NAVIGATION
   ========================================================= */

function initializeNavigation() {

    const navLinks = document.querySelectorAll(
        ".nav-link, [data-scroll]"
    );

    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href") ||
                link.dataset.scroll;

            if (!targetId) return;

            if (targetId.startsWith("#")) {

                event.preventDefault();

                const target = document.querySelector(targetId);

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

            closeMobileMenu();

        });

    });

}


/* =========================================================
   6. MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    if (DOM.mobileMenuButton) {

        DOM.mobileMenuButton.addEventListener(
            "click",
            openMobileMenu
        );

    }

    if (DOM.mobileMenuClose) {

        DOM.mobileMenuClose.addEventListener(
            "click",
            closeMobileMenu
        );

    }

    document.addEventListener("click", event => {

        if (
            AppState.isMobileMenuOpen &&
            DOM.mobileMenu &&
            !DOM.mobileMenu.contains(event.target) &&
            !DOM.mobileMenuButton?.contains(event.target)
        ) {

            closeMobileMenu();

        }

    });

}


function openMobileMenu() {

    if (!DOM.mobileMenu) return;

    AppState.isMobileMenuOpen = true;

    DOM.mobileMenu.classList.add("active");

    DOM.body.classList.add("menu-open");

}


function closeMobileMenu() {

    if (!DOM.mobileMenu) return;

    AppState.isMobileMenuOpen = false;

    DOM.mobileMenu.classList.remove("active");

    DOM.body.classList.remove("menu-open");

}


/* =========================================================
   7. AI CHAT SYSTEM
   ========================================================= */

function initializeChat() {

    if (DOM.chatButton) {

        DOM.chatButton.addEventListener(
            "click",
            toggleChat
        );

    }

    if (DOM.chatClose) {

        DOM.chatClose.addEventListener(
            "click",
            closeChat
        );

    }

    if (DOM.chatSend) {

        DOM.chatSend.addEventListener(
            "click",
            sendMessage
        );

    }

    if (DOM.chatInput) {

        DOM.chatInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );

    }

}


function toggleChat() {

    if (AppState.isChatOpen) {

        closeChat();

    } else {

        openChat();

    }

}


function openChat() {

    if (!DOM.chatWindow) return;

    AppState.isChatOpen = true;

    DOM.chatWindow.classList.add("active");

    DOM.chatInput?.focus();

}


function closeChat() {

    if (!DOM.chatWindow) return;

    AppState.isChatOpen = false;

    DOM.chatWindow.classList.remove("active");

}


/* =========================================================
   8. SEND MESSAGE
   ========================================================= */

async function sendMessage() {

    if (!DOM.chatInput) return;

    const message = DOM.chatInput.value.trim();

    if (!message) return;

    if (message.length > APP_CONFIG.maxMessageLength) {

        showNotification(
            "Хабарлама тым ұзын.",
            "error"
        );

        return;

    }

    addMessage(
        message,
        "user"
    );

    DOM.chatInput.value = "";

    showTyping();

    const response = await generateAIResponse(message);

    hideTyping();

    addMessage(
        response,
        "ai"
    );

}


/* =========================================================
   9. ADD CHAT MESSAGE
   ========================================================= */

function addMessage(
    text,
    sender = "ai"
) {

    if (!DOM.chatMessages) return;

    const messageElement =
        document.createElement("div");

    messageElement.className =
        `chat-message ${sender}-message`;

    const avatar =
        sender === "ai"
            ? "🤖"
            : "👤";

    messageElement.innerHTML = `

        <div class="message-avatar">
            ${avatar}
        </div>

        <div class="message-content">
            <div class="message-text">
                ${escapeHTML(text)}
            </div>

            <div class="message-time">
                ${getCurrentTime()}
            </div>
        </div>

    `;

    DOM.chatMessages.appendChild(
        messageElement
    );

    DOM.chatMessages.scrollTop =
        DOM.chatMessages.scrollHeight;

    AppState.messages.push({
        text,
        sender,
        time: Date.now()
    });

    saveChatHistory();

}


/* =========================================================
   10. AI RESPONSE ENGINE
   ========================================================= */

async function generateAIResponse(message) {

    const text =
        message.toLowerCase().trim();

    /*
       IMPORTANT:

       Бұл — frontend demo AI engine.

       Егер нақты AI керек болса,
       OpenAI API немесе басқа AI API
       backend арқылы қосылады.

       API key-ді frontend-ке жазуға болмайды.
    */


    await delay(
        500 + Math.random() * 1000
    );


    /* GREETING */

    if (
        containsAny(
            text,
            [
                "сәлем",
                "салем",
                "hello",
                "hi",
                "привет"
            ]
        )
    ) {

        return AppState.language === "kz"

            ? "Сәлем! 👋 Мен ERNURVYNX AI көмекшісімін. Саған сайт жасау, бағдарламалау, AI, дизайн және технология бойынша көмектесе аламын."

            : "Сәлем! 👋 Мен сізге көмектесуге дайынмын.";

    }


    /* WHO ARE YOU */

    if (
        containsAny(
            text,
            [
                "сен кімсің",
                "сен кимсин",
                "who are you",
                "кто ты"
            ]
        )
    ) {

        return "Мен — ERNURVYNX AI жүйесінің виртуалды көмекшісімін. Мен бағдарламалау, веб-сайт жасау, AI технологиялары, дизайн және жобалар бойынша кеңес бере аламын.";

    }


    /* WEBSITE */

    if (
        containsAny(
            text,
            [
                "сайт",
                "website",
                "веб",
                "лендинг"
            ]
        )
    ) {

        return "Сайт жасау үшін HTML + CSS + JavaScript қолдануға болады. Үлкен жобаларда React, Next.js, Node.js және дерекқор қосуға болады. ERNURVYNX жобасын болашақта толық AI платформаға айналдыруға мүмкіндік бар.";

    }


    /* HTML */

    if (
        text.includes("html")
    ) {

        return "HTML — сайттың құрылымын жасайтын тіл. Мысалы: header, hero, sections, cards, footer және басқа элементтер HTML арқылы құрылады.";

    }


    /* CSS */

    if (
        text.includes("css")
    ) {

        return "CSS сайттың сыртқы дизайнын басқарады: түстер, анимациялар, өлшемдер, responsive дизайн, glassmorphism және neon эффектілер.";

    }


    /* JAVASCRIPT */

    if (
        text.includes("javascript") ||
        text.includes("js")
    ) {

        return "JavaScript сайтқа интерактивтілік береді. Мысалы: AI chat, modal, mobile menu, language switcher, animations және API интеграцияларын жасауға болады.";

    }


    /* AI */

    if (
        text.includes("ai") ||
        text.includes("ии") ||
        text.includes("жасанды интеллект")
    ) {

        return "AI функцияларын сайтқа API арқылы қосуға болады. Мысалы, чат-бот, мәтін генерациясы, сурет генерациясы, код көмекшісі және ақылды іздеу жүйесін жасауға болады.";

    }


    /* PROJECT */

    if (
        containsAny(
            text,
            [
                "жоба",
                "проект",
                "project"
            ]
        )
    ) {

        return "Жобаны үлкен платформаға айналдыру үшін аккаунт жүйесі, AI чат, профиль, dashboard, база данных, API, төлем жүйесі және мобильді нұсқаны қосуға болады.";

    }


    /* THANK YOU */

    if (
        containsAny(
            text,
            [
                "рахмет",
                "спасибо",
                "thanks"
            ]
        )
    ) {

        return "Әрқашан көмектесуге дайынмын! 🚀";

    }


    /* DEFAULT RESPONSE */

    return `
Мен сұрағыңызды түсіндім. 🤖

Сіз сұраған тақырып бойынша нақты жауап беру үшін
ERNURVYNX AI жүйесіне толық AI API қосуға болады.

Қазіргі frontend нұсқасында мен:
• сайт жасау
• HTML
• CSS
• JavaScript
• React
• AI
• дизайн
• жобалар

туралы негізгі кеңес бере аламын.

Нақты кез келген сұраққа жауап беру үшін
backend + AI API интеграциясын қосу керек.
`;

}


/* =========================================================
   11. TYPING INDICATOR
   ========================================================= */

function showTyping() {

    AppState.isTyping = true;

    if (DOM.typingIndicator) {

        DOM.typingIndicator.classList.add(
            "active"
        );

    }

}


function hideTyping() {

    AppState.isTyping = false;

    if (DOM.typingIndicator) {

        DOM.typingIndicator.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   12. CHAT HISTORY
   ========================================================= */

function saveChatHistory() {

    localStorage.setItem(
        "ernurvynx_chat_history",
        JSON.stringify(
            AppState.messages
        )
    );

}


function restoreChatHistory() {

    if (!DOM.chatMessages) return;

    AppState.messages.forEach(
        message => {

            const element =
                document.createElement("div");

            element.className =
                `chat-message ${message.sender}-message`;

            element.innerHTML = `

                <div class="message-avatar">
                    ${
                        message.sender === "ai"
                            ? "🤖"
                            : "👤"
                    }
                </div>

                <div class="message-content">

                    <div class="message-text">
                        ${escapeHTML(message.text)}
                    </div>

                    <div class="message-time">
                        ${formatTime(message.time)}
                    </div>

                </div>

            `;

            DOM.chatMessages.appendChild(
                element
            );

        }
    );

}


/* =========================================================
   13. THEME SYSTEM
   ========================================================= */

function initializeThemeToggle() {

    if (!DOM.themeButton) return;

    DOM.themeButton.addEventListener(
        "click",
        toggleTheme
    );

}


function toggleTheme() {

    AppState.theme =
        AppState.theme === "dark"
            ? "light"
            : "dark";

    applyTheme();

}


function applyTheme() {

    DOM.html.dataset.theme =
        AppState.theme;

    localStorage.setItem(
        "ernurvynx_theme",
        AppState.theme
    );

}


/* =========================================================
   14. LANGUAGE SYSTEM
   ========================================================= */

const translations = {

    kz: {

        home: "Басты бет",

        about: "Біз туралы",

        projects: "Жобалар",

        contact: "Байланыс",

        chat: "AI Көмекші",

        send: "Жіберу",

        welcome:
            "ERNURVYNX AI жүйесіне қош келдіңіз!"

    },

    ru: {

        home: "Главная",

        about: "О нас",

        projects: "Проекты",

        contact: "Контакты",

        chat: "AI Помощник",

        send: "Отправить",

        welcome:
            "Добро пожаловать в ERNURVYNX AI!"

    },

    en: {

        home: "Home",

        about: "About",

        projects: "Projects",

        contact: "Contact",

        chat: "AI Assistant",

        send: "Send",

        welcome:
            "Welcome to ERNURVYNX AI!"

    }

};


function initializeLanguageSwitcher() {

    const languageButtons =
        document.querySelectorAll(
            "[data-language]"
        );

    languageButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const language =
                        button.dataset.language;

                    changeLanguage(
                        language
                    );

                }
            );

        }
    );

}


function changeLanguage(language) {

    if (
        !translations[language]
    ) return;

    AppState.language =
        language;

    localStorage.setItem(
        "ernurvynx_language",
        language
    );

    applyLanguage();

}


function applyLanguage() {

    const language =
        translations[
            AppState.language
        ];

    if (!language) return;

    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(
            element => {

                const key =
                    element.dataset.i18n;

                if (
                    language[key]
                ) {

                    element.textContent =
                        language[key];

                }

            }
        );

}


/* =========================================================
   15. SCROLL EFFECTS
   ========================================================= */

function initializeScrollEffects() {

    window.addEventListener(
        "scroll",
        () => {

            const scrollY =
                window.scrollY;

            if (DOM.navbar) {

                if (scrollY > 50) {

                    DOM.navbar.classList.add(
                        "scrolled"
                    );

                } else {

                    DOM.navbar.classList.remove(
                        "scrolled"
                    );

                }

            }

            if (DOM.scrollTopButton) {

                if (scrollY > 500) {

                    DOM.scrollTopButton.classList.add(
                        "visible"
                    );

                } else {

                    DOM.scrollTopButton.classList.remove(
                        "visible"
                    );

                }

            }

        }
    );


    if (DOM.scrollTopButton) {

        DOM.scrollTopButton.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }

}


/* =========================================================
   16. CONTACT FORM
   ========================================================= */

function initializeForms() {

    if (DOM.contactForm) {

        DOM.contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const formData =
                    new FormData(
                        DOM.contactForm
                    );

                console.log(
                    "Contact form:",
                    Object.fromEntries(
                        formData
                    )
                );

                showNotification(
                    "Хабарламаңыз сәтті жіберілді!",
                    "success"
                );

                DOM.contactForm.reset();

            }
        );

    }


    if (DOM.newsletterForm) {

        DOM.newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                showNotification(
                    "Сіз жаңалықтарға жазылдыңыз!",
                    "success"
                );

                DOM.newsletterForm.reset();

            }
        );

    }

}


/* =========================================================
   17. ANIMATIONS
   ========================================================= */

function initializeAnimations() {

    const animatedElements =
        document.querySelectorAll(
            "[data-animation]"
        );

    if (
        !("IntersectionObserver" in window)
    ) {

        animatedElements.forEach(
            element => {

                element.classList.add(
                    "animated"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "animated"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    animatedElements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   18. PRELOADER
   ========================================================= */

function initializePreloader() {

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {

                    if (
                        DOM.preloader
                    ) {

                        DOM.preloader.classList.add(
                            "hidden"
                        );

                    }

                },
                500
            );

        }
    );

}


/* =========================================================
   19. NOTIFICATIONS
   ========================================================= */

function showNotification(
    message,
    type = "info"
) {

    const notification =
        document.createElement(
            "div"
        );

    notification.className =
        `notification notification-${type}`;

    notification.innerHTML = `

        <div class="notification-content">

            <span class="notification-icon">
                ${
                    type === "success"
                        ? "✓"
                        : type === "error"
                            ? "!"
                            : "i"
                }
            </span>

            <span>
                ${escapeHTML(message)}
            </span>

        </div>

        <button class="notification-close">
            ×
        </button>

    `;


    document.body.appendChild(
        notification
    );


    requestAnimationFrame(
        () => {

            notification.classList.add(
                "show"
            );

        }
    );


    const closeButton =
        notification.querySelector(
            ".notification-close"
        );


    closeButton.addEventListener(
        "click",
        () => {

            removeNotification(
                notification
            );

        }
    );


    setTimeout(
        () => {

            removeNotification(
                notification
            );

        },
        4000
    );

}


function removeNotification(
    notification
) {

    notification.classList.remove(
        "show"
    );

    setTimeout(
        () => {

            notification.remove();

        },
        300
    );

}


/* =========================================================
   20. UTILITY FUNCTIONS
   ========================================================= */

function delay(ms) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                ms
            );

        }
    );

}


function containsAny(
    text,
    words
) {

    return words.some(
        word =>
            text.includes(word)
    );

}


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


function getCurrentTime() {

    return new Date()
        .toLocaleTimeString(
            "kk-KZ",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


function formatTime(
    timestamp
) {

    return new Date(
        timestamp
    )
        .toLocaleTimeString(
            "kk-KZ",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


function updateCurrentYear() {

    document
        .querySelectorAll(
            "[data-year]"
        )
        .forEach(
            element => {

                element.textContent =
                    new Date().getFullYear();

            }
        );

}


/* =========================================================
   21. GLOBAL API
   ========================================================= */

window.ERNURVYNX = {

    openChat,

    closeChat,

    sendMessage,

    changeLanguage,

    toggleTheme,

    showNotification,

    getState: () => ({
        ...AppState
    })

};


/* =========================================================
   22. DEVELOPMENT LOG
   ========================================================= */

console.log(
    "ERNURVYNX AI application initialized successfully."
);

console.log(
    "Current language:",
    AppState.language
);

console.log(
    "Current theme:",
    AppState.theme
);
```
