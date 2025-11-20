// Track user selections by question ID
const userSelections = {
  one: null,
  two: null,
  three: null
};

// Track if quiz is complete
let quizComplete = false;

// Initialize the quiz
document.addEventListener('DOMContentLoaded', () => {
  // Add click listeners to all choice elements
  const choices = document.querySelectorAll('[data-choice-id]');
  choices.forEach(choice => {
    choice.addEventListener('click', handleChoiceClick);
  });
});

function handleChoiceClick(event) {
  if (quizComplete) return; // Don't allow changes after completion
  
  const choice = event.currentTarget;
  const questionId = choice.dataset.questionId;
  const choiceId = choice.dataset.choiceId;
  
  // If this question already has an answer, remove previous selection
  if (userSelections[questionId]) {
    const previousChoice = document.querySelector(`[data-question-id="${questionId}"][data-choice-id="${userSelections[questionId]}"]`);
    resetChoiceStyles(previousChoice);
  }
  
  // Update selection
  userSelections[questionId] = choiceId;
  
  // Apply selected styles
  applySelectedStyles(choice);
  
  // Apply unselected styles to other choices in same question
  const otherChoices = document.querySelectorAll(`[data-question-id="${questionId}"]:not([data-choice-id="${choiceId}"])`);
  otherChoices.forEach(otherChoice => {
    applyUnselectedStyles(otherChoice);
  });
  
  // Check if quiz is complete
  checkQuizCompletion();
}

function applySelectedStyles(choice) {
  // Change checkbox to checked
  const checkbox = choice.querySelector('.checkbox');
  checkbox.src = 'images/checked.png';
  
  // Change background color
  choice.style.backgroundColor = '#cfe3ff';
  choice.style.opacity = '1';
}

function applyUnselectedStyles(choice) {
  // Set opacity
  choice.style.opacity = '0.6';
  
  // Ensure checkbox is unchecked
  const checkbox = choice.querySelector('.checkbox');
  checkbox.src = 'images/unchecked.png';
  
  // Reset background
  choice.style.backgroundColor = '';
}

function resetChoiceStyles(choice) {
  // Reset to original appearance
  const checkbox = choice.querySelector('.checkbox');
  checkbox.src = 'images/unchecked.png';
  choice.style.backgroundColor = '';
  choice.style.opacity = '1';
}

function checkQuizCompletion() {
  const allAnswered = userSelections.one && userSelections.two && userSelections.three;
  
  if (allAnswered && !quizComplete) {
    quizComplete = true;
    showPersonalityResult();
  }
}

function calculateScore() {
  const choice1 = RESULTS_MAP[userSelections.one];
  const choice2 = RESULTS_MAP[userSelections.two];
  const choice3 = RESULTS_MAP[userSelections.three];
  
  const score = Math.round((choice1.id + choice2.id + choice3.id) / 3);
  
  // Find the result with matching score
  for (const [key, result] of Object.entries(RESULTS_MAP)) {
    if (result.id === score) {
      return result;
    }
  }
  
  return null;
}

function showPersonalityResult() {
  const result = calculateScore();
  if (!result) return;
  
  // Create result section
  const resultSection = document.createElement('section');
  resultSection.className = 'personality-result';
  
  resultSection.innerHTML = `
    <h2>Your Dog Personality Type: ${result.title}</h2>
    <p>${result.contents}</p>
    <button id="restart-quiz">Restart quiz</button>
  `;
  
  // Add to page
  document.querySelector('body').appendChild(resultSection);
  
  // Add restart button listener
  document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
  
  // Scroll to result
  resultSection.scrollIntoView();
}

function restartQuiz() {
  // Reset selections
  userSelections.one = null;
  userSelections.two = null;
  userSelections.three = null;
  quizComplete = false;
  
  // Reset all choice styles
  const allChoices = document.querySelectorAll('[data-choice-id]');
  allChoices.forEach(choice => resetChoiceStyles(choice));
  
  // Remove result section
  const resultSection = document.querySelector('.personality-result');
  if (resultSection) {
    resultSection.remove();
  }
  
  // Scroll to top of quiz
  const firstSection = document.querySelector('section');
  firstSection.scrollIntoView();
}
