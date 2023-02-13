const cartSection = document.querySelector('#cart__items');

// On ajoute au DOM un <article> contenant les informations du produit
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

// On récupère le contenu du localStorage sous forme de tableau d'objets
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

// On calcule et affiche la quantité totale de produits du panier
function displayTotalQuantity(products) {
    const totalQuantity = products.reduce((acc, curItem) => acc + parseInt(curItem.quantity), 0);
    document.querySelector('#totalQuantity').textContent =  totalQuantity.toString();
}

// On calcule et affiche le prix total
function displayTotalPrice(products) {
    const totalPrice = products.reduce((acc, product) => acc + product.quantity * product.price, 0);
    document.querySelector('#totalPrice').textContent = totalPrice.toString();
}

// On récupère toutes les informations pour chaque produit du panier en requêtant l'API
// On y ajoute la quantité et la couleur choisie
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

// On affiche ctous les produits du panier 
function displayAllProducts(products) {
    products.map(product => {
        const cartItem = createCartItem(product);
        cartSection.appendChild(cartItem);
    });
}

// On execute toutes les opérations nécessaires au bon affichage de la page
async function displayPage() {
    const cart = getCart();
    const products = await getAllProducts(cart);
    displayAllProducts(products)
    displayTotalPrice(products);
    displayTotalQuantity(cart);
    getAllProducts(cart);
}

// On définit une fonction qui affiche le prix et la quantité
// pour mettre uniquement ces informations à jour
async function displayTotalPriceAndQuantity() {
    const products = await getAllProducts(getCart());
    displayTotalQuantity(products);
    displayTotalPrice(products);
}


//On affiche la page et on lance les écouteurs d'événements pour la gestion du contenu du panier

displayPage();

// Si l'utilisateur clique sur le bouton Supprimer
// On supprime un produit du panier et on met à jour le prix et la quantité 
cartSection.addEventListener('click', (event) => {
        const btn = event.target;
        if (btn.classList.contains('deleteItem')) {
            const article = btn.closest('article');
            const name = article.dataset.name;
            const color = article.dataset.color;
            localStorage.removeItem(name + '_' + color);
            console.log(localStorage);
            displayTotalPriceAndQuantity();
            article.remove();
        }
});

// On met à jour l'affichage et le localStorage en fonction des modifications de la quantité d'un produit
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


                  /* Gestion du formulaire */
const form = document.querySelector('.cart__order__form');

const firstNameField = document.querySelector('#firstName');
const lastNameField = document.querySelector('#lastName');
const addressField = document.querySelector('#address');
const cityField = document.querySelector('#city');
const emailField = document.querySelector('#email');

// Validation des champs du formulaire
function validationForm() {
    // Cette regex provient de https://www.w3resource.com/javascript/form/email-validation.php
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailField.value);
    if (!validEmail) document.querySelector('#emailErrorMsg').textContent = 'L\'adresse-mail n\'est pas valide';

    // vérifie que le champ ne contient que des lettres, espaces, tirets
    // et commence et se termine par une lettre.
    const nameRegex = /[a-zA-Z\u00C0-\u017F- ]+$/;
    const validLastName = nameRegex.test(lastNameField.value);
    if (!validLastName) document.querySelector('#lastNameErrorMsg').textContent = 'Le nom n\'est pas valide';
    const validFirstName = nameRegex.test(firstNameField.value);
    if (!validFirstName) document.querySelector('#firstNameErrorMsg').textContent = 'Le prénom n\'est pas valide';

    // vérifie que le champ ne contient que des lettres, espaces, tirets et apostrophes
    // et commence et se termine par une lettre.
    const validCity = /[a-zA-Z\u00C0-\u017F- ']+$/.test(cityField.value);
    if (!validCity) document.querySelector('#cityErrorMsg').textContent = 'La ville n\'est pas valide';

    // vérifie que le champ n'est pas vide
    const validAddress = addressField.value !== '' ? true : false;
    if (!validAddress) document.querySelector('#addressErrorMsg').textContent = 'Le champ adresse est vide';

    return validEmail && validFirstName && validLastName && validCity && validAddress;
}

// Validation de la commande
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        // Si le formulaire est valide, on construit l'objet qui sera envoyé dans le corps de la requête
        if (validationForm()) {
            const contact = {
                firstName: firstNameField.value,
                lastName: lastNameField.value,
                address: addressField.value,
                city: cityField.value,
                email: emailField.value,
            };

            const cart = getCart();
            const productsArr = await getAllProducts(cart);
            const products = productsArr.map(product => product._id);
            const requestBody = {
                contact,
                products,
            };
            
            // On envoie la requête et on récupère la réponse contenant le numéro de commande
            const response = await fetch('http://localhost:3000/api/products/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            window.location.href = `./confirmation.html?orderId=${result.orderId}`;
        } 
    } catch (err) {
       console.error(err);
       alert('La commande n\'est pas passée. Veuillez réessayer');     
    }
});
  