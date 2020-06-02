# Timed Quiz

## Timed Quiz application  

The challenge is to create a [timed quiz](https://sjmarsnc.github.io/TimedQuiz/).  The topic is Javascript fundamentals, and the quiz is presented in the form of multiple-choice questions. 

## Rules 

Questions are presented to the user and they must select the correct answer.  If they select the wrong answer, they hear a buzzer and the text "Incorrect" is shown for 2 seconds.  Correct answers get a bonus of 10 points, incorrect answers cause a deduction of 10 seconds from the available time.   At the end of the quiz any time left is added to the score.  The highest score for any set of initials is saved in local storage, and the high scores can be displayed using the "See High Scores" link in the upper left corner of the page.  High scores are also displayed after a quiz is completed and the latest score registered.  High scores are sorted in descending order. 

## Implementation 

The page is implemented by creating each section as a div and hiding or displaying it depending on where the user is in the quiz sequence.  

Questions are stored in a separate questions.js file, making it easy to set up different sets of questions on different topics.  

The sound comes from Google sounds - license here:  https://creativecommons.org/licenses/by/4.0/ 

