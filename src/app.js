var isSpeaking = false;

const speak = (char) => {
  isSpeaking = true;

  const utterance = new SpeechSynthesisUtterance(`${char}!`);
  utterance.lang = "ID";
  utterance.pitch = 0.8;
  utterance.rate = 0;
  speechSynthesis.speak(utterance);

  setTimeout(() => {
    isSpeaking = false;
  }, 1000);
};

const readInput = (ev) => {
  let keyboardInput = String.fromCharCode(ev.keyCode);
  if (keyboardInput.match(/(\w|\s)/g) && !isSpeaking) {
    document.getElementsByTagName("h1")[0].innerText = keyboardInput;
    speak(keyboardInput);
  }
};

document.addEventListener("keypress", readInput);
