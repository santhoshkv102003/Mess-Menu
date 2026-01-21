
async function verifyBackend() {
    try {
        console.log('Testing Backend Connectivity...');
        // 1. Health Check
        try {
            const response = await fetch('http://localhost:5000/api/health');
            const data = await response.json();
            console.log('Health Check:', data);
        } catch (error) {
            console.error('Health Check Failed:', error.message);
        }

        // 2. Login Check (Invalid Credentials)
        console.log('\nTesting Login Endpoint (Invalid Creds)...');
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                })
            });

            console.log(`Login Response Status: ${response.status}`);

            if (response.status !== 500) {
                // Try to parse JSON if not 500 (or even if 500, but handle error)
                try {
                    const data = await response.json();
                    console.log('Response Data:', data);
                } catch (e) {
                    console.log('Response text:', await response.text());
                }
            } else {
                console.error('CRITICAL: 500 Internal Server Error detected!');
                const text = await response.text();
                console.log('Error Body:', text);
            }

        } catch (error) {
            console.error('Login Request Failed:', error.message);
        }

    } catch (err) {
        console.error('Verification Script Error:', err);
    }
}

verifyBackend();
