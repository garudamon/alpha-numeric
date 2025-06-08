var isSpeaking = false;
let i18dictionary = [];
let letterMap = new Map();

const getLangData = async () => {
  const lang = localStorage.getItem("lang") || "en";
  try {
    if (lang === "en") {
      const { default: enData } = await import("./lang/en.js");
      return enData;
    } else if (lang === "id") {
      const { default: idData } = await import("./lang/id.js");
      return idData;
    }
  } catch (error) {
    console.error(`Error loading language data for ${lang}:`, error);
    // Fallback to English if there's an error
    const { default: enData } = await import("./lang/en.js");
    return enData;
  }
};

const updateLetterMap = () => {
  letterMap.clear();
  i18dictionary.forEach((item) => {
    letterMap.set(item.huruf.toUpperCase(), item);
  });
};

const findByLetter = (letter) => {
  return letterMap.get(letter.toUpperCase()) || null;
};

const speak = (text) => {
  isSpeaking = true;

  const lang = localStorage.getItem("lang") || "en";
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "id" ? "id-ID" : "en-US";
  utterance.pitch = lang === "id" ? 1 : 0.1;
  utterance.rate = lang === "id" ? 0.8 : 0.4;
  speechSynthesis.speak(utterance);

  setTimeout(() => {
    isSpeaking = false;
  }, 1000);
};

const updateContent = (item) => {
  const contentDiv = document.querySelector(".content");
  if (!item) {
    contentDiv.innerHTML = `
      <h1 class="letter">Learn Alphanumeric!</h1>
    `;
    return;
  }

  contentDiv.innerHTML = `
    <h1 class="letter">${item.huruf}</h1>
    <div class="emoji">${item.emoji}</div>
    <h2>${item.nama}</h2>
  `;
};

const readInput = (ev) => {
  const lang = localStorage.getItem("lang") || "en";
  let keyboardInput = String.fromCharCode(ev.keyCode);
  if (keyboardInput.match(/(\w|\s)/g) && !isSpeaking) {
    const item = findByLetter(keyboardInput);
    if (item) {
      document.getElementsByTagName("h1")[0].innerText = item.huruf;
      updateContent(item);
      speak(`${keyboardInput} ${lang === "id" ? "untuk" : "for"} ${item.nama}`);
    } else {
      document.getElementsByTagName("h1")[0].innerText = keyboardInput;
      updateContent(null);
      speak(keyboardInput);
    }
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

const setLang = async (lang = "en") => {
  localStorage.setItem("lang", lang);
  setActiveLang();
  try {
    i18dictionary = await getLangData();
    updateLetterMap();
  } catch (error) {
    console.error("Failed to load language data:", error);
  }
};

document.querySelectorAll(`.lang button`).forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    setLang(e.target.dataset.value);
  });
});

// Load initial language data
(async () => {
  setActiveLang();
  i18dictionary = await getLangData();
  updateLetterMap();
  updateContent();
})();
