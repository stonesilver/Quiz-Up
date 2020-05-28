const particles = {
    particles: {
       number: {
          value: 200,
          density: {
             enable: true,
             value_area: 800,
          },
       },
       color: {
          value: '#ffffff',
       },
       shape: {
          type: 'circle',
          stroke: {
             width: 0,
             color: '#000000',
          },
          polygon: {
             nb_sides: 5,
          },
          image: {
             src: 'img/github.svg',
             width: 100,
             height: 100,
          },
       },
       opacity: {
          value: 0.5,
          random: false,
          anim: {
             enable: false,
             speed: 1,
             opacity_min: 0.1,
             sync: false,
          },
       },
       size: {
          value: 3,
          random: true,
          anim: {
             enable: false,
             speed: 40,
             size_min: 0.1,
             sync: false,
          },
       },
       line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1,
       },
       move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
             enable: false,
             rotateX: 600,
             rotateY: 1200,
          },
       },
    },
    interactivity: {
       detect_on: 'canvas',
       events: {
          onhover: {
             enable: false,
             mode: 'grab',
          },
          onclick: {
             enable: false,
             mode: 'push',
          },
          resize: true,
       },
       modes: {
          grab: {
             distance: 140,
             line_linked: {
                opacity: 1,
             },
          },
          bubble: {
             distance: 400,
             size: 40,
             duration: 2,
             opacity: 8,
             speed: 3,
          },
          repulse: {
             distance: 200,
             duration: 0.4,
          },
          push: {
             particles_nb: 4,
          },
          remove: {
             particles_nb: 2,
          },
       },
    },
    retina_detect: true,
 };
 
 particlesJS('particles-js', particles);
 
 if (localStorage.getItem('quizDetails') === null) {
    window.location.href = 'index.html';
 }
 
 if (
    JSON.parse(localStorage.getItem('quizDetails')).failedQuestions.length == 0
 ) {
    document.querySelector('.failed-questions').style.display = 'none';
    document.querySelector('#nav-btn').style.justifyContent = 'center';
 }
 
 document.querySelector('.failed-questions').addEventListener('click', () => {
    document.querySelector('#modal').style.display = 'flex';
 });
 
 document.querySelector('.modal-nav').addEventListener('click', () => {
    document.querySelector('#modal').style.display = 'none';
 });
 
 document.querySelector('.play-again').addEventListener('click', () => {
    window.location.href = 'index.html';
 });
 
 document.querySelector('.total-tile').innerHTML = JSON.parse(
    localStorage.getItem('quizDetails')
 ).numberOfQuestions;
 
 document.querySelector('.correct-tile').innerHTML = JSON.parse(
    localStorage.getItem('quizDetails')
 ).correctAnswer;
 
 document.querySelector('.wrong-tile').innerHTML =
    JSON.parse(localStorage.getItem('quizDetails')).numberOfQuestions -
    JSON.parse(localStorage.getItem('quizDetails')).correctAnswer;
 
 document.querySelector('.percentage-tile').innerHTML =
    JSON.parse(localStorage.getItem('quizDetails')).correctAnswer * 10;
 
 JSON.parse(localStorage.getItem('quizDetails')).failedQuestions.forEach(
    (question) => {
       document.querySelector('.failed-questions-modal').innerHTML += `
    <div class="question-tile">
                      <div class="question">
                         ${question.question}
                      </div>
                      <div class="answer">
                         <div class="correct">
                            <i class="fas fa-thumbs-up"></i>
                            <p class="correct-answer">${question.correctAnswer}</p>
                         </div>
                         <div class="wrong">
                            <i class="fas fa-thumbs-down"></i>
                            <p class="your-answer">${question.yourAnswer}</p>
                         </div>
                      </div>
                   </div>
    `;
    }
 );
 