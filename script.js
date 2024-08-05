//Canvas Image Approach
//Requires commenting out the div sketchSpace line and uncommenting the canvas sketchSpace html line


// Initialize the grid and control icons when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {

// References to HTML elements
const sketchSpace = document.getElementById("sketchBoard");
const gridSizeSlideBar = document.getElementById("gridSizeSlideBar");
const gridSizeText = document.getElementById("gridSizeText");
const gridlinesToggle = document.getElementById("gridlines-toggle");
const resetIcon = document.getElementById("reset");
const undoIcon = document.getElementById("undo");
const redoIcon = document.getElementById("redo");

const ctx = sketchSpace.getContext('2d', { willReadFrequently: true });
let isDrawing = false;
let cellSize = 0;
let gridSize = 16;
let history = [];
let redoStack = [];
let currentStep = -1;


// Save the current state of the grid
function saveState() {
    const imageData = ctx.getImageData(0, 0, sketchSpace.width, sketchSpace.height);
    history = history.slice(0, currentStep + 1); // Remove any redo states
    history.push(imageData); // Add current state to history
    currentStep++;
    console.log('State saved:', history);
}

// Restore the grid to a given state
function restoreState(state) {
    ctx.putImageData(state, 0, 0);
    console.log('State restored:', state);
}

// Toggle gridlines visibility
function toggleGridlines() {
    drawGrid();
}

// Undo the last action by reverting to the previous state
function undoAction() {
    if (currentStep > 0) {
        redoStack.push(history[currentStep]); // Save the current state to the redo stack
        currentStep--;
        restoreState(history[currentStep]); // Restore the previous state
        console.log('Undo action performed:', history, 'Current step:', currentStep);
    } else {
        console.log('Nothing to undo');
    }
}

// Redo the last undone action by restoring the next state
function redoAction() {
    if (redoStack.length > 0) {
        const stateToRedo = redoStack.pop(); // Get the last undone state
        history = history.slice(0, currentStep + 1); // Remove any future states
        history.push(stateToRedo); // Add the state to the history
        currentStep++;
        restoreState(stateToRedo); // Restore the state
        console.log('Redo action performed:', history, 'Current step:', currentStep);
    } else {
        console.log('Nothing to redo');
    }
}

// Reset the grid to its initial empty state
function resetGrid() {
    ctx.clearRect(0, 0, 
        sketchSpace.width, 
        sketchSpace.height);
    history = [];
    redoStack = [];
    currentStep = -1;
    toggleGridlines.checked = false;  // Uncheck the gridline toggle
    createGrid();  // Redraw the grid without gridlines
    saveState(); // Save the reset state
    console.log('Grid reset');
}

// Setup control icons (reset, undo, redo)
function setupControlIcons() {
    document.getElementById('reset').addEventListener('click', resetGrid);
    document.getElementById('undo').addEventListener('click', undoAction);
    document.getElementById('redo').addEventListener('click', redoAction);
}



function initialize() {
    setupControlIcons();
    gridSizeSlideBar.addEventListener('input', () => {
        gridSize = parseInt(gridSizeSlideBar.value);
        gridSizeText.textContent = `${gridSize}x${gridSize}`;
        createGrid();
        saveState(); // Save the initial empty state after grid size change
    });

    gridlinesToggle.addEventListener('change', toggleGridlines);

    sketchSpace.addEventListener('mousedown', (e) => {
        isDrawing = true;
        draw(e);
        saveState();
    });

    
    sketchSpace.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            draw(e);
        }
    });

    
    sketchSpace.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    
    sketchSpace.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    createGrid();
    saveState();
}

function createGrid() {
    
    sketchSpace.width = 
    sketchSpace.clientWidth;
    
    sketchSpace.height = 
    sketchSpace.clientHeight;
    cellSize = 
    sketchSpace.width / gridSize;
    ctx.clearRect(0, 0, 
        sketchSpace.width, 
        sketchSpace.height);
    drawGrid();
}

function drawGrid() {
    ctx.clearRect(0, 0, 
        sketchSpace.width, 
        sketchSpace.height);
    if (gridlinesToggle.checked) {
        ctx.strokeStyle = '#e0e0e0';
        for (let i = 0; i <= gridSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, 
                sketchSpace.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(
                sketchSpace.width, i * cellSize);
            ctx.stroke();
        }
    }
}

function draw(e) {
    const rect = 
    sketchSpace.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize) * cellSize;
    const y = Math.floor((e.clientY - rect.top) / cellSize) * cellSize;
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, cellSize, cellSize);
}

initialize();

// Make functions globally accessible
window.undoAction = undoAction;
window.redoAction = redoAction;
window.resetGrid = resetGrid;

});



//DOM-based Approach - Old very Slow
//Requires commenting out the canvas sketchSpace html line and uncommenting the div sketchSpace line 
/*
document.addEventListener('DOMContentLoaded', () => {
    // References to HTML elements
    const sketchSpace = document.getElementById('sketchBoard');
    const gridSizeSlideBar = document.getElementById('gridSizeSlideBar');
    const gridSizeText = document.getElementById('gridSizeText');
    const gridlinesToggle = document.getElementById('gridlines-toggle');

    let isDrawing = false;
    let history = [];
    let redoStack = [];
    let currentStep = -1;

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

    // Debounce function to limit the rate at which a function can fire.
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Debounce saveState to improve performance
    const debounceSaveState = debounce(saveState, 300);

    // Restore the grid to a given state
    function restoreState(state) {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach((cell, index) => {
            cell.style.backgroundColor = state[index]; // Restore each cell's color
        });
        console.log('State restored:', state);
    }

    // Toggle gridlines visibility
    function toggleGridlines() {
        document.querySelectorAll('.grid-cell').forEach(cell => {
            if (gridlinesToggle.checked) {
                cell.classList.add('gridlines');
            } else {
                cell.classList.remove('gridlines');
            }
        });
        console.log('Gridlines toggled');
    }

    // Undo the last action by reverting to the previous state
    function undoAction() {
        if (currentStep > 0) {
            redoStack.push(history[currentStep]); // Save the current state to the redo stack
            currentStep--;
            restoreState(history[currentStep]); // Restore the previous state
            console.log('Undo action performed:', history, 'Current step:', currentStep);
        } else {
            console.log('Nothing to undo');
        }
    }

    // Redo the last undone action by restoring the next state
    function redoAction() {
        if (redoStack.length > 0) {
            const stateToRedo = redoStack.pop(); // Get the last undone state
            history = history.slice(0, currentStep + 1); // Remove any future states
            history.push(stateToRedo); // Add the state to the history
            currentStep++;
            restoreState(stateToRedo); // Restore the state
            console.log('Redo action performed:', history, 'Current step:', currentStep);
        } else {
            console.log('Nothing to redo');
        }
    }

    // Reset the grid to its initial empty state
    function resetGrid() {
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.style.backgroundColor = ''; // Clear each cell's color
        });
        history = [];
        redoStack = [];
        currentStep = -1;
        saveState(); // Save the reset state
        console.log('Grid reset');
    }

    // Setup control icons (reset, undo, redo)
    function setupControlIcons() {
        const resetIcon = document.querySelector('.reset-icon');
        const undoIcon = document.querySelector('.undo-icon');
        const redoIcon = document.querySelector('.redo-icon');

        if (resetIcon) {
            resetIcon.addEventListener('click', resetGrid); // Reset grid when reset icon is clicked
        } else {
            console.error('Reset icon not found');
        }

        if (undoIcon) {
            undoIcon.addEventListener('click', undoAction); // Undo last action when undo icon is clicked
        } else {
            console.error('Undo icon not found');
        }

        if (redoIcon) {
            redoIcon.addEventListener('click', redoAction); // Redo last undone action when redo icon is clicked
        } else {
            console.error('Redo icon not found');
        }
    }

    // Initialize the grid with default size
    function initialize() {
        createGrid(16);
        setupControlIcons();
        gridSizeSlideBar.addEventListener('input', () => {
            const newSize = parseInt(gridSizeSlideBar.value);
            gridSizeText.textContent = `${newSize}x${newSize}`;
            createGrid(newSize);
            saveState(); // Save the initial empty state after grid size change
        });

        gridlinesToggle.addEventListener('change', toggleGridlines);
    }

    function createGrid(size) {
        gridContainer.innerHTML = ''; // Clear existing grid
        gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        const cellSize = Math.min(gridContainer.clientWidth / size, gridContainer.clientHeight / size);

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            gridContainer.appendChild(cell);

            // Event listener for drawing functionality
            cell.addEventListener('mousedown', () => {
                isDrawing = true;
                cell.style.backgroundColor = 'black';
                debounceSaveState();
            });

            cell.addEventListener('mouseover', () => {
                if (isDrawing) {
                    cell.style.backgroundColor = 'black';
                }
            });

            cell.addEventListener('mouseup', () => {
                isDrawing = false;
            });

            gridContainer.addEventListener('mouseleave', () => {
                isDrawing = false;
            });
        }

        document.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        // Apply gridlines if the toggle is on
        if (gridlinesToggle.checked) {
            toggleGridlines();
        }
    }

    initialize();
});*/
