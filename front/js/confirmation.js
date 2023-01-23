const url = new URL(window.location.href);
const orderIdField = document.querySelector('#orderId');

// On affiche le numéro de commande et on vide le panier
orderIdField.textContent = url.searchParams.get('orderId');
localStorage.clear();
