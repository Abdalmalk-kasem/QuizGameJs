let selectQ = document.querySelector(".category select");
let category = document.querySelector(".category");
let questionsCount = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let result = document.querySelector(".result");
let questionTitle = document.querySelector(".question");
let quizeArea = document.querySelector(".quiz-container");
let answersContainer = document.querySelector(".answers");
let submit = document.querySelector(".quiz-container .submit");
let timer = document.querySelector(".timer");
let myData;
let countdownInterval;
let currentIndex = 0;
let rightAnswers = 0;

function getData(questionCategory) {
  let myRequest = new XMLHttpRequest();
  questionTitle.innerHTML = ``;
  answersContainer.innerHTML = ``;
  bullets.innerHTML = ``;
  clearInterval(countdownInterval);

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      myData = JSON.parse(this.responseText);
      const randomObj = shuffleArray(myData);
      const selectedObjects = randomObj.slice(0, 10);
      const selectedObjLen = selectedObjects.length;

      addQuestionData(selectedObjects[currentIndex], selectedObjLen);
      createBullets(selectedObjLen);

      if (
        questionCategory === "js" ||
        questionCategory === "css" ||
        questionCategory === "html"
      ) {
        currentIndex = 0;
        rightAnswers = 0;
        coundown(30, selectedObjLen);
      }
      submit.onclick = () => {
        let rightAnswer = selectedObjects[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(rightAnswer, selectedObjLen);

        questionTitle.innerHTML = ``;
        answersContainer.innerHTML = ``;
        addQuestionData(selectedObjects[currentIndex], selectedObjLen);
        handleBullets();
        clearInterval(countdownInterval);
        coundown(30, selectedObjLen);
        showResult(selectedObjLen, questionCategory);
      };
    }
  };

  myRequest.open("GET", "./jsonFiles/" + questionCategory + "Q.json", true);
  myRequest.send();
}

function shuffleArray(array) {
  const shuffeld = array.slice();
  for (let i = shuffeld.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffeld[i], shuffeld[j]] = [shuffeld[j], shuffeld[i]];
  }
  return shuffeld;
}

function setActiveCategory() {
  const selectedOption = selectQ.querySelector("option:checked");
  const category = selectedOption.value;
  currentIndex = 0;
  rightAnswers = 0;
  answersContainer.innerHTML = "";
  bullets.innerHTML = "";
  getData(category);
}

setActiveCategory();

selectQ.addEventListener("change", setActiveCategory);

function createBullets(num) {
  questionsCount.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    bullets.appendChild(bullet);
    if (i === 0) {
      bullet.className = "current";
    }
  }
}

function handleBullets() {
  let bulltesSpan = bullets.querySelectorAll("span");
  let bulletsArr = Array.from(bulltesSpan);

  bulletsArr.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "current";
    }
  });
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitleTxt = document.createTextNode(obj["title"]);
    questionTitle.appendChild(questionTitleTxt);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.type = `radio`;
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;

      let labaltext = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labaltext);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);

      answersContainer.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let asnwers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < asnwers.length; i++) {
    if (asnwers[i].checked) {
      theChoosenAnswer = asnwers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    document.getElementById("correctSound").play();
  } else {
    document.getElementById("wrongSound").play();
  }
}

function showResult(count, choosenCategory) {
  if (currentIndex === count - 1) {
    quizeArea.remove();
    submit.remove();
    bullets.remove();
    selectQ.remove();
    category.innerHTML += choosenCategory.toUpperCase();
    result.innerHTML = `
    <span class="level"></span>, You Answerd
    <span class="numOfAnswers"></span> Question, From
    <span class="questionCount"></span> Question`;
    result.style.display = "block";
    document.querySelector(".numOfAnswers").textContent = rightAnswers;
    document.querySelector(".questionCount").textContent = count;
    if (rightAnswers >= 5) {
      document.getElementById("winSound").play();
      document.querySelector(".level").classList.add("good");
    } else {
      document.querySelector(".level").classList.add("bad");
      document.getElementById("loseSound").play();
    }
    if (rightAnswers === count) {
      document.querySelector(".level").classList.add("perfect");
      return (document.querySelector(".result .level").textContent =
        "Your Mom Must Be Proud Of You!");
    } else if (rightAnswers <= 9 && rightAnswers >= 6) {
      return (document.querySelector(".result .level").textContent =
        "Nice One!");
    } else if (rightAnswers >= 3 && rightAnswers < 6) {
      return (document.querySelector(".result .level").textContent =
        "You Can Do Better!");
    } else if (rightAnswers === 2) {
      return (document.querySelector(".result .level").textContent =
        "At Least You Know Something...");
    } else if (rightAnswers === 1) {
      return (document.querySelector(".result .level").textContent =
        "At Least There's A Hope In You");
    } else {
      return (document.querySelector(".result .level").textContent =
        "You Know What? ...NVM");
    }
  }
}

function coundown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      timer.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        document.getElementById("wrongSound").play();
        clearInterval(countdownInterval);
        timer.innerHTML = "The Time Is Over";
        submit.click();
      }
    }, 1000);
  }
}
