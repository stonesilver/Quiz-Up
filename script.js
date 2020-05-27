const submitBtn = document.querySelector(".submit");

// deleting existing player details
window.addEventListener("DOMContentLoaded", () => {
  localStorage.getItem("playerDetails") !== null ? localStorage.clear() : "";
  localStorage.getItem("quizDetails") !== null ? localStorage.clear() : "";
});

//fetching category data from the api
const getCategory = () => {
  return fetch("https://opentdb.com/api_category.php")
  .then((response) => response.json())
  .then((data) => data.trivia_categories)
  .catch(err => console.log(err))
}

getCategory().then(category => createSelectOptions(category))

// listening for a submit event on the Start button

submitBtn.addEventListener("click", (event) => {
  const inputName = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const difficulty = document.getElementById("difficulty").value;
  const type = document.getElementById("type").value;
  if (window.navigator.onLine) {
    if (inputName && category && difficulty && type) {
      // fetchApi(category, difficulty, type).then((data) => {
      //   data.map((item) => state.questionArray.push(item));
      // });
      localStorage.setItem(
        "playerDetails",
        JSON.stringify({
          name: inputName,
          category: category,
          difficulty: difficulty,
          type: type,
        })
      );
      window.location.href = "quiz.html";
    } else {
      displayformError("fill in all fields", "failed-alert");
    }
  } else {
    displayformError("No active internet connection", "failed-alert")
  }
  
});

// display alert function
let displayformError = (message, className) => {
  let div = document.createElement("div");
  div.className = className;
  div.appendChild(document.createTextNode(message));
  let leftHeading = document.getElementById("left-heading");
  let left = document.getElementById("left");
  left.insertBefore(div, leftHeading);
  setTimeout(() => document.querySelector(".failed-alert").remove(), 2000);
};

let createSelectOptions = (data) => {
  data.map((category) => {
    let option = document.createElement("option");
    option.value = category.id
    option.appendChild(document.createTextNode(category.name));
    let select = document.getElementById("category");
    select.appendChild(option);
    });
};
