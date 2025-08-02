
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('.login-container form');
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        alert('Form submitted (client-side mock)');

        window.location.href = '/dashboard'; 
      });
    });
