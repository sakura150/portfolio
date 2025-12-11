document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleRegister(e) {
  e.preventDefault();
  const formData = {
    username: e.target.username.value,
    email: e.target.email.value,
    password: e.target.password.value
  };
  
  try {
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    console.log('Registration success:', data);
    window.location.href = '/ind.html'; 
    
  } catch (err) {
    console.error('Registration error:', err);
    document.getElementById('error').textContent = err.message;
  }
}
async function handleLogin(e) {
  e.preventDefault();
  const formData = {
    email: e.target.email.value,
    password: e.target.password.value
  };
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    localStorage.setItem('token', data.token);
    window.location.href = '/ind.html';
  } catch (err) {
    document.getElementById('error').textContent = err.message;
  }
}