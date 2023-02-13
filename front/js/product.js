const url = new URL(window.location.href);

// On insère l'image du produit
function displayProductImage(product) {
    const html = `<img src="${product.imageUrl}" alt="${product.altText}">`;
    document.querySelector('.item__img').insertAdjacentHTML('beforeend', html);
}

// On insère le prix du produit
function displayPrice(product) {
    document.querySelector('#price').textContent = product.price;
}

// On insère la descritpion du produit
function displayDescription(product) {
    document.querySelector('#description').textContent = product.description;
}

// 
function setColorsOption(product) {
    product.colors.forEach(function(color) {
        const html = `<option value="${color}">${color}</option>`;
        document.querySelector('#colors').insertAdjacentHTML('beforeend', html);
    })
}

// On change le contenu de <title> et on insère le nom du produit comme titre principal de la page
function setTitle(product) {
    document.querySelector('title').textContent = product.name;
    document.querySelector('#title').textContent = product.name;
}

// On requête l'API pour obtenir tous les détails du produit
// Puis on affiche ces détails à l'aide des fonctions ci-dessus
async function getProductDetails(url) {
    try {
        const id = url.searchParams.get('id');
        const apiRequest = `http://localhost:3000/api/products/${id}`;
        const response = await fetch(apiRequest);
        const product = await response.json();
        displayProductImage(product);
        setTitle(product);
        displayPrice(product);
        displayDescription(product);
        setColorsOption(product);
    } catch(e) {
        console.error(e);
    }
}


// On ajoute le produit au panier
function addToCart() {
    const id = url.searchParams.get('id');
    const color = document.querySelector('#colors').value;
    const quantity = +document.querySelector('#quantity').value;
    const name = document.querySelector('#title').textContent;

    // On vérifie que le produit dispose des caractéristiques nécessaires (quantité et couleur)
    if (quantity <= 0) alert('Veuillez sélectionner au moins un produit');
    if (color === '') alert('Veuillez renseigner la couleur de votre produit');

    if (quantity > 0 && color !== '') {
        const obj = {
            id: id,
            color: color,
            quantity: quantity,
        };
        // On stocke ces informations dans le localStorage
        // On vérifie que le même produit n'y est pas déjà
        // Dans ce cas on met simplement à jour la quantité
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let product = localStorage.getItem(key);
            let productJson = JSON.parse(product);
            if (productJson.id === obj.id && productJson.color === obj.color) {
                productJson.quantity += obj.quantity;
                product = JSON.stringify(productJson);
                localStorage.setItem(key, product);
                alert('Produit ajouté au panier');
                return;
            }
        }
        
        const objStr = JSON.stringify(obj);
        localStorage.setItem(name + '_' + color, objStr);
        alert('Produit ajouté au panier');
    }
 

}

getProductDetails(url);
document.querySelector('#addToCart').addEventListener('click', addToCart);
