// This selects the calculator display screen
const display = document.getElementById("display");

// This selects all number buttons, including the decimal point button
const numberButtons = document.querySelectorAll(".number");

// This selects all operation buttons such as +, -, x, and /
const operatorButtons = document.querySelectorAll(".operator");

// This selects the equal button
const equalButton = document.getElementById("equal");

// This selects the reset button
const resetButton = document.getElementById("reset");

// This selects the delete button
const deleteButton = document.getElementById("delete");

// This variable stores the full calculation, for example 7+3
let expression = "";

// This variable stores the current number being typed
let currentNumber = "";

// This function updates what is shown on the calculator screen
function updateDisplay(value) {
  display.textContent = value || "0";
}

// This function checks if a value is an operator
function isOperator(value) {
  return value === "+" || value === "-" || value === "*" || value === "/";
}

// This function checks if the last character typed is an operator
function lastCharacterIsOperator() {
  const lastCharacter = expression.slice(-1);
  return isOperator(lastCharacter);
}

// This code runs when any number or decimal button is clicked
numberButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    // Get the value from the button that was clicked
    const value = button.getAttribute("data-value");

    // This prevents the user from entering two decimal points in one number
    if (value === "." && currentNumber.includes(".")) {
      return;
    }

    // Add the clicked number to the current number
    currentNumber += value;

    // Add the clicked number to the full expression
    expression += value;

    // Show the updated expression on the display
    updateDisplay(expression);
  });
});

// This code runs when any operator button is clicked
operatorButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    // Get the operator from the button that was clicked
    const operator = button.getAttribute("data-value");

    // This stops the user from starting with +, *, or /
    // A minus is allowed so negative numbers can be entered
    if (expression === "" && operator !== "-") {
      return;
    }

    // If the last character is already an operator, replace it with the new operator
    if (lastCharacterIsOperator()) {
      expression = expression.slice(0, -1) + operator;
    } else {
      // Otherwise, add the operator normally
      expression += operator;
    }

    // Reset the current number because the user will type a new number next
    currentNumber = "";

    // Show the updated expression on the display
    updateDisplay(expression);
  });
});

// This code runs when the equal button is clicked
equalButton.addEventListener("click", function() {
  try {
    // If there is nothing to calculate, do nothing
    if (expression === "") {
      return;
    }

    // If the expression ends with an operator, show an error
    if (lastCharacterIsOperator()) {
      updateDisplay("Error");
      expression = "";
      currentNumber = "";
      return;
    }

    // This calculates the answer from the expression
    const result = Function('"use strict"; return (' + expression + ')')();

    // This checks for invalid answers, such as dividing by zero
    if (!isFinite(result)) {
      updateDisplay("Error");
      expression = "";
      currentNumber = "";
      return;
    }

    // This rounds long decimal answers to 8 decimal places
    const finalResult = Number(result.toFixed(8));

    // Show the final answer on the calculator display
    updateDisplay(finalResult);

    // Store the answer so the user can continue calculating with it
    expression = finalResult.toString();
    currentNumber = finalResult.toString();

  } catch (error) {
    // If something goes wrong, show Error
    updateDisplay("Error");
    expression = "";
    currentNumber = "";
  }
});

// This code runs when the reset button is clicked
resetButton.addEventListener("click", function() {
  // Clear the full calculation
  expression = "";

  // Clear the current number
  currentNumber = "";

  // Reset the display back to zero
  updateDisplay("0");
});

// This code runs when the delete button is clicked
deleteButton.addEventListener("click", function() {
  // Only delete if there is something on the screen
  if (expression.length > 0) {
    // Save the last character before deleting it
    const removedCharacter = expression.slice(-1);

    // Remove the last character from the expression
    expression = expression.slice(0, -1);

    // If an operator was deleted, rebuild the current number
    if (isOperator(removedCharacter)) {
      const parts = expression.split(/[\+\-\*\/]/);
      currentNumber = parts[parts.length - 1];
    } else {
      // If a number was deleted, remove it from the current number
      currentNumber = currentNumber.slice(0, -1);
    }
  }

  // Show the updated expression after deleting
  updateDisplay(expression);
});