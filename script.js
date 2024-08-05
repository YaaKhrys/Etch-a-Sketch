// Global variables
let gridSize = 16; // Initial grid size
let isDrawing = false;
let history = [];
let redoStack = [];
let currentStep = -1;



//References to HTML elements
const gridSizeSlider = document.getElementById('gridSizeSlider');
const gridSizeSlideBar = document.getElementById('gridSizeSlideBar');
const gridSizeSlideDot = document.getElementById('gridSizeSlideDot');
const gridSizeText = document.getElementById('gridSizeText');
const sketchSpace = document.getElementById("sketchBoard");


// Initialize the grid and control icons when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const sketchSpace = document.getElementById("sketchBoard");
    const gridSize = 16;

    // Create the grid cells
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        sketchSpace.appendChild(cell);
    

    // Event listener for starting the drawing when the mouse is pressed down
    cell.addEventListener('mousedown', () => {
        isDrawing = true;
        cell.style.backgroundColor = 'black'; // Change to desired color
        saveState();
    });


     // Event listener for drawing when the mouse moves over a cell while pressed down
    cell.addEventListener('mouseover', () => {
        if (isDrawing) {
            cell.style.backgroundColor = 'black'; // Change to desired color
        }
    });


    // Event listener to stop drawing when the mouse is released
    cell.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    // Ensure drawing stops when the mouse leaves the grid container
    sketchSpace.addEventListener('mouseleave', () => {
        isDrawing = false;
    });
    }

    // Ensure drawing stops when mouse is released anywhere on the page
    document.addEventListener('mouseup', () => {
    isDrawing = false;


    // sketchToolBar icons controls (reset, undo, redo)
    sketchToolBar();
    saveState(); // Save the initial empty state
    });
});


// Log grid size to console
    console.log('Grid size:', gridSize);




// Grindlines toggle button function
    function toggleGridlines() {
        const cells = document.querySelectorAll(".grid-cell");
        cells.forEach(cell => {
        cell.classList.toggle('gridlines');
    });

    console.log('Gridlines toggled');
}


// Save the current state of the grid
function saveState() {
    const gridState = [];
    document.querySelectorAll('.grid-cell').forEach(cell => {
        gridState.push(cell.style.backgroundColor);
    });
    history = history.slice(0, currentStep + 1); // Remove any redo states
    history.push(gridState); // Add current state to history
    currentStep++;
    console.log('State saved:', history);
}

// Restore the grid to a given state
function restoreState(state) {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach((cell, index) => {
        cell.style.backgroundColor = state[index];  // Restore each cell's color
    });

    console.log('State restored:', state);
}


// Setup event listeners for sketchToolBar icons (reset, undo, redo)
function sketchToolBar() {
    document.querySelector("#reset").addEventListener('click', resetGrid);
    document.querySelector("#undo").addEventListener('click', undoAction);
    document.querySelector("#redo").addEventListener('click', redoAction);

    if (reset) {
        reset.addEventListener('click', resetGrid);  // Reset grid when reset icon is clicked
    } else {
        console.error('Reset icon not found');
    }

    if (undo) {
        undo.addEventListener('click', undoAction);  // Undo last action when undo icon is clicked
    } else {
        console.error('Undo icon not found');
    }

    if (redo) {
        redo.addEventListener('click', redoAction);  // Redo last undone action when redo icon is clicked
    } else {
        console.error('Redo icon not found');
    }
}


// Reset the grid to its initial empty state
function resetGrid() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.backgroundColor = '';  // Clear each cell's color
    });
    history = [];
    redoStack = [];
    currentStep = -1;
    saveState(); // Save the reset state
    console.log('Grid reset');
}


// Undo the last action by reverting to the previous state
function undoAction() {
    if (currentStep > 0) {
        redoStack.push(history[currentStep]);   // Save the current state to the redo stack
        currentStep--;
        restoreState(history[currentStep]);  // Restore the previous state
        console.log('Undo action performed:', history, 'Current step:', currentStep);
    } else {
        console.log('Nothing to undo');
    }
}

// Redo the last undone action
function redoAction() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();  // Get the last state from the redo stack
        history.push(nextState);  // Add the state to history
        currentStep = history.length - 1;  // Update the current step to the last index of history
        restoreState(nextState);  // Restore the state
        console.log('Redo action performed:', history, 'Current step:', currentStep);
    } else {
        console.log('Nothing to redo');
    }
}


// Event listener for grid size slider input
gridSizeSlideBar.addEventListener('input', function() {
    // Get the selected grid size from the slider value
    const size = parseInt(this.value);

    // Update displayed text with selected grid size
    gridSizeText.textContent = `${size}x${size}`;

    // Generate grid with the selected size
    generateGrid(size);
});

