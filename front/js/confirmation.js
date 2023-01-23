const url = new URL(window.location.href);
const orderIdField = document.querySelector('#orderId');

orderIdField.textContent = url.searchParams.get('orderId');
localStorage.clear();
