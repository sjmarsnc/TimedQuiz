// various areas to hide or display 
var welcomeArea = document.querySelector("#welcome-area"); 
var quizArea = document.querySelector("#quiz-area"); 
var finishedArea = document.querySelector("#finished-area"); 
var highScoresArea = document.querySelector("#high-scores-area"); 
var rowAreaEl = document.querySelector("#row-area");  
var scoreTableEl = document.querySelector("#score-table"); 
var timeLeftEl = document.querySelector("#timeLeft"); 

var quizTime = 75;   // 75 seconds to take quiz , lose 10 seconds for a wrong answer 
var questionEl = document.getElementById("question"); 
var answersEl = document.getElementById("answers"); 
var rowEl = document.getElementById("rightOrWrong");  
var startButton = document.getElementById("start"); 
var finalScoreEl = document.getElementById("finalscore"); 
var backButton = document.getElementById("goBack"); 
var noSavedScoresEl = document.getElementById("no-saved-scores");
var saveScoreButton = document.getElementById("saveScore"); 
var clearScoresButton = document.getElementById("clearScores"); 
var initialsEl = document.getElementById("initials"); 
var beepEl = document.getElementById("beep"); 

var highScores = [];  // saved high scores   
var currentQuestion = 0;  // the currently displayed question 
var timeLeft = 0; 
var quizScore = 0;  
var timerInterval; 


function displayQuestion(index) {
    questionEl.textContent = questions[index].title; 
    
    answersEl.innerHTML = ""; 
    
    for (var i=0; i < questions[index].choices.length; i++) {
        var answerButton = document.createElement("button"); 
        answerButton.setAttribute("class","btn m-2 text-left");
        answerButton.setAttribute("data-id",questions[index].choices[i]);
        var questionNum = i + 1; 
        answerButton.textContent = questionNum + ". " + questions[index].choices[i]; 
        answersEl.appendChild(answerButton); 
    }
}

function startQuiz() {
    timeLeft = quizTime;   
    quizScore = 0;  
    timeLeftEl.textContent = timeLeft; 
    welcomeArea.classList.add("hide"); 
    quizArea.classList.remove("hide"); 
    currentQuestion = 0;   
    displayQuestion(0); 
    startTimer(); 
}

function startTimer() {
     timerInterval = setInterval(updateTimerDisplay,1000);
}
        
function updateTimerDisplay() {
    timeLeft = timeLeftEl.textContent; 
    if (timeLeft <= 0) {
        clearInterval(timerInterval); 
        // indicate that they ran out of time 
        quizDone(); 
    }
    else {
        timeLeft --;  
        timeLeftEl.textContent = timeLeft; 
    }
}

function answer(row) { 
    rowAreaEl.classList.remove("hide");     
    if (row) {
        rowEl.textContent = "Correct!"; 
        rowEl.style = "color: green; font-style: italic; font-size: 1.5rem;";
        quizScore += 10;  
        console.log("quizScore: " + quizScore); 
    }
    else {
        rowEl.textContent = "Incorrect!"; 
        rowEl.style = "color: red; font-style: italic; font-size: 1.5rem;"; 
        console.log("Beep element: " + beepEl);
        beepEl.play(); 
        updateTimeLeft = timeLeftEl.textContent; 
        updateTimeLeft -= 10;  
        if (updateTimeLeft < 0 ) {
            updateTimeLeft = 0; 
        }
        timeLeftEl.textContent = updateTimeLeft; 
    }
    var showMsgTimer = setTimeout( function () { 
        rowEl.textContent = "";
        rowAreaEl.classList.add("hide");  
        }, 1500);  
    
     
}



function checkAnswer(event) {
    event.preventDefault(); 
    if (event.target.matches("button")) {
        var userAnswer = event.target.getAttribute("data-id"); 
        var correctAnswer = questions[currentQuestion].answer;  
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
    quizArea.classList.add("hide"); 
    finishedArea.classList.remove("hide"); 
    clearInterval(timerInterval); 
    timeLeftEl.textContent = timeLeft; 
    console.log("time left: " + timeLeft + "  quizScore: " + quizScore); 
    quizScore = parseInt(quizScore) + parseInt(timeLeft);  // need to keep score 
    timeLeft = 0 ;  
    finalScoreEl.textContent = quizScore; 
    console.log("quizDone called");  
}

function clearScores() {
    console.log("clearScores function called");
    localStorage.removeItem("quizHighScores"); 
    noSavedScoresEl.textContent = "No saved scores available";
    var oldScore = scoreTableEl.lastElementChild; 
    while (oldScore) {
        scoreTableEl.removeChild(oldScore);
        oldScore = scoreTableEl.lastElementChild; 
    } 
}

function getSavedScores() {
    var quizScoresSaved = localStorage.getItem("quizHighScores"); 
    if (quizScoresSaved != null) {
        highScores = JSON.parse(localStorage.getItem("quizHighScores")); 
    }
    else {
        highScores = []; 
    }
}

function saveScore() {
    event.preventDefault(); 
    var initials = initialsEl.value.trim();
    initials = initials.toUpperCase(); 
    console.log("initials after uppercase: " + initials) ; 
    getSavedScores(); 
    var newScore = { initials: initials, score: quizScore} ;
    var matchedInitials = ""; 
    var notAdded = true; 
    if (highScores.length > 0 ) { 
        console.log("newScore: " + newScore.initials + " " + newScore.score); 
        
        // insert line where it goes according to highest score and 
        // remove any ones with the same initials and lower scores 
        // list will be in descending order by score 
        console.log("At beginning: " + highScores); 
        console.log("Incoming: " + initials + " " + quizScore);
        for (var i=0; i < highScores.length; i++) {
            console.log("i: " + i  + " highScores.initials: " + highScores[i].initials +
                "  highScores.score: " + highScores[i].score);
            if (quizScore > highScores[i].score && notAdded) {
                console.log("high score"); 
                highScores.splice(i, 0, newScore); 
                matchedInitials = initials; 
                notAdded = false; 
            }
            else if (highScores[i].initials === matchedInitials) {
                // already added one for this user, remove the old one 
                highScores.splice(i,1); 
                console.log('Removed old one for initials ' + matchedInitials); 
            }
            else if (highScores[i].initials === initials && 
                     highScores[i].score > quizScore) {
                break; // already one for this user with a higher score 
            }
            else if (i === (highScores.length-1) && notAdded) {
                highScores.push(newScore);  
                notAdded = false; 
            }
        }
    } 
    else {
        highScores[0] = newScore;  
    }
    // save new list of high scores, already in order 
    highScoresAsString = JSON.stringify(highScores); 
    localStorage.setItem("quizHighScores",highScoresAsString); 
    initialsEl.value = "";  
    finishedArea.classList.add("hide"); 
    displayHighScores();   
}

function displayHighScores() {
    console.log("displayHighScores function called"); 
    highScoresArea.classList.remove("hide"); 
    welcomeArea.classList.add("hide"); 
    quizArea.classList.add("hide") ;
     
    getSavedScores(); 
    // scoreTableEl.innerhtml = "";  this did not clear out existing scores 
    // clear out previous list 
    var oldScore = scoreTableEl.lastElementChild; 
    while (oldScore) {
        scoreTableEl.removeChild(oldScore);
        oldScore = scoreTableEl.lastElementChild; 
    } 
     
    if (highScores.length === 0) {
        noSavedScoresEl.textContent = "No saved scores available";
    }
    else {
        noSavedScoresEl.textContent = ""; 
    }
    for (var i=0; i < highScores.length; i++) {
        var liEl = document.createElement("li");
        liEl.textContent = highScores[i].initials + " - " + highScores[i].score; 
        console.log(liEl.textContent); 
        scoreTableEl.appendChild(liEl);  
    }
}

function goToBeginning() {
    console.log("goToBeginning function called"); 
    timeLeftEl.textContent = "0";  
    highScoresArea.classList.add("hide"); 
    welcomeArea.classList.remove("hide"); 

  
}

backButton.addEventListener("click", goToBeginning); 
clearScoresButton.addEventListener("click", clearScores); 
startButton.addEventListener("click", startQuiz); 
answersEl.addEventListener("click", checkAnswer); 
saveScoreButton.addEventListener("click", saveScore); 