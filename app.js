window.ARUZHAN_AI = {
    mode: "companion",

    setMode(newMode) {
        this.mode = newMode;
        console.log(`AI режимі ауыстырылды: ${newMode}`);
    },

    clearChat() {
        const chatMessages = document.getElementById("chatMessages");
        if (chatMessages) {
            chatMessages.innerHTML = "";
        }
    },

    async checkBackend() {
        // Бэкенд сервердің жұмысын тексеру имитациясы
        return new Promise((resolve) => setTimeout(resolve, 500));
    }
};

document.getElementById("sendButton")?.addEventListener("click", () => {
    const input = document.getElementById("messageInput");
    const text = input?.value.trim();
    
    if (!text) return;

    const chat = document.getElementById("chatMessages");
    if (chat) {
        const userMsg = document.createElement("div");
        userMsg.style.cssText = "align-self: flex-end; background: var(--accent); padding: 10px 16px; border-radius: 14px; margin-bottom: 8px; max-width: 80%;";
        userMsg.textContent = text;
        chat.appendChild(userMsg);
    }

    input.value = "";
});
