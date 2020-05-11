const form = document.querySelector(".form");
const submitBtn = document.querySelector(".submit");
const username = document.querySelector(".user");
const descriptionText = document.querySelector(".description-text");
const quizPage = document.querySelector(".main-quiz");
const quizStart = document.querySelector(".quiz-start");
let optionBtn = document.querySelectorAll(".btn");
let progressBar = document.getElementById("progress");
let mainQuestion = document.querySelector(".main-question");
const nextQuestionBtn = document.querySelector(".next");
const questionHeading = document.querySelector(".question-heading");
const optionsContainer = document.querySelector(".options-container");
const displayLoading = document.querySelector('.display-loading');

let state = {
  name: "",
  progress: 10,
  category: "",
  difficulty: "",
  type: "",
  questionArray: [],
  answer: "",
  questionNumber: 1,
};

let questionAttempted = false;
let points = 0;

let fetchApi = (category, difficulty, type) => {
  return fetch(
    `https://opentdb.com/api.php?amount=10${
      category == "random" ? "" : `&category=${category}`
    }${difficulty == "random" ? "" : `&difficulty=${difficulty}`}${
      type == "random" ? "" : `&type=${type}`
    }`
  )
    .then((response) => response.json())
    .then((data) => data.results)
    .catch((err) => console.log(err));
};

// listening for a submit event on the Start button

submitBtn.addEventListener("click", (event) => {
  const inputName = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const difficulty = document.getElementById("difficulty").value;
  const type = document.getElementById("type").value;
  const questionCategory = document.querySelector(".question-category");
  const questionDifficulty = document.querySelector(".question-difficulty");
  const questionType = document.querySelector(".question-type");
  if (inputName && category && difficulty && type) {
    fetchApi(category, difficulty, type).then((data) => {
      data.map((item) => state.questionArray.push(item));
      let newQuiz = state.questionArray.splice(0, 1)[0];
      mainQuestion.innerHTML = newQuiz.question;
      state.answer = newQuiz.correct_answer;
      const optionArray = [
        ...newQuiz.incorrect_answers,
        newQuiz.correct_answer,
      ].sort(() => Math.random() - 0.5);
      optionBtn.forEach((btn, i) => (optionBtn[i].innerText = optionArray[i]));
      optionBtn.forEach((btn) => {
        if (btn.innerHTML == "" || btn.innerHTML == "undefined") {
          btn.style.opacity = "0";
        }
      });
      questionCategory.innerHTML = newQuiz.category;
      questionType.innerHTML = newQuiz.type;
      questionDifficulty.innerHTML = newQuiz.difficulty;
      // console.log(optionArray);
      // console.log(state.answer);
    });
    questionHeading.innerText = `Question ${state.questionNumber}`;
    state.name = inputName;
    displayLoading.style.zIndex = 5;
    descriptionText.style.display = "none";
    quizPage.style.display = "flex";
    progressBar.value = state.progress;
    username.innerHTML = `Welcome ${state.name}`;
    form.style.filter = "blur(5px)";
  } else {
    displayformError("fill in all fields", "failed-alert");
  }
});

optionBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (!questionAttempted) {
      e.target.textContent == state.answer ? correctAnswer(e) : wrongAnswer(e);
      questionAttempted = true;
      state.progress += 10;
      state.questionNumber += 1;
      if (state.questionArray.length == 0) {
        nextQuestionBtn.innerHTML = "Finish";
      }
      // console.log(e.target.innerHTML, e.target.innerText, e.target.textContent);
    } else {
      return;
    }
  });
});

nextQuestionBtn.addEventListener("click", () => {
  const questionCategory = document.querySelector(".question-category");
  const questionDifficulty = document.querySelector(".question-difficulty");
  const questionType = document.querySelector(".question-type");
  const displayScore = document.querySelector(".display-score");
  const score = document.querySelector(".display-score p");
  const congratulatoryText = document.querySelector(".display-score h2");
  const playAgain = document.querySelector('.play-again');
  const quizStatus = document.querySelector('.blur');
  if (nextQuestionBtn.innerHTML == "Finish") {
    displayScore.style.zIndex = 10;
    congratulatoryText.innerHTML = `<div style='color:white; font-size:1.2rem'>Congratulations <span style='color:purple; text-transform: capitalize'>${state.name}</span> You Just Got Quized Up</div>`
    score.innerHTML = `You Scored ${points * 10}%`;
    playAgain.style.display = 'block'
    quizStatus.innerHTML = 'Quiz Completed'
  } else {
    if (!questionAttempted) {
      return;
    } else {
      optionBtn.forEach((btn) => {
        if (btn.classList.contains("correct")) {
          btn.classList.remove("correct");
        } else if (btn.classList.contains("wrong")) {
          btn.classList.remove("wrong");
        }
      });
      progressBar.value = state.progress;
      questionHeading.innerText = `Question ${
        state.questionNumber > 10 ? 10 : state.questionNumber
      }`;
      let newQuiz = state.questionArray.splice(0, 1)[0];
      mainQuestion.innerHTML = newQuiz.question;
      state.answer = newQuiz.correct_answer;
      const optionArray = [
        ...newQuiz.incorrect_answers,
        newQuiz.correct_answer,
      ].sort();
      optionBtn.forEach((btn, i) => (optionBtn[i].innerHTML = optionArray[i]));
      optionBtn.forEach((btn) => {
        if (btn.innerHTML == "" || btn.innerHTML == "undefined") {
          btn.style.display = "none";
        }
      });

      optionBtn.forEach((btn) => {
        if (
          btn.innerHTML !== "" &&
          btn.innerHTML !== "undefined" &&
          btn.innerHTML !== "" &&
          btn.style.display == "none"
        ) {
          btn.style.display = "block";
        }
      });
      questionCategory.innerHTML = newQuiz.category;
      questionType.innerHTML = newQuiz.type;
      questionDifficulty.innerHTML = newQuiz.difficulty;
      questionAttempted = !questionAttempted;

      // console.log("answer", state.answer);
      // console.log("question", newQuiz.question);
      // console.log("options", optionArray);
      // console.log("questionAttempted", questionAttempted);
      // console.log("questionArray length", state.questionArray.length);
    }
  }
});

let displayformError = (message, className) => {
  let div = document.createElement("div");
  div.className = className;
  div.appendChild(document.createTextNode(message));
  let leftHeading = document.getElementById("left-heading");
  let left = document.getElementById("left");
  left.insertBefore(div, leftHeading);
  setTimeout(() => document.querySelector(".failed-alert").remove(), 2000);
};

const correctAnswer = (e) => {
  e.target.classList.add("correct");
  points += 1;
  // console.log(points);
};

const wrongAnswer = (e) => {
  e.target.classList.add("wrong");
  points = points;
  optionBtn.forEach((btn) => {
    if (btn.innerText == state.answer) {
      btn.classList.add("correct");
    }
  });
  // console.log(points);
};

mainQuestion.addEventListener('DOMNodeInserted', () => {
  displayLoading.style.zIndex = -1
  quizStart.style.zIndex = 10
})