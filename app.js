/* ============================================================
   ARUZHAN AI — APP.JS
   AI COMPANION FRONTEND ENGINE
   ============================================================ */

"use strict";

/* ============================================================
   1. APPLICATION CONFIG
   ============================================================ */

const CONFIG = {
    appName: "ARUZHAN AI",
    apiEndpoint: "/api/chat",
    uploadEndpoint: "/api/upload",
    maxMessageLength: 10000,
    maxHistoryMessages: 100,
    typingDelay: 300,
    storageKey: "aruzhan_ai_state",
    conversationKey: "aruzhan_ai_conversations",
    themeKey: "aruzhan_ai_theme",
    userKey: "aruzhan_ai_user"
};


/* ============================================================
   2. APPLICATION STATE
   ============================================================ */

const state = {

    currentMode: "companion",

    currentConversationId: null,

    isGenerating: false,

    isRecording: false,

    isSidebarOpen: true,

    isDarkMode: false,

    selectedFile: null,

    selectedImage: null,

    messages: [],

    conversations: [],

    user: {
        name: "Байрақ",
        plan: "Free Plan"
    }

};


/* ============================================================
   3. AI MODES
   ============================================================ */

const AI_MODES = {

    companion: {
        name: "Companion",
        description: "Досыңдай сөйлеседі",
        systemRole: `
Сен ARUZHAN AI Companion режимісің.
Пайдаланушымен табиғи, жылы және түсінікті сөйлес.
Пайдаланушының сұрағын нақты түсінуге тырыс.
Қажет болса сұрақ қой.
Артық сөз қолданба.
Жауапты пайдаланушының сұрағына сәйкес бер.
        `
    },

    smart: {
        name: "Smart AI",
        description: "Ақылды әмбебап көмекші",
        systemRole: `
Сен ARUZHAN AI Smart режимісің.
Кез келген тақырып бойынша пайдалы және нақты жауап бер.
Күрделі нәрсені қарапайым тілмен түсіндір.
Факт пен болжамды шатастырма.
        `
    },

    study: {
        name: "Study",
        description: "Оқу және білім",
        systemRole: `
Сен ARUZHAN AI Study режимісің.
Оқушыға немесе студентке оқу барысында көмектес.
Тақырыптарды кезең-кезеңімен түсіндір.
Есептерді шешкенде логикасын көрсет.
        `
    },

    developer: {
        name: "Developer",
        description: "Бағдарламалау көмекшісі",
        systemRole: `
Сен ARUZHAN AI Developer режимісің.
HTML, CSS, JavaScript, React, Next.js, Python,
C++, Java, C#, PHP, SQL және басқа технологиялар
бойынша бағдарламашыға көмектес.
Кодты таза және түсінікті жаз.
Қате код бермеуге тырыс.
        `
    },

    motivation: {
        name: "Motivation",
        description: "Мотивация және қолдау",
        systemRole: `
Сен ARUZHAN AI Motivation режимісің.
Пайдаланушыға қолдау көрсет.
Мақсат қоюға және жоспар жасауға көмектес.
Жауаптарың табиғи және шынайы болсын.
        `
    }

};


/* ============================================================
   4. DOM SELECTORS
   ============================================================ */

const elements = {

    body:
        document.body,

    html:
        document.documentElement,

    sidebar:
        document.querySelector(".sidebar"),

    sidebarToggle:
        document.querySelector(".sidebar-toggle"),

    mobileMenuButton:
        document.querySelector(".mobile-menu-button"),

    newChatButton:
        document.querySelector(".new-chat"),

    chatSearch:
        document.querySelector(".chat-search"),

    chatList:
        document.querySelector(".chat-list"),

    modeItems:
        document.querySelectorAll("[data-mode]"),

    currentModeName:
        document.querySelector(".current-mode-name"),

    currentModeDescription:
        document.querySelector(".current-mode-description"),

    currentModeIcon:
        document.querySelector(".current-mode-icon"),

    chatMessages:
        document.querySelector(".chat-messages"),

    messageInput:
        document.querySelector(".message-input"),

    sendButton:
        document.querySelector(".send-button"),

    attachButton:
        document.querySelector(".attach-button"),

    imageButton:
        document.querySelector(".image-button"),

    fileInput:
        document.querySelector(".file-input"),

    imageInput:
        document.querySelector(".image-input"),

    voiceButton:
        document.querySelector(".voice-button"),

    emojiButton:
        document.querySelector(".emoji-button"),

    themeButton:
        document.querySelector(".theme-button"),

    userMenu:
        document.querySelector(".user-menu"),

    userName:
        document.querySelector(".user-name"),

    userPlan:
        document.querySelector(".user-plan"),

    charCounter:
        document.querySelector(".char-counter"),

    typingIndicator:
        document.querySelector(".typing-indicator"),

    welcomeScreen:
        document.querySelector(".welcome-screen"),

    conversationList:
        document.querySelector(".conversation-list"),

    searchButton:
        document.querySelector(".search-button"),

    notificationButton:
        document.querySelector(".notification-button"),

    settingsButton:
        document.querySelector(".settings-button"),

    voiceModal:
        document.querySelector(".voice-modal"),

    closeVoiceModal:
        document.querySelector(".close-voice-modal"),

    filePreview:
        document.querySelector(".file-preview")

};


/* ============================================================
   5. APPLICATION INITIALIZATION
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);


function initializeApplication() {

    loadApplicationState();

    initializeTheme();

    initializeSidebar();

    initializeChat();

    initializeModes();

    initializeFileUpload();

    initializeVoiceRecognition();

    initializeSearch();

    initializeUserActions();

    initializeKeyboardShortcuts();

    initializeAutoResize();

    renderConversations();

    updateUserInterface();

    console.log(
        `${CONFIG.appName} initialized successfully`
    );

}


/* ============================================================
   6. LOAD STATE
   ============================================================ */

function loadApplicationState() {

    try {

        const savedState =
            localStorage.getItem(
                CONFIG.storageKey
            );

        if (savedState) {

            const parsed =
                JSON.parse(savedState);

            Object.assign(
                state,
                parsed
            );

        }

    } catch (error) {

        console.error(
            "State loading error:",
            error
        );

    }


    try {

        const savedConversations =
            localStorage.getItem(
                CONFIG.conversationKey
            );

        if (savedConversations) {

            state.conversations =
                JSON.parse(
                    savedConversations
                );

        }

    } catch (error) {

        console.error(
            "Conversation loading error:",
            error
        );

    }


    try {

        const savedUser =
            localStorage.getItem(
                CONFIG.userKey
            );

        if (savedUser) {

            state.user =
                JSON.parse(
                    savedUser
                );

        }

    } catch (error) {

        console.error(
            "User loading error:",
            error
        );

    }

}


/* ============================================================
   7. SAVE STATE
   ============================================================ */

function saveApplicationState() {

    try {

        localStorage.setItem(

            CONFIG.storageKey,

            JSON.stringify({

                currentMode:
                    state.currentMode,

                currentConversationId:
                    state.currentConversationId

            })

        );

    } catch (error) {

        console.error(
            "State save error:",
            error
        );

    }

}


function saveConversations() {

    localStorage.setItem(

        CONFIG.conversationKey,

        JSON.stringify(
            state.conversations
        )

    );

}


function saveUser() {

    localStorage.setItem(

        CONFIG.userKey,

        JSON.stringify(
            state.user
        )

    );

}


/* ============================================================
   8. CHAT INITIALIZATION
   ============================================================ */

function initializeChat() {

    if (elements.sendButton) {

        elements.sendButton.addEventListener(
            "click",
            handleSendMessage
        );

    }


    if (elements.messageInput) {

        elements.messageInput.addEventListener(
            "keydown",
            handleInputKeydown
        );

        elements.messageInput.addEventListener(
            "input",
            handleInputChange
        );

    }


    if (elements.newChatButton) {

        elements.newChatButton.addEventListener(
            "click",
            createNewConversation
        );

    }

}


/* ============================================================
   9. SEND MESSAGE
   ============================================================ */

async function handleSendMessage() {

    if (state.isGenerating) {

        return;

    }


    if (!elements.messageInput) {

        return;

    }


    const message =
        elements.messageInput
            .value
            .trim();


    if (!message) {

        return;

    }


    if (
        message.length >
        CONFIG.maxMessageLength
    ) {

        showNotification(
            "Хабарлама тым ұзын.",
            "error"
        );

        return;

    }


    if (
        !state.currentConversationId
    ) {

        createNewConversation(
            false
        );

    }


    addUserMessage(
        message
    );


    elements.messageInput.value = "";

    updateCharacterCounter();

    resetInputHeight();


    await requestAIResponse(
        message
    );

}


/* ============================================================
   10. AI API REQUEST
   ============================================================ */

async function requestAIResponse(
    message
) {

    state.isGenerating = true;

    updateSendButton();

    showTypingIndicator();


    const conversation =
        getCurrentConversation();


    const history =
        conversation
            ? conversation.messages
            : [];


    const mode =
        AI_MODES[
            state.currentMode
        ];


    try {

        const response =
            await fetch(
                CONFIG.apiEndpoint,
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
                                state.currentMode,

                            systemRole:
                                mode
                                    ?.systemRole
                                    || "",

                            conversationId:
                                state.currentConversationId,

                            history:
                                history
                                    .slice(
                                        -20
                                    )

                        })

                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const data =
            await response.json();


        hideTypingIndicator();


        const aiResponse =
            data.reply ||
            data.message ||
            data.content;


        if (!aiResponse) {

            throw new Error(
                "AI response is empty"
            );

        }


        addAIMessage(
            aiResponse
        );


    } catch (error) {

        console.error(
            "AI request error:",
            error
        );


        hideTypingIndicator();


        addSystemMessage(

            "AI серверімен байланыс орнатылмады. " +
            "Backend серверін тексеріңіз."

        );

    } finally {

        state.isGenerating =
            false;

        updateSendButton();

    }

}


/* ============================================================
   11. ADD USER MESSAGE
   ============================================================ */

function addUserMessage(
    message
) {

    const messageObject = {

        id:
            generateId(),

        role:
            "user",

        content:
            message,

        timestamp:
            Date.now()

    };


    state.messages.push(
        messageObject
    );


    const conversation =
        getCurrentConversation();


    if (conversation) {

        conversation.messages.push(
            messageObject
        );

        conversation.updatedAt =
            Date.now();

    }


    renderMessage(
        messageObject
    );


    saveConversations();

    scrollChatToBottom();

}


/* ============================================================
   12. ADD AI MESSAGE
   ============================================================ */

function addAIMessage(
    message
) {

    const messageObject = {

        id:
            generateId(),

        role:
            "assistant",

        content:
            message,

        timestamp:
            Date.now()

    };


    state.messages.push(
        messageObject
    );


    const conversation =
        getCurrentConversation();


    if (conversation) {

        conversation.messages.push(
            messageObject
        );

        conversation.updatedAt =
            Date.now();

    }


    renderMessage(
        messageObject
    );


    saveConversations();

    renderConversations();

    scrollChatToBottom();

}


/* ============================================================
   13. SYSTEM MESSAGE
   ============================================================ */

function addSystemMessage(
    message
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "system-message";


    element.textContent =
        message;


    elements.chatMessages
        ?.appendChild(
            element
        );


    scrollChatToBottom();

}


/* ============================================================
   14. RENDER MESSAGE
   ============================================================ */

function renderMessage(
    message
) {

    if (
        !elements.chatMessages
    ) {

        return;

    }


    hideWelcomeScreen();


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        `message-wrapper ${message.role}`;


    wrapper.dataset.messageId =
        message.id;


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    avatar.textContent =
        message.role === "user"
            ? getUserInitial()
            : "A";


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    const bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        "message-bubble";


    if (
        message.role === "assistant"
    ) {

        bubble.innerHTML =
            formatAIResponse(
                message.content
            );

    } else {

        bubble.textContent =
            message.content;

    }


    const footer =
        document.createElement(
            "div"
        );


    footer.className =
        "message-footer";


    footer.innerHTML = `

        <span class="message-time">
            ${formatTime(message.timestamp)}
        </span>

        ${
            message.role === "assistant"
            ? `
                <button
                    class="copy-message"
                    data-copy="${escapeAttribute(message.content)}"
                    title="Көшіру"
                >
                    ⧉
                </button>
            `
            : ""
        }

    `;


    content.appendChild(
        bubble
    );


    content.appendChild(
        footer
    );


    wrapper.appendChild(
        avatar
    );


    wrapper.appendChild(
        content
    );


    elements.chatMessages.appendChild(
        wrapper
    );


    const copyButton =
        wrapper.querySelector(
            ".copy-message"
        );


    if (copyButton) {

        copyButton.addEventListener(
            "click",
            () => {

                copyToClipboard(
                    message.content
                );

            }
        );

    }

}


/* ============================================================
   15. FORMAT AI RESPONSE
   ============================================================ */

function formatAIResponse(
    text
) {

    if (!text) {

        return "";

    }


    let formatted =
        escapeHTML(
            text
        );


    formatted =
        formatted.replace(
            /```([\s\S]*?)```/g,
            match => {

                const code =
                    match
                        .replace(
                            /```[a-zA-Z]*\n?/,
                            ""
                        )
                        .replace(
                            /```$/,
                            ""
                        );

                return `

                    <div class="code-block">

                        <button
                            class="copy-code"
                            onclick="copyToClipboard(
                                this.nextElementSibling.textContent
                            )"
                        >
                            Көшіру
                        </button>

                        <pre><code>${code}</code></pre>

                    </div>

                `;

            }
        );


    formatted =
        formatted.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    formatted =
        formatted.replace(
            /\*(.*?)\*/g,
            "<em>$1</em>"
        );


    formatted =
        formatted.replace(
            /^### (.*)$/gm,
            "<h3>$1</h3>"
        );


    formatted =
        formatted.replace(
            /^## (.*)$/gm,
            "<h2>$1</h2>"
        );


    formatted =
        formatted.replace(
            /^# (.*)$/gm,
            "<h1>$1</h1>"
        );


    formatted =
        formatted.replace(
            /^- (.*)$/gm,
            "<li>$1</li>"
        );


    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;

}


/* ============================================================
   16. NEW CONVERSATION
   ============================================================ */

function createNewConversation(
    autoFocus = true
) {

    const conversation = {

        id:
            generateId(),

        title:
            "Жаңа чат",

        mode:
            state.currentMode,

        messages:
            [],

        createdAt:
            Date.now(),

        updatedAt:
            Date.now()

    };


    state.conversations.unshift(
        conversation
    );


    state.currentConversationId =
        conversation.id;


    state.messages = [];


    clearChatUI();


    saveConversations();

    saveApplicationState();

    renderConversations();


    if (
        autoFocus &&
        elements.messageInput
    ) {

        elements.messageInput.focus();

    }

}


/* ============================================================
   17. GET CURRENT CONVERSATION
   ============================================================ */

function getCurrentConversation() {

    return state.conversations.find(

        conversation =>

            conversation.id ===
            state.currentConversationId

    );

}


/* ============================================================
   18. LOAD CONVERSATION
   ============================================================ */

function loadConversation(
    conversationId
) {

    const conversation =
        state.conversations.find(

            item =>
                item.id ===
                conversationId

        );


    if (!conversation) {

        return;

    }


    state.currentConversationId =
        conversation.id;


    state.currentMode =
        conversation.mode ||
        "companion";


    state.messages =
        [
            ...conversation.messages
        ];


    clearChatUI();


    conversation.messages.forEach(

        message => {

            renderMessage(
                message
            );

        }

    );


    updateModeUI();

    saveApplicationState();

    scrollChatToBottom();

}


/* ============================================================
   19. CLEAR CHAT UI
   ============================================================ */

function clearChatUI() {

    if (
        !elements.chatMessages
    ) {

        return;

    }


    elements.chatMessages.innerHTML =
        "";


    showWelcomeScreen();

}


/* ============================================================
   20. CONVERSATION LIST
   ============================================================ */

function renderConversations(
    searchTerm = ""
) {

    if (
        !elements.conversationList
    ) {

        return;

    }


    elements.conversationList.innerHTML =
        "";


    const normalizedSearch =
        searchTerm
            .toLowerCase()
            .trim();


    const conversations =
        state.conversations
            .filter(

                conversation => {

                    if (
                        !normalizedSearch
                    ) {

                        return true;

                    }


                    return conversation.title
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        );

                }

            );


    conversations.forEach(

        conversation => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "conversation-item";


            if (
                conversation.id ===
                state.currentConversationId
            ) {

                item.classList.add(
                    "active"
                );

            }


            item.dataset.id =
                conversation.id;


            const title =
                document.createElement(
                    "span"
                );


            title.className =
                "conversation-title";


            title.textContent =
                conversation.title;


            const menu =
                document.createElement(
                    "button"
                );


            menu.className =
                "conversation-menu";


            menu.textContent =
                "⋮";


            item.appendChild(
                title
            );


            item.appendChild(
                menu
            );


            item.addEventListener(
                "click",
                () => {

                    loadConversation(
                        conversation.id
                    );

                }
            );


            menu.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    showConversationMenu(
                        conversation,
                        item
                    );

                }
            );


            elements.conversationList.appendChild(
                item
            );

        }

    );

}


/* ============================================================
   21. AUTO TITLE
   ============================================================ */

function updateConversationTitle(
    conversation,
    firstMessage
) {

    if (
        !conversation
    ) {

        return;

    }


    if (
        conversation.title !==
        "Жаңа чат"
    ) {

        return;

    }


    const cleanText =
        firstMessage
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    conversation.title =
        cleanText.length > 35
            ? cleanText.substring(
                0,
                35
            ) + "..."
            : cleanText;


    saveConversations();

    renderConversations();

}


/* ============================================================
   22. CONVERSATION MENU
   ============================================================ */

function showConversationMenu(
    conversation,
    element
) {

    const menu =
        document.createElement(
            "div"
        );


    menu.className =
        "conversation-context-menu";


    menu.innerHTML = `

        <button data-action="rename">
            Атын өзгерту
        </button>

        <button data-action="delete">
            Өшіру
        </button>

    `;


    document.body.appendChild(
        menu
    );


    const rect =
        element.getBoundingClientRect();


    menu.style.top =
        `${rect.bottom + 5}px`;


    menu.style.left =
        `${rect.left + 100}px`;


    menu.querySelector(
        '[data-action="rename"]'
    ).addEventListener(
        "click",
        () => {

            renameConversation(
                conversation
            );

            menu.remove();

        }
    );


    menu.querySelector(
        '[data-action="delete"]'
    ).addEventListener(
        "click",
        () => {

            deleteConversation(
                conversation.id
            );

            menu.remove();

        }
    );


    setTimeout(
        () => {

            document.addEventListener(
                "click",
                function closeMenu() {

                    menu.remove();

                    document.removeEventListener(
                        "click",
                        closeMenu
                    );

                },
                {
                    once: true
                }
            );

        },
        10
    );

}


/* ============================================================
   23. RENAME CONVERSATION
   ============================================================ */

function renameConversation(
    conversation
) {

    const newTitle =
        prompt(
            "Чат атауы:",
            conversation.title
        );


    if (
        !newTitle ||
        !newTitle.trim()
    ) {

        return;

    }


    conversation.title =
        newTitle.trim();


    saveConversations();

    renderConversations();

}


/* ============================================================
   24. DELETE CONVERSATION
   ============================================================ */

function deleteConversation(
    conversationId
) {

    const confirmed =
        confirm(
            "Бұл чатты өшіру керек пе?"
        );


    if (!confirmed) {

        return;

    }


    state.conversations =
        state.conversations.filter(

            conversation =>
                conversation.id !==
                conversationId

        );


    if (
        state.currentConversationId ===
        conversationId
    ) {

        state.currentConversationId =
            null;

        state.messages =
            [];

        clearChatUI();

    }


    saveConversations();

    saveApplicationState();

    renderConversations();

}


/* ============================================================
   25. AI MODES
   ============================================================ */

function initializeModes() {

    elements.modeItems?.forEach(

        item => {

            item.addEventListener(
                "click",
                () => {

                    const mode =
                        item.dataset.mode;


                    if (
                        !AI_MODES[mode]
                    ) {

                        return;

                    }


                    state.currentMode =
                        mode;


                    const conversation =
                        getCurrentConversation();


                    if (
                        conversation
                    ) {

                        conversation.mode =
                            mode;

                    }


                    updateModeUI();

                    saveApplicationState();

                    saveConversations();

                }
            );

        }

    );

}


function updateModeUI() {

    const mode =
        AI_MODES[
            state.currentMode
        ];


    if (!mode) {

        return;

    }


    if (
        elements.currentModeName
    ) {

        elements.currentModeName.textContent =
            mode.name;

    }


    if (
        elements.currentModeDescription
    ) {

        elements.currentModeDescription.textContent =
            mode.description;

    }


    elements.modeItems?.forEach(

        item => {

            item.classList.toggle(

                "active",

                item.dataset.mode ===
                state.currentMode

            );

        }

    );

}


/* ============================================================
   26. SIDEBAR
   ============================================================ */

function initializeSidebar() {

    if (
        elements.sidebarToggle
    ) {

        elements.sidebarToggle.addEventListener(

            "click",

            () => {

                toggleSidebar();

            }

        );

    }


    if (
        elements.mobileMenuButton
    ) {

        elements.mobileMenuButton.addEventListener(

            "click",

            () => {

                elements.sidebar
                    ?.classList.toggle(
                        "open"
                    );

            }

        );

    }

}


function toggleSidebar() {

    state.isSidebarOpen =
        !state.isSidebarOpen;


    elements.sidebar
        ?.classList.toggle(

            "collapsed",

            !state.isSidebarOpen

        );

}


/* ============================================================
   27. THEME
   ============================================================ */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            CONFIG.themeKey
        );


    if (
        savedTheme ===
        "dark"
    ) {

        state.isDarkMode =
            true;

    }


    applyTheme();

}


function applyTheme() {

    elements.html?.classList.toggle(

        "dark",

        state.isDarkMode

    );


    elements.body?.classList.toggle(

        "dark-mode",

        state.isDarkMode

    );


    localStorage.setItem(

        CONFIG.themeKey,

        state.isDarkMode
            ? "dark"
            : "light"

    );


    if (
        elements.themeButton
    ) {

        elements.themeButton.textContent =
            state.isDarkMode
                ? "☀"
                : "☾";

    }

}


/* ============================================================
   28. FILE UPLOAD
   ============================================================ */

function initializeFileUpload() {

    if (
        elements.attachButton &&
        elements.fileInput
    ) {

        elements.attachButton.addEventListener(

            "click",

            () => {

                elements.fileInput.click();

            }

        );

    }


    if (
        elements.imageButton &&
        elements.imageInput
    ) {

        elements.imageButton.addEventListener(

            "click",

            () => {

                elements.imageInput.click();

            }

        );

    }


    elements.fileInput?.addEventListener(

        "change",

        event => {

            const file =
                event.target.files[0];


            if (
                file
            ) {

                handleFileSelection(
                    file
                );

            }

        }

    );


    elements.imageInput?.addEventListener(

        "change",

        event => {

            const file =
                event.target.files[0];


            if (
                file
            ) {

                handleImageSelection(
                    file
                );

            }

        }

    );

}


/* ============================================================
   29. FILE SELECTION
   ============================================================ */

function handleFileSelection(
    file
) {

    state.selectedFile =
        file;


    showFilePreview(
        file
    );


    showNotification(

        `${file.name} таңдалды`,

        "success"

    );

}


/* ============================================================
   30. IMAGE SELECTION
   ============================================================ */

function handleImageSelection(
    file
) {

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showNotification(
            "Бұл сурет файлы емес.",
            "error"
        );

        return;

    }


    state.selectedImage =
        file;


    showFilePreview(
        file
    );

}


/* ============================================================
   31. FILE PREVIEW
   ============================================================ */

function showFilePreview(
    file
) {

    if (
        !elements.filePreview
    ) {

        return;

    }


    elements.filePreview.innerHTML = `

        <div class="selected-file">

            <span>
                ${escapeHTML(file.name)}
            </span>

            <button
                type="button"
                class="remove-file"
            >
                ×
            </button>

        </div>

    `;


    elements.filePreview
        .classList.add(
            "active"
        );


    elements.filePreview
        .querySelector(
            ".remove-file"
        )
        .addEventListener(

            "click",

            removeSelectedFile

        );

}


/* ============================================================
   32. REMOVE FILE
   ============================================================ */

function removeSelectedFile() {

    state.selectedFile =
        null;

    state.selectedImage =
        null;


    if (
        elements.filePreview
    ) {

        elements.filePreview.innerHTML =
            "";

        elements.filePreview
            .classList.remove(
                "active"
            );

    }


    if (
        elements.fileInput
    ) {

        elements.fileInput.value =
            "";

    }


    if (
        elements.imageInput
    ) {

        elements.imageInput.value =
            "";

    }

}


/* ============================================================
   33. VOICE RECOGNITION
   ============================================================ */

function initializeVoiceRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (
        !SpeechRecognition
    ) {

        console.warn(
            "Speech Recognition is not supported."
        );

        return;

    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "kk-KZ";


    recognition.continuous =
        false;


    recognition.interimResults =
        true;


    recognition.onstart =
        () => {

            state.isRecording =
                true;


            elements.voiceButton
                ?.classList.add(
                    "recording"
                );

        };


    recognition.onresult =
        event => {

            let transcript =
                "";


            for (
                let i =
                    event.resultIndex;

                i <
                event.results.length;

                i++
            ) {

                transcript +=
                    event.results[i][0]
                        .transcript;

            }


            if (
                elements.messageInput
            ) {

                elements.messageInput.value =
                    transcript;

                updateCharacterCounter();

            }

        };


    recognition.onend =
        () => {

            state.isRecording =
                false;


            elements.voiceButton
                ?.classList.remove(
                    "recording"
                );

        };


    recognition.onerror =
        error => {

            console.error(
                "Voice error:",
                error
            );


            state.isRecording =
                false;

        };


    if (
        elements.voiceButton
    ) {

        elements.voiceButton.addEventListener(

            "click",

            () => {

                if (
                    state.isRecording
                ) {

                    recognition.stop();

                } else {

                    recognition.start();

                }

            }

        );

    }

}


/* ============================================================
   34. SEARCH
   ============================================================ */

function initializeSearch() {

    if (
        elements.chatSearch
    ) {

        elements.chatSearch.addEventListener(

            "input",

            event => {

                renderConversations(

                    event.target.value

                );

            }

        );

    }

}


/* ============================================================
   35. KEYBOARD SHORTCUTS
   ============================================================ */

function initializeKeyboardShortcuts() {

    document.addEventListener(

        "keydown",

        event => {

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() ===
                "k"
            ) {

                event.preventDefault();

                createNewConversation();

            }


            if (
                event.key ===
                "Escape"
            ) {

                elements.sidebar
                    ?.classList.remove(
                        "open"
                    );

            }

        }

    );

}


/* ============================================================
   36. INPUT KEYBOARD
   ============================================================ */

function handleInputKeydown(
    event
) {

    if (
        event.key ===
        "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        handleSendMessage();

    }

}


/* ============================================================
   37. INPUT CHANGE
   ============================================================ */

function handleInputChange() {

    updateCharacterCounter();

    autoResizeInput();

}


/* ============================================================
   38. CHARACTER COUNTER
   ============================================================ */

function updateCharacterCounter() {

    if (
        !elements.messageInput ||
        !elements.charCounter
    ) {

        return;

    }


    const length =
        elements.messageInput
            .value
            .length;


    elements.charCounter.textContent =

        `${length} / ${CONFIG.maxMessageLength}`;

}


/* ============================================================
   39. AUTO RESIZE INPUT
   ============================================================ */

function initializeAutoResize() {

    if (
        !elements.messageInput
    ) {

        return;

    }


    elements.messageInput.addEventListener(

        "input",

        autoResizeInput

    );

}


function autoResizeInput() {

    const input =
        elements.messageInput;


    if (!input) {

        return;

    }


    input.style.height =
        "auto";


    input.style.height =
        Math.min(
            input.scrollHeight,
            180
        ) + "px";

}


function resetInputHeight() {

    if (
        elements.messageInput
    ) {

        elements.messageInput.style.height =
            "auto";

    }

}


/* ============================================================
   40. TYPING INDICATOR
   ============================================================ */

function showTypingIndicator() {

    if (
        elements.typingIndicator
    ) {

        elements.typingIndicator
            .classList.add(
                "active"
            );

    }

}


function hideTypingIndicator() {

    if (
        elements.typingIndicator
    ) {

        elements.typingIndicator
            .classList.remove(
                "active"
            );

    }

}


/* ============================================================
   41. SEND BUTTON
   ============================================================ */

function updateSendButton() {

    if (
        !elements.sendButton
    ) {

        return;

    }


    elements.sendButton.disabled =
        state.isGenerating;


    if (
        state.isGenerating
    ) {

        elements.sendButton.classList.add(
            "loading"
        );

    } else {

        elements.sendButton.classList.remove(
            "loading"
        );

    }

}


/* ============================================================
   42. WELCOME SCREEN
   ============================================================ */

function showWelcomeScreen() {

    elements.welcomeScreen
        ?.classList.remove(
            "hidden"
        );

}


function hideWelcomeScreen() {

    elements.welcomeScreen
        ?.classList.add(
            "hidden"
        );

}


/* ============================================================
   43. SCROLL CHAT
   ============================================================ */

function scrollChatToBottom() {

    if (
        !elements.chatMessages
    ) {

        return;

    }


    requestAnimationFrame(

        () => {

            elements.chatMessages.scrollTo({

                top:
                    elements.chatMessages
                        .scrollHeight,

                behavior:
                    "smooth"

            });

        }

    );

}


/* ============================================================
   44. USER INTERFACE
   ============================================================ */

function updateUserInterface() {

    updateModeUI();

    updateSendButton();

    updateCharacterCounter();


    if (
        elements.userName
    ) {

        elements.userName.textContent =
            state.user.name;

    }


    if (
        elements.userPlan
    ) {

        elements.userPlan.textContent =
            state.user.plan;

    }

}


/* ============================================================
   45. USER ACTIONS
   ============================================================ */

function initializeUserActions() {

    elements.themeButton?.addEventListener(

        "click",

        () => {

            state.isDarkMode =
                !state.isDarkMode;

            applyTheme();

        }

    );


    elements.emojiButton?.addEventListener(

        "click",

        () => {

            insertEmoji(
                "😊"
            );

        }

    );


    elements.searchButton?.addEventListener(

        "click",

        () => {

            elements.chatSearch
                ?.focus();

        }

    );


    elements.settingsButton?.addEventListener(

        "click",

        () => {

            showNotification(

                "Баптаулар бөлімі жақында қосылады.",

                "info"

            );

        }

    );

}


/* ============================================================
   46. INSERT EMOJI
   ============================================================ */

function insertEmoji(
    emoji
) {

    if (
        !elements.messageInput
    ) {

        return;

    }


    const start =
        elements.messageInput
            .selectionStart;


    const end =
        elements.messageInput
            .selectionEnd;


    const value =
        elements.messageInput.value;


    elements.messageInput.value =

        value.substring(
            0,
            start
        ) +

        emoji +

        value.substring(
            end
        );


    elements.messageInput.focus();


    elements.messageInput.selectionStart =
        start +
        emoji.length;


    elements.messageInput.selectionEnd =
        start +
        emoji.length;


    updateCharacterCounter();

}


/* ============================================================
   47. COPY TO CLIPBOARD
   ============================================================ */

async function copyToClipboard(
    text
) {

    try {

        await navigator.clipboard.writeText(
            text
        );


        showNotification(

            "Көшірілді",

            "success"

        );

    } catch (error) {

        console.error(
            error
        );

    }

}


/* ============================================================
   48. NOTIFICATION
   ============================================================ */

function showNotification(
    message,
    type = "info"
) {

    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        `notification ${type}`;


    notification.textContent =
        message;


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


    setTimeout(

        () => {

            notification.classList.remove(
                "show"
            );


            setTimeout(

                () => {

                    notification.remove();

                },

                300

            );

        },

        3000

    );

}


/* ============================================================
   49. FORMAT TIME
   ============================================================ */

function formatTime(
    timestamp
) {

    return new Date(
        timestamp
    ).toLocaleTimeString(
        "kk-KZ",
        {

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


/* ============================================================
   50. GENERATE ID
   ============================================================ */

function generateId() {

    return (

        Date.now()
            .toString(
                36
            ) +

        Math.random()
            .toString(
                36
            )
            .substring(
                2,
                9
            )

    );

}


/* ============================================================
   51. USER INITIAL
   ============================================================ */

function getUserInitial() {

    return (

        state.user.name
            ?.charAt(
                0
            )
            ?.toUpperCase()

        || "U"

    );

}


/* ============================================================
   52. ESCAPE HTML
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
   53. ESCAPE ATTRIBUTE
   ============================================================ */

function escapeAttribute(
    text
) {

    return escapeHTML(
        text
    )
        .replace(
            /"/g,
            "&quot;"
        );

}


/* ============================================================
   54. GLOBAL API
   ============================================================ */

window.ARUZHAN_AI = {

    sendMessage:
        handleSendMessage,

    newChat:
        createNewConversation,

    loadChat:
        loadConversation,

    setMode:
        mode => {

            if (
                AI_MODES[mode]
            ) {

                state.currentMode =
                    mode;

                updateModeUI();

            }

        },

    getState:
        () => ({
            ...state
        }),

    copy:
        copyToClipboard

};


/* ============================================================
   55. DEBUG
   ============================================================ */

console.log(
    "ARUZHAN AI frontend engine ready."
);

console.log(
    "Current mode:",
    state.currentMode
);

console.log(
    "AI endpoint:",
    CONFIG.apiEndpoint
);
