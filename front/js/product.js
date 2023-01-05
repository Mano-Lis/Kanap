const url = new URL(window.location.href);
/*
function checkIfParamExists(paramName) {
    const searchParams = new URLSearchParams(url.search); 
    if (!searchParams.has(paramName)) console.error(`La propriété ${paramName} du produit n'est pas renseignée`);
}
*/
function displayProductImage(product) {
    const html = `<img src="${product.imageUrl}" alt="${product.altText}">`;
    document.querySelector('.item__img').insertAdjacentHTML('beforeend', html);
}

function displayPrice(product) {
    document.querySelector('#price').textContent = product.price;
}

function displayDescription(product) {
    document.querySelector('#description').textContent = product.description;
}

function setColorsOption(product) {
    product.colors.forEach(function(color) {
        const html = `<option value="${color}">${color}</option>`;
        document.querySelector('#colors').insertAdjacentHTML('beforeend', html);
    })
}

function setTitle(product) {
    document.querySelector('title').textContent = product.name;
    document.querySelector('#title').textContent = product.name;
}

async function getProductDetails(url) {
    const id = url.searchParams.get('id');
    const apiRequest = `http://localhost:3000/api/products/` + `${id}`;
    const response = await fetch(apiRequest);
    const product = await response.json();
    displayProductImage(product);
    setTitle(product);
    displayPrice(product);
    displayDescription(product);
    setColorsOption(product);
}



function addToCart() {
    const id = url.searchParams.get('id');
    const color = document.querySelector('#colors').value;
    const quantity = +document.querySelector('#quantity').value;
    const name = document.querySelector('#title').textContent;

    if (quantity <= 0) alert('Veuillez sélectionner au moins un produit');
    if (color === '') alert('Veuillez renseigner la couleur de votre produit');

    if (quantity > 0 && color !== '') {
        const obj = {
            id: id,
            color: color,
            quantity: quantity,
        };
        
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let product = localStorage.getItem(key);
            let productJson = JSON.parse(product);
            if (productJson.id === obj.id && productJson.color === obj.color) {
                console.log(obj);
                productJson.quantity += obj.quantity;
                console.log(productJson.quantity);
                product = JSON.stringify(productJson);
                localStorage.setItem(key, product);
                alert('Produit ajouté au panier');
                return;
            }
        }
        
        const objStr = JSON.stringify(obj);
        localStorage.setItem(name, objStr);
        alert('Produit ajouté au panier');
    }
 

}

getProductDetails(url);
document.querySelector('#addToCart').addEventListener('click', addToCart);
