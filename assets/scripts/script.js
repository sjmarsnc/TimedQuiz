// various areas to hide or display 
var welcomeArea = document.querySelector("#welcome-area"); 
console.log(welcomeArea); 
var quizArea = document.querySelector("#quiz-area"); 
var finishedArea = document.querySelector("#finished-area"); 
var highScoresArea = document.querySelector("#high-scores-area"); 
var scoreTableEl = document.querySelector("#score-table"); 
var timeLeftEl = document.querySelector("#timeLeft"); 

var quizTime = 75;   // 75 seconds to take quiz , lose 10 seconds for a wrong answer 
var questionEl = document.getElementById("question"); 
var answersEl = document.getElementById("answers"); 
var rowEl = document.getElementById("rightOrWrong");  
var startButton = document.getElementById("start"); 
var finalScoreEl = document.getElementById("finalscore"); 
var backButton = document.getElementById("goBack"); 
var saveScoreButton = document.getElementById("saveScore"); 
var clearScoresButton = document.getElementById("clearScores"); 
var initialsEl = document.getElementById("initials"); 
var quizScores = [];  // initialize quizScores here 

var currentQuestion = 0;  // the currently displayed question 
var timeLeft = 0;  

function clearScores() {
    console.log("clearScores function called");
    localStorage.setItem("quizScores","");  
    quizScores = [""];
}

function displayQuestion(index) {
    questionEl.textContent = questions[index].title; 

     answersEl.innerHTML = ""; 

     for (var i=0; i < questions[index].choices.length; i++) {
         var answerButton = document.createElement("button"); 
         answerButton.setAttribute("class","btn mt-2 text-left");
         answerButton.setAttribute("data-id",questions[index].choices[i]);
         var questionNum = i + 1; 
         answerButton.textContent = questionNum + ". " + questions[index].choices[i]; 
         answersEl.appendChild(answerButton); 
      }
}

function startQuiz() {
    timeLeft = 75; 
    timeLeftEl.value = timeLeft; 
    welcomeArea.classList.add("hide"); 
    quizArea.classList.remove("hide"); 
    currentQuestion = 0;   
    displayQuestion(0); 
}

function answer(row) {     
    if (row) {
        rowEl.textContent = "Correct!"; 
        rowEl.style = "color: green; font-style: italic; font-size: 1.5rem;"; 
    }
    else {
        rowEl.textContent = "Incorrect!"; 
        rowEl.style = "color: red; font-style: italic; font-size: 1.5rem;"; 
        // make a sound
        timeLeftEl = timeLeft - 10;  
    }
    //display for only two seconds or otherwise show error more clearly
    //change color on button   
    
}

function checkAnswer(event) {
    event.preventDefault(); 
    if (event.target.matches("button")) {
        var userAnswer = event.target.getAttribute("data-id"); 
        var correctAnswer = questions[currentQuestion].answer; 
        console.log("user: " + userAnswer + " correct: " + correctAnswer); 
        rowEl.classList.remove("hide");  
        answer(userAnswer === correctAnswer); 
        currentQuestion ++; 
        if (currentQuestion === questions.length) {
            quizDone(); 
        }  
        else {
            displayQuestion(currentQuestion); 
        }  
    }
}

function quizDone() {
    console.log("quizDone called");  
    quizArea.classList.add("hide"); 
    finishedArea.classList.remove("hide"); 
    //stop timer 
    finalScoreEl.value = timeLeft; 
}

function saveScore() {
    event.preventDefault(); 
    var initials = initialsEl.value;
    initials = initials.toUpperCase();   
    var quizScoresSaved = localStorage.getItem("quizScores"); 
    if (quizScoresSaved != null && quizScoresSaved != "") {
        quizScores = JSON.parse(localStorage.getItem("quizScores")); 
        quizScores.push({initials: initials, score: timeLeft });
    } 
    //  need to check for existing score for those initials  
    
    // either not previously stored or cleared 
    else {
        quizScores = [{initials: initials,
                      score: timeLeft}]; 
    }
    // sort so highest first 
    quizScoresAsString = JSON.stringify(quizScores); 
    localStorage.setItem("quizScores",quizScoresAsString); 
    
    finishedArea.classList.add("hide"); 
    displayHighScores();   
}

function displayHighScores() {
    console.log("displayHighScores function called"); 
    highScoresArea.classList.remove("hide"); 
    welcomeArea.classList.add("hide");  
    // display the scores 
    scoreTableEl.innerhtml = ""; 
    console.log(quizScores); 
    for (var i=0; i < quizScores.length; i++) {
        var liEl = document.createElement("li");
        liEl.textContent = quizScores[i].initials + " - " + quizScores[i].score; 
        console.log(liEl.textContent); 
        scoreTableEl.appendChild(liEl);  
    }
}

function goToBeginning() {
    console.log("goToBeginning function called"); 
    highScoresArea.classList.add("hide"); 
    welcomeArea.classList.remove("hide"); 
    // set time to 0 
}

backButton.addEventListener("click", goToBeginning); 
clearScoresButton.addEventListener("click", clearScores); 
startButton.addEventListener("click", startQuiz); 
answersEl.addEventListener("click", checkAnswer); 
saveScoreButton.addEventListener("click", saveScore); 