// Select the display element
const display = document.getElementById("display");

// Select all number, operator, and action buttons
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalButton = document.getElementById("equal");
const resetButton = document.getElementById("reset");
const deleteButton = document.getElementById("delete");

// Variables used to store the calculator input
let expression = "";
let currentNumber = "";

// Function to update the calculator display
function updateDisplay(value) {
  display.textContent = value || "0";
}

// Function to check if a value is an operator
function isOperator(value) {
  return value === "+" || value === "-" || value === "*" || value === "/";
}

// Handle number and decimal button clicks
numberButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const value = button.getAttribute("data-value");

    // Prevent more than one decimal point in the same number
    if (value === "." && currentNumber.includes(".")) {
      return;
    }

    currentNumber += value;
    expression += value;

    updateDisplay(expression);
  });
});

// Handle operator button clicks
operatorButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const operator = button.getAttribute("data-value");

    // Do not allow an operator as the first input, except minus
    if (expression === "" && operator !== "-") {
      return;
    }

    // Replace the last operator if two operators are pressed one after another
    const lastCharacter = expression.slice(-1);

    if (isOperator(lastCharacter)) {
      expression = expression.slice(0, -1) + operator;
    } else {
      expression += operator;
    }

    currentNumber = "";
    updateDisplay(expression);
  });
});

// Handle equal button click
equalButton.addEventListener("click", function() {
  try {
    // Do nothing if there is no expression
    if (expression === "") {
      return;
    }

    // Do not calculate if the last character is an operator
    const lastCharacter = expression.slice(-1);

    if (isOperator(lastCharacter)) {
      updateDisplay("Error");
      expression = "";
      currentNumber = "";
      return;
    }

    // Calculate the result
    const result = Function('"use strict"; return (' + expression + ')')();

    // Prevent invalid results such as division by zero
    if (!isFinite(result)) {
      updateDisplay("Error");
      expression = "";
      currentNumber = "";
      return;
    }

    // Round long decimal answers
    const finalResult = Number(result.toFixed(8));

    updateDisplay(finalResult);

    expression = finalResult.toString();
    currentNumber = finalResult.toString();

  } catch (error) {
    updateDisplay("Error");
    expression = "";
    currentNumber = "";
  }
});

// Handle reset button click
resetButton.addEventListener("click", function() {
  expression = "";
  currentNumber = "";
  updateDisplay("0");
});

// Handle delete button click
deleteButton.addEventListener("click", function() {
  if (expression.length > 0) {
    const removedCharacter = expression.slice(-1);
    expression = expression.slice(0, -1);

    // If the removed character was an operator, rebuild currentNumber
    if (isOperator(removedCharacter)) {
      const parts = expression.split(/[\+\-\*\/]/);
      currentNumber = parts[parts.length - 1];
    } else {
      currentNumber = currentNumber.slice(0, -1);
    }
  }

  updateDisplay(expression);
});