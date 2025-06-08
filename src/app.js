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

// i18n logic
const setActiveLang = () => {
  let lang = localStorage.getItem("lang");
  if (!lang) {
    lang = "en";
    setLang(lang);
  }
  document.querySelector(`.lang button.active`)?.classList.remove("active");
  document
    .querySelector(`.lang button[data-value="${lang}"]`)
    .classList.add("active");
};

const setLang = (lang = "en") => {
  localStorage.setItem("lang", lang);
  setActiveLang();
};

setActiveLang();

document.querySelectorAll(`.lang button`).forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    setLang(e.target.dataset.value);
  });
});
