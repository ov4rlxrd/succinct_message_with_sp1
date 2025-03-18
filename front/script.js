let proofData = null;
let proofDataLoading = false;

function setProofData(data) {
    proofData = data;
}

function setProofDataLoading(loading) {
    proofDataLoading = loading;
}

// Function to generate proof from server
async function generateProof(letter) {
    setProofDataLoading(true);
    
    if (!letter) {
        console.error("Text is missing. Cannot generate proof.");
        setProofDataLoading(false);
        throw new Error("Text is missing");
    }
    
    const data = { text: letter };
    console.log("Data being sent:", data);
    
    const response = await fetch("http://localhost:3000/score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Proof generated successfully:", result);
    
    setProofDataLoading(false);
    setProofData(result);
    return result;
}

document.getElementById('send-button').addEventListener('click', function() {
    const letter = document.getElementById('letter').value.trim();
    
    if (!letter) {
        alert('Please write a message before sending.');
        return;
    }
    
    // Renamed from 'console' to 'consoleEl' to avoid name conflict
    const consoleEl = document.getElementById('console');
    const consoleContent = document.getElementById('console-content');
    
    // Clear and display console
    consoleEl.style.display = 'block';
    consoleContent.innerHTML = '';
    
    setTimeout(() => {
        consoleEl.classList.add('console-visible');
    }, 50);

    // Initial console animation
    setTimeout(() => addConsoleLine('> Initializing verification process...', 'console-prompt'), 300);
    setTimeout(() => addConsoleLine('Processing input...', 'console-output'), 1000);
    setTimeout(() => addConsoleLine('> Checking integrity...', 'console-prompt'), 1800);
    setTimeout(() => addConsoleLine('Integrity check passed', 'console-output'), 2500);
    setTimeout(() => addConsoleLine('> Verifying message contents...', 'console-prompt'), 3200);
    setTimeout(() => addConsoleLine('Content analysis complete', 'console-output'), 4000);
    setTimeout(() => addConsoleLine('> Finalizing...', 'console-prompt'), 4700);
    
    // Now call the server and handle the response
    generateProof(letter)
        .then(result => {
            // Show success message after receiving result
            setTimeout(() => {
                if (result && result.proof) {
                    addConsoleLine('Proof verified', 'console-output');
                } else {
                    addConsoleLine('Proof verification failed', 'console-output');
                }
            }, 1000);
        })
        .catch(error => {
            console.error("Failed to generate proof:", error);
            
            // Show error in console
            setTimeout(() => {
                addConsoleLine(`Error: ${error.message}`, 'console-output error-output');
            }, 1000);
            
            // Also show an alert
            alert("Failed to generate proof. Please try again. Error: " + error.message);
        });
});

function addConsoleLine(text, className) {
    const line = document.createElement('div');
    line.className = 'console-line console-fade-in';
    line.innerHTML = `<span class="${className}">${text}</span>`;
    document.getElementById('console-content').appendChild(line);
}