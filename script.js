document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // ล็อกอินสำเร็จ
            alert('Login successful!');
            // Redirect หรือทำอื่น ๆ ตามต้องการ
        } else {
            // ล็อกอินไม่สำเร็จ
            document.getElementById('errorMessage').innerText = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
