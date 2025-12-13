document.getElementById('sendBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('promptInput').value;
    const responseDiv = document.getElementById('response');

    if (!prompt.trim()) {
        alert('Please enter a prompt');
        return;
    }

    responseDiv.textContent = 'Loading...';

    try {
        const res = await fetch('http://localhost:3000/api/ai-model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.statusText}`);
        }

        const data = await res.json();
        responseDiv.textContent = data.response;
    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'Error fetching response: ' + error.message;
    }
});
