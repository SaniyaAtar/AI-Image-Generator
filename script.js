// Variables
const promptBar = document.querySelector("#prompt_bar");
const imageResult = document.querySelector("#image_result");
let isImgGen = false;

// Replace with your actual Hugging Face API key
const huggingFaceAPIKey = "YOUR_API_KEY"; 

// Function to update image boxes with generated images
const updateImgBoxes = (imgBoxArray) => {
    imgBoxArray.forEach((imgObject) => {
        const imgBox = document.createElement("div");
        imgBox.className = "img_box";
        imgBox.innerHTML = `
            <img src="${imgObject.url}" alt="Generated Image">
            <a href="${imgObject.url}" class="download-btn" download="Cosas_Learning_${Date.now()}.jpg">
                <i class="fa-solid fa-download"></i>
            </a>
        `;
        imageResult.appendChild(imgBox);
    });
};

// Function to generate AI images
const generateAIImages = async (userPrompt) => {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${huggingFaceAPIKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: userPrompt }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            throw new Error("Failed to generate AI Images! Please check your request.");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        updateImgBoxes([{ url }]);

    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
        imageResult.style.display = "none";
    } finally {
        isImgGen = false;
    }
};

// Function to handle the form submission
const handlePrompt = (e) => {
    e.preventDefault();
    if (isImgGen) return;
    isImgGen = true;

    imageResult.innerHTML = "";
    imageResult.style.display = "flex";

    const userPrompt = e.target[0].value;

    // Create loading placeholders for images
    const loadingBoxes = `
        <div class="img_box loading">
            <img src="images/loader.gif" alt="Loading...">
        </div>
    `;
    imageResult.innerHTML = loadingBoxes;
    generateAIImages(userPrompt);
};

// Add event listener for form submission
promptBar.addEventListener("submit", handlePrompt);
