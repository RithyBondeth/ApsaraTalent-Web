export const CHAT_TYPING_DEBOUNCE_MS = 1500;
export const CHAT_LOADING_TIMEOUT_MS = 5000;
export const CHAT_REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export const CHAT_TYPING_INDICATOR_STYLES = `
  @keyframes typing-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  .typing-dot { animation: typing-bounce 1.2s infinite ease-in-out; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
`;

export const CHAT_MAX_FILE_SIZE_MB = 10;
export const CHAT_MAX_FILE_SIZE_BYTES = CHAT_MAX_FILE_SIZE_MB * 1024 * 1024;
export const CHAT_MAX_FILES = 10;

export const CHAT_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
].join(",");
