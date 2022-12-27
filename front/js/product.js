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

function setPageTitle(product) {
    document.querySelector('title').textContent = product.name;
}

async function getProductDetails(url) {
    const id = url.searchParams.get('id');
    const apiRequest = `http://localhost:3000/api/products/` + `${id}`;
    const response = await fetch(apiRequest);
    const product = await response.json();
    displayProductImage(product);
    setPageTitle(product);
    displayPrice(product);
    displayDescription(product);
    setColorsOption(product);
}

getProductDetails(url);
