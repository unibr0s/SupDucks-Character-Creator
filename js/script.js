// List of layers
const layers = ['background', 'body', 'clothing', 'hat', 'mouth', 'eyes'];

// Update layer image when dropdown changes
layers.forEach(layer => {
    const select = document.getElementById(`${layer}-select`);
    if (select) {
        select.addEventListener('change', event => {
            const img = document.getElementById(layer);
            if (img) {
                if (event.target.value && event.target.value !== "") {
                    img.setAttribute("src", event.target.value); // Dynamically add the src attribute
                } else {
                    img.removeAttribute("src"); // Remove src to prevent broken image
                }
            }
        });
    }
});


// Randomize the character traits
document.getElementById('randomize').addEventListener('click', () => {
    // List of trait layers
    const layers = ['background', 'body', 'clothing', 'mouth', 'hat', 'eyes'];

    layers.forEach(layer => {
        // Find all options for the current layer
        const options = document.querySelectorAll(`.trait-option[data-layer="${layer}"]`);
        if (options.length > 0) {
            // Randomly select one of the options
            const randomOption = options[Math.floor(Math.random() * options.length)];
            const value = randomOption.getAttribute('data-value');
            const img = document.getElementById(layer); // Get the corresponding preview image

            // Update the preview image
            if (img && value) {
                img.src = value; // Set the image source
            }
        }
    });
});

// Tab switching logic
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

        // Add active class to the clicked tab and corresponding panel
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Trait selection logic
document.querySelectorAll('.trait-option').forEach(option => {
    option.addEventListener('click', () => {
        const layer = option.getAttribute('data-layer'); // Get the layer (e.g., background, body)
        const value = option.getAttribute('data-value'); // Get the image path
        const img = document.getElementById(layer); // Find the corresponding preview image

        if (img) {
            img.src = value; // Update the preview image
        }
    });
});

document.querySelectorAll('.trait-option').forEach(option => {
    option.addEventListener('click', () => {
        const layer = option.getAttribute('data-layer'); // Get the layer (e.g., clothing)
        const value = option.getAttribute('data-value'); // Get the image path
        const img = document.getElementById(layer); // Find the corresponding preview image

        if (img) {
            if (value) {
                img.src = value; // Update the preview image
            } else {
                img.removeAttribute('src'); // Clear the image if "None" is selected
            }
        }
    });
});

// Function to handle trait selection
function onTraitSelected(layer, value) {
    // Set the selected trait image to the appropriate layer
    const layerElement = document.getElementById(layer);
    if (layerElement) {
        layerElement.src = value; // Update the image layer source
    }

    // Remove the default background image (only the first time a trait is selected)
    const defaultBackground = document.getElementById("background");
    if (defaultBackground && defaultBackground.src.includes("Default_Preview.png")) {
        defaultBackground.removeAttribute("src"); // Remove the default background image
    }
}

// Add event listeners for all trait options
document.querySelectorAll(".trait-option").forEach(option => {
    option.addEventListener("click", function () {
        const layer = this.getAttribute("data-layer");
        const value = this.getAttribute("data-value");
        onTraitSelected(layer, value);
    });
});

document.getElementById("export").addEventListener("click", function () {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set the canvas size to match the original resolution
    canvas.width = 2048;
    canvas.height = 2048;

    // Array of layer IDs in proper drawing order
    const layers = ["background", "body", "clothing", "hat", "mouth", "eyes"];

    // Draw each layer onto the canvas
    const drawLayers = () => {
        layers.forEach((layerId) => {
            const img = document.getElementById(layerId);
            if (img && img.src) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        });
    };

    // Draw the layers and then export
    drawLayers();

    // Export the canvas to an image
    canvas.toBlob(function (blob) {
        const link = document.createElement("a");
        link.download = "SupDucks_Creation.png";
        link.href = URL.createObjectURL(blob);
        link.click();
    }, "image/png");
});

document.querySelectorAll('.trait-option').forEach(option => {
    option.addEventListener('click', function () {
        const layer = this.getAttribute('data-layer'); // e.g., "clothing"
        const value = this.getAttribute('data-value'); // e.g., "none"

        const targetLayer = document.getElementById(layer); // Get the layer (e.g., #clothing)

        if (value === "none") {
            // Hide the clothing layer for "None" option
            targetLayer.src = ""; // Clear the image source
            targetLayer.style.visibility = "hidden"; // Hide the layer
        } else {
            // Show and update the clothing layer for other options
            targetLayer.src = value; // Set the image source
            targetLayer.style.visibility = "visible"; // Show the layer
        }
    });
});