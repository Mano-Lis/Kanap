const url = new URL(window.location.href);
console.log(url);

function checkIfParamExists(paramName) {
    const searchParams = new URLSearchParams(url.search); 
    if (!searchParams.has(paramName)) console.error(`La propriété ${paramName} du produit n'est pas renseignée`);
}

function setPageTitle(url) {
    const name = url.searchParams.get('name');
    document.querySelector('title').textContent = name;
}

function displayProductImage(url) {
    checkIfParamExists('imageUrl');
    const imageUrl = url.searchParams.get('imageUrl');
    checkIfParamExists('altText');
    const altText = url.searchParams.get('altText');
    const html = `<img src="${imageUrl}" alt="${altText}">`;
    document.querySelector('.item__img').insertAdjacentHTML('beforeend', html);
}

function displayPrice(url) {
    checkIfParamExists('price');
    const price = url.searchParams.get('price');
    document.querySelector('#price').textContent = price;
}

function displayDescription(url) {
    checkIfParamExists('description');
    const description = url.searchParams.get('description');
    document.querySelector('#description').textContent = description;
}

function setColorsOption(url) {
    checkIfParamExists('colors');
    const colors = url.searchParams.get('colors').split(',');
    colors.forEach(function(color) {
        const html = `<option value="${color}">${color}</option>`;
        document.querySelector('#colors').insertAdjacentHTML('beforeend', html);
    })
}

displayProductImage(url);
setPageTitle(url);
displayPrice(url);
displayDescription(url);
setColorsOption(url);
