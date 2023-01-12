const cartSection = document.querySelector('#cart__items');


function createCartItem(product) {
    // Création des éléments HTML
    const article = document.createElement('article');
    const imgDiv = document.createElement('div');
    const img = document.createElement('img');
    const contentDiv = document.createElement('div');
    const descriptionDiv = document.createElement('div');
    const h2 = document.createElement('h2');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const settingsDiv = document.createElement('div');
    const quantityDiv = document.createElement('div');
    const quantityP = document.createElement('p');
    const quantityInput = document.createElement('input');
    const deleteDiv = document.createElement('div');
    const deleteButton = document.createElement('button');
  
    // Ajout des classes CSS
    article.classList.add('cart__item');
    imgDiv.classList.add('cart__item__img');
    contentDiv.classList.add('cart__item__content');
    descriptionDiv.classList.add('cart__item__content__description');
    settingsDiv.classList.add('cart__item__content__settings');
    quantityDiv.classList.add('cart__item__content__settings__quantity');
    deleteDiv.classList.add('cart__item__content__settings__delete');
    deleteButton.classList.add('deleteItem');
  
    // Ajout des attributs data
    article.setAttribute('data-id', product._id);
    article.setAttribute('data-color', product.chosenColor);
    article.setAttribute('data-name', product.name);
    article.setAttribute('data-quantity', product.quantity);
  
    // Ajout des valeurs
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt);
    h2.textContent = product.name;
    p1.textContent = product.chosenColor;
    p2.textContent = `${product.price} €`;
    quantityP.textContent = `Qté : ${product.quantity}`;
    quantityInput.setAttribute('type', 'number');
    quantityInput.setAttribute('class', 'itemQuantity');
    quantityInput.setAttribute('name', 'itemQuantity');
    quantityInput.setAttribute('min', '1');
    quantityInput.setAttribute('max', '100');
    quantityInput.setAttribute('value', product.quantity);
    deleteButton.textContent = 'Supprimer';
  
    // Construction de l'arbre des éléments
    imgDiv.appendChild(img);
    descriptionDiv.appendChild(h2);
    descriptionDiv.appendChild(p1);
    descriptionDiv.appendChild(p2);
    quantityDiv.appendChild(quantityP);
    quantityDiv.appendChild(quantityInput);
    deleteDiv.appendChild(deleteButton);
    settingsDiv.appendChild(quantityDiv);
    settingsDiv.appendChild(deleteDiv);
    contentDiv.appendChild(descriptionDiv);
    contentDiv.appendChild(settingsDiv);
    article.appendChild(imgDiv);
    article.appendChild(contentDiv);

    return article;
}

function getCart() {
    const cart = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const obj = JSON.parse(value);
        cart.push(obj);
    }
    return cart;
}

function displayTotalQuantity(products) {
    const totalQuantity = products.reduce((acc, curItem) => acc + parseInt(curItem.quantity), 0);
    document.querySelector('#totalQuantity').textContent =  totalQuantity.toString();
}

function displayTotalPrice(products) {
    const totalPrice = products.reduce((acc, product) => acc + product.quantity * product.price, 0);
    document.querySelector('#totalPrice').textContent = totalPrice.toString();
}

async function getAllProducts(cart) {
    try {
        const products = await Promise.all(
            cart.map(async item => {
            const response = await fetch(`http://localhost:3000/api/products/` + `${item.id}`);
            const product = await response.json();
            product.quantity = item.quantity;
            product.chosenColor = item.color;
            return product;
            })
        );
        return products;
    } catch(e) {
        console.error(e);
    }
}

function displayAllProducts(products) {
    products.map(product => {
        const cartItem = createCartItem(product);
        cartSection.appendChild(cartItem);
    });
}

async function displayPage() {
    const cart = getCart();
    const products = await getAllProducts(cart);
    displayAllProducts(products)
    displayTotalPrice(products);
    displayTotalQuantity(cart);
    getAllProducts(cart);
}

async function displayTotalPriceAndQuantity() {
    const products = await getAllProducts(getCart());
    displayTotalQuantity(products);
    displayTotalPrice(products);
}


//On affiche la page et on lance les écouteurs d'événements

displayPage();

cartSection.addEventListener('click', (event) => {
        const btn = event.target;
        if (btn.classList.contains('deleteItem')) {
            const article = btn.closest('article');
            const name = article.dataset.name;
            console.log(name);
            localStorage.removeItem(name);
            displayTotalPriceAndQuantity();
            article.remove();
        }
});

cartSection.addEventListener('change', (event) => {
    const input = event.target;
    if (input.classList.contains('itemQuantity')) {
        const article = input.closest('article');
        document.querySelector('.cart__item__content__settings__quantity p').textContent = `Qté : ${input.value}`;
        const name = article.dataset.name;
        localStorage.removeItem(name);
        const obj = {
            id: article.dataset.id,
            color: article.dataset.color,
            quantity: input.value
        };
        const objStr = JSON.stringify(obj);
        localStorage.setItem(name, objStr);
        displayTotalPriceAndQuantity();
    }
});


// Gestion du formulaire

const form = document.querySelector('.cart__order__form');

const firstNameField = document.querySelector('#firstName');
const lastNameField = document.querySelector('#lastName');
const addressField = document.querySelector('#address');
const cityField = document.querySelector('#city');
const emailField = document.querySelector('#email');

function FormIsInvalid() {
    
}

form.addEventListener('submit', )










  