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

export const CHAT_DEFAULT_AMPLITUDE_AUDIO = Array.from(
  { length: 30 },
  (_, index) => 0.2 + 0.4 * Math.sin((index / 30) * Math.PI),
);

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

export const WEB_URL_REGEX = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;

/** Maximum recording duration in milliseconds (5 minutes). */
export const VOICE_RECORDING_MAX_DURATION_MS = 5 * 60 * 1000;

/** How often (ms) we sample amplitude data during recording. */
export const AMPLITUDE_SAMPLE_INTERVAL_MS = 100;

/** Target number of amplitude bars in the waveform visualization. */
export const WAVEFORM_POINTS = 30;
