// Variables
let gridSize = 16; // Initial grid size



//References to HTML elements
const gridSizeSlider = document.getElementById('gridSizeSlider');
const gridSizeSlideBar = document.getElementById('gridSizeSlideBar');
const gridSizeSlideDot = document.getElementById('gridSizeSlideDot');
const gridSizeText = document.getElementById('gridSizeText');
const sketchSpace = document.getElementById("sketchBoard");


/*
// Function to generate the grid
function generateGrid(size) {
    // Clear previous grid
    if (!sketchSpace) {
        console.error("Sketch space element not found.");
        return;
    }
    sketchSpace.innerHTML = '';


    // Create grid cells and append them to the sketch board
    for (let i = 0; i < gridSize*gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            sketchSpace.appendChild(cell);
        }
};*/


document.addEventListener('DOMContentLoaded', () => {
    const sketchSpace = document.getElementById("sketchBoard");
    const gridSize = 16;

    // Create the grid
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        sketchSpace.appendChild(cell);
    }
});



    // Log grid size to console
    console.log('Grid size:', gridSize);


// Grindlines toggle button function
    function toggleGridlines() {
        const cells = document.querySelectorAll(".grid-cell");
        cells.forEach(cell => {
        cell.classList.toggle('gridlines');
    });
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

document.addEventListener('DOMContentLoaded', function() {
    // Initial generation of grid with default size (16x16)
    generateGrid(16);
});


