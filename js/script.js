// Audio setup
const hoverSound = document.getElementById('hover-sound');
hoverSound.volume = 0.85;

// Function to play sound
function playHoverSound() {
    if (hoverSound.paused) {
        hoverSound.currentTime = 0;
        hoverSound.play();
    }
}

// Function to handle animations and interactions
function setupButtonAnimation(element) {
    if (!element) {
        console.log('Element not found!');
        return;
    }
    
    element.addEventListener('mouseenter', playHoverSound);
    
    element.addEventListener('mousedown', () => {
        element.classList.add('shrink');
    });
    
    ['mouseup', 'mouseleave'].forEach(event => {
        element.addEventListener(event, () => {
            element.classList.remove('shrink');
        });
    });
}

// Function to handle trait selection
function onTraitSelected(layer, value) {
    const layerElement = document.getElementById(layer);
    const background = document.getElementById('background');
    
    // If this is the first trait selection and background shows default preview, clear it
    if (background && background.src.includes('Default_Preview.png')) {
        background.src = '';
        background.style.visibility = 'hidden'; // Hide the element completely
        background.alt = ''; // Remove alt text
    }
    
    // Handle background selections
    if (layer === 'background') {
        if (value === "none") {
            background.src = "";
            background.style.visibility = 'hidden';
            background.alt = '';
        } else {
            background.src = value;
            background.style.visibility = 'visible';
            background.alt = 'Background';
        }
        return;
    }
    
    // Handle other traits
    if (layerElement) {
        if (value === "none") {
            layerElement.src = "";
            layerElement.style.visibility = 'hidden';
            layerElement.alt = '';
        } else {
            layerElement.src = value;
            layerElement.style.visibility = 'visible';
        }
    }
    
    // Track the trait selection
    gtag('event', 'trait_selected', {
        'event_category': 'customization',
        'event_label': `${layer}_${value}`
    });
}

// Function to handle character randomization
function randomizeCharacter() {
    const layers = ['background', 'body', 'clothing', 'mouth', 'hat', 'eyes'];
    
    layers.forEach(layer => {
        const options = document.querySelectorAll(`.trait-option[data-layer="${layer}"]`);
        if (options.length > 0) {
            // Filter out the "none" option for background layer
            let validOptions = Array.from(options);
            if (layer === 'background') {
                validOptions = validOptions.filter(option => option.getAttribute('data-value') !== 'none');
            }
            
            // Only proceed if we have valid options
            if (validOptions.length > 0) {
                const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
                const value = randomOption.getAttribute('data-value');
                
                // Add error handling for image loading
                const tempImg = new Image();
                tempImg.onload = () => {
                    onTraitSelected(layer, value);
                };
                tempImg.onerror = () => {
                    console.log(`Failed to load image for ${layer}, retrying...`);
                    // If image fails to load, try another random option
                    randomizeCharacter();
                };
                tempImg.src = value;
            }
        }
    });
}

// Function to export character
function exportCharacter() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 2048;
    canvas.height = 2048;

    const layers = ["background", "body", "clothing", "hat", "mouth", "eyes"];
    
    layers.forEach(layerId => {
        const img = document.getElementById(layerId);
        if (img && img.src) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    });

    canvas.toBlob(blob => {
        const link = document.createElement("a");
        link.download = "SupDucks_Creation.png";
        link.href = URL.createObjectURL(blob);
        link.click();
    }, "image/png");
}

// Add debouncing to the randomize button to prevent rapid clicking
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Instead, add this function to handle responsive layout adjustments if needed
function handleResponsiveLayout() {
    const isMobile = window.innerWidth <= 1024;
    // Add any specific JavaScript handling for mobile if needed
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup animations for all interactive elements
    const elements = [
        ...document.querySelectorAll('.tab-button'),
        ...document.querySelectorAll('.trait-option'),
        document.getElementById('randomize'),
        document.getElementById('export')
    ];
    
    elements.forEach(element => {
        if (element) setupButtonAnimation(element);
    });

    // Setup tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabId)?.classList.add('active');
        });
    });

    // Setup trait selection
    document.querySelectorAll('.trait-option').forEach(option => {
        option.addEventListener('click', () => {
            const layer = option.getAttribute('data-layer');
            const value = option.getAttribute('data-value');
            onTraitSelected(layer, value);
        });
    });

    // Setup randomize button with debouncing
    const randomizeBtn = document.getElementById('randomize');
    if (randomizeBtn) {
        const debouncedRandomize = debounce(randomizeCharacter, 100);
        randomizeBtn.addEventListener('click', debouncedRandomize);
    }

    // Setup export button
    document.getElementById('export')?.addEventListener('click', exportCharacter);

    // Initial screen size check
    checkScreenSize();
});

// Handle window resize
window.addEventListener('resize', handleResponsiveLayout);
window.addEventListener('resize', handleResponsiveLayout);

// Example of tracking an event when a user exports their character
document.getElementById('export')?.addEventListener('click', () => {
    gtag('event', 'character_export', {
        'event_category': 'engagement',
        'event_label': 'character_created'
    });
});

function updateCharacterLayer(layer, value) {
    const layerElement = document.getElementById(layer);
    if (!layerElement) return;

    if (value === "none") {
        // For background, use a transparent background
        if (layer === "background") {
            layerElement.src = "Assets/Design_Elements/None.png";
            layerElement.style.opacity = "0"; // Make it invisible
        } else {
            // For other layers (like clothing), just hide the layer
            layerElement.style.display = "none";
        }
    } else {
        // Show the layer with the selected trait
        layerElement.style.display = "block";
        layerElement.style.opacity = "1";
        layerElement.src = value;
    }
}