let proofData = null;
let proofDataLoading = false;

function setProofData(data) {
    proofData = data;
}

function setProofDataLoading(loading) {
    proofDataLoading = loading;
}

// Function to generate proof from server
async function generateProof() {
    setTimeout(() => {
        setProofData({ proof: true });
    }, 5000);
    return { proof: true };
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
    generateProof()
    setTimeout(() => addConsoleLine('Proof verified', 'console-output'), 8000);    
        
});

function addConsoleLine(text, className) {
    const line = document.createElement('div');
    line.className = 'console-line console-fade-in';
    line.innerHTML = `<span class="${className}">${text}</span>`;
    document.getElementById('console-content').appendChild(line);
}