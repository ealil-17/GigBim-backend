document.getElementById('sendBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('promptInput').value;
    const responseDiv = document.getElementById('response');

    if (!prompt.trim()) {
        alert('Please enter a prompt');
        return;
    }

    responseDiv.textContent = 'Loading...';

    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert('You must be logged in to use this feature.');
        // Optional: Redirect to login page
        // window.location.href = '/login.html'; 
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/ai-model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ prompt })
        });

        if (!res.ok) {
            const errorText = await res.json();
            throw new Error(errorText.message || `Server error: ${res.statusText}`);
        }

        const data = await res.json();
        responseDiv.textContent = data.response;
    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'Error: ' + error.message;
    }
});
