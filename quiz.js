// declaring necessary variable for use in the app so as not to populate the global scope
const optionBtn = document.querySelectorAll('.btn');
const nextQuestionBtn = document.querySelector('.next');

// redirecting the user to index.html if the the form was not filled
if (localStorage.getItem('playerDetails') === null) {
   window.location.href = 'index.html';
}

// getting and setting the players name from localStorage
document.querySelector('.user').innerHTML = `Welcome ${
   JSON.parse(localStorage.getItem('playerDetails')).name
}`;

// fetching data from the API data
let fetchApi = (category, difficulty, type) => {
   return fetch(
      `https://opentdb.com/api.php?amount=10${
         category == 'random' ? '' : `&category=${category}`
      }${difficulty == 'random' ? '' : `&difficulty=${difficulty}`}${
         type == 'random' ? '' : `&type=${type}`
      }`
   )
      .then((response) => response.json())
      .then((data) => data.results)
      .catch((err) => console.log(err));
};

// declaring an array to house the data from the API
// let apiData = [];

// declaring an object to hod state of the app
let state = {
   apiData: [],
   questionAttempted: false,
   newQuestion: null,
   questionNumber: 1,
   progress: 10,
   answer: '',
   answerIndex: 0,
   points: 0,
   failedQuestions: [],
};

// pushing data from the API to apiData
category = JSON.parse(localStorage.getItem('playerDetails')).category;
difficulty = JSON.parse(localStorage.getItem('playerDetails')).difficulty;
type = JSON.parse(localStorage.getItem('playerDetails')).type;
fetchApi(category, difficulty, type).then((data) => {
   data.map((item) => state.apiData.push(item));
   document.querySelector('.loader').innerHTML = data[0].type;
});

// checking when the api data is ready to start the quiz
document.querySelector('.loader').addEventListener('DOMNodeInserted', () => {
   document.querySelector('.loading').classList.add('disappear');
   quizStart();
});

// function to create a new quiz
const newQuiz = () => {
   const questionCategory = document.querySelector('.question-category');
   const questionDifficulty = document.querySelector('.question-difficulty');
   const questionType = document.querySelector('.question-type');
   const progressBar = document.querySelector('.progress');
   const questionHeading = document.querySelector('.question-heading');

   // splicing the first array from apidata to serve as the question to be displayed
   const newQuestion = state.apiData.splice(0, 1)[0];
   state.newQuestion = newQuestion;

   // modifying various parts of the DOM to recieve updated inputs
   state.answer = newQuestion.correct_answer;
   questionCategory.innerHTML = newQuestion.category;
   questionType.innerHTML = newQuestion.type;
   questionDifficulty.innerHTML = newQuestion.difficulty;
   questionHeading.innerText = `Question ${
      state.questionNumber > 10 ? 10 : state.questionNumber
   }`;
   progressBar.value = state.progress;
   document.querySelector('.main-question').innerHTML = newQuestion.question;

   // creating the options array and fixing the value in the choices/options button
   const optionArray = [
      ...newQuestion.incorrect_answers,
      newQuestion.correct_answer,
   ].sort();
   // updating the index of the correct answer in state.answerIndex
   for (let i = 0; i < optionArray.length; i++) {
      if (optionArray[i] === newQuestion.correct_answer) {
         state.answerIndex = i;
      }
   }

   // filling the option button (quiz choices) with values
   optionBtn.forEach((btn, i) => (optionBtn[i].innerHTML = optionArray[i]));

   // validaton to hide/show option buttons that display as undefined
   optionBtn.forEach((btn) => {
      if (btn.innerHTML == '' || btn.innerHTML == 'undefined') {
         btn.style.visibility = 'hidden';
      }
      if (
         btn.innerHTML !== '' &&
         btn.innerHTML !== 'undefined' &&
         btn.innerHTML !== '' &&
         btn.style.visibility == 'hidden'
      ) {
         btn.style.visibility = 'visible';
      }
   });
   console.log(newQuestion.correct_answer);
};

// display correct answer function
const correctAnswer = (e) => {
   e.target.classList.add('correct');
   state.points += 1;
};

// display wrong answer function
const wrongAnswer = (e) => {
   e.target.classList.add('wrong');
   state.points = state.points;
   optionBtn.forEach((btn, index) => {
      index == state.answerIndex ? btn.classList.add('correct') : '';
   });

   // pushing failed questions to state.failedQuestion array
   state.failedQuestions.push({
      question: state.newQuestion.question,
      correctAnswer: state.newQuestion.correct_answer,
      yourAnswer: e.target.innerHTML,
   });
};

// starting the quiz
const quizStart = () => newQuiz();

// quiz end
const quizEnd = () => {
   nextQuestionBtn.innerHTML = 'Finish'
   localStorage.setItem('quizDetails', JSON.stringify({
      numberOfQuestions: 10,
      correctAnswer: state.points,
      failedQuestions: state.failedQuestions
      }))
}

optionBtn.forEach((btn, i) => {
   // adding event listeners to the option button (question choices)
   btn.addEventListener('click', (e) => {
      if (!state.questionAttempted) {
         // checking if the index of the clicked option button is the same as state.answerIndex i.e validation for correct/wrong answer
         i == state.answerIndex ? correctAnswer(e) : wrongAnswer(e);
         state.questionAttempted = !state.questionAttempted;
         state.progress += 10;
         state.questionNumber += 1;
         state.apiData.length == 0
            ? quizEnd()
            : '';
      } else {
         return;
      }
   });
});

// event listener on the next button to display a new question
nextQuestionBtn.addEventListener('click', () => {
   if (nextQuestionBtn.innerHTML == 'Finish') {
      window.location.href = 'score.html'
   } else {
      if (!state.questionAttempted) {
         return;
      } else {
         optionBtn.forEach((btn) => {
            if (btn.classList.contains('correct')) {
               btn.classList.remove('correct');
            } else if (btn.classList.contains('wrong')) {
               btn.classList.remove('wrong');
            }
         });
         newQuiz();
         state.questionAttempted = !state.questionAttempted;
      }
   }
});

document.querySelector('.home').addEventListener('click', () => {
   document.querySelector('#home-modal').style.display = 'flex'
});

document.querySelector('.span-close').addEventListener('click', () => {
  document.querySelector('#home-modal').style.display = 'none'
});

document.querySelector('.btn-close').addEventListener('click', () => {
  document.querySelector('#home-modal').style.display = 'none'
});

document.querySelector('.confirm').addEventListener('click', () => {
  localStorage.clear();
   window.location.href = 'index.html';
});


