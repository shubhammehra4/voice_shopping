const synthesiser =
  typeof window !== "undefined" ? window.speechSynthesis : null;
const voice =
  typeof window !== "undefined" ? window.speechSynthesis.getVoices()[2] : null;

export type SpeakTextOptions = {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
  onStart?: () => void;
};

export default function speakText(
  text: string,
  options: SpeakTextOptions = {}
) {
  const sayThis = new SpeechSynthesisUtterance(text);

  sayThis.voice = options.voice ?? voice;
  sayThis.rate = options.rate ?? 1;
  sayThis.pitch = options.pitch ?? 1;

  if (options.onStart !== undefined) {
    sayThis.onstart = options.onStart;
  }

  if (options.onEnd !== undefined) {
    sayThis.onend = options.onEnd;
  }

  sayThis.lang = sayThis.voice?.lang ?? "en-GB";

  if (synthesiser) {
    synthesiser.speak(sayThis);
  }
}
