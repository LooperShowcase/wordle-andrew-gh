let number_of_chars = 5;
let number_of_words = 6;
let gameDiv = document.getElementById("game");

for (let i = 0; i < number_of_words; i++) {
  let wordDiv = document.createElement("div");
  wordDiv.className = "word";

  for (let j = 0; j < number_of_chars; j++) {
    let charDiv = document.createElement("div");
    charDiv.className = "letter";
    wordDiv.appendChild(charDiv);
  }
  gameDiv.appendChild(wordDiv);
}

let curWord = 0;
let curChar = 0;

addEventListener("keydown", async function (event) {
  let wordDiv = gameDiv.children[curWord];

  if (event.code === "Backspace") {
    let charToDel = wordDiv.children[curChar - 1];
    charToDel.innerHTML = "";
    curChar--;
  } else if (event.code === "Enter") {
    if (curChar == number_of_chars) {
      const word = getCurrentWord();
      animateCSS(wordDiv, "flipInX");
      const result = await (await fetch("/wordle/" + word)).json();
      for (let i = 0; i < result.length; i++) {
        wordDiv.children[i].style.background = result[i];
      }
      curWord++;
      curChar = 0;
    }
  } else if (isLetter(event.key) && curChar < number_of_chars) {
    let charArr = wordDiv.children[curChar];
    charArr.innerHTML = event.key;
    curChar++;
  }
});

function getCurrentWord() {
  let word = "";
  let wordDiv = gameDiv.children[curWord];
  for (let i = 0; i < number_of_chars; i++) {
    let charDiv = wordDiv.children[i];
    word = word + charDiv.innerHTML;
  }
  return word;
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

const animateCSS = (element, animation, prefix = "animate__") =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;

    element.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      element.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    element.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  });
