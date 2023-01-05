// Affichage du bloc html contenant le lien vers la page produit et diverses infos
function displayProduct(product) {
    const html = `
        <a href="./product.html?id=${product._id}&name=${product.name}&description=${product.description}&imageUrl=${product.imageUrl}&altText=${product.altTxt}&price=${product.price}&colors=${product.colors}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
        </a>
    `;
    document.querySelector('.items').insertAdjacentHTML('beforeend', html);
}

// Requête HTTP vers l'API puis affichage de l'ensemble des produits
async function getAllProducts(url) {
    try {
        const response = await fetch(url);
        const products = await response.json();
        products.forEach(product => displayProduct(product));
    } catch(e) {
        console.error(e);
    }
}


getAllProducts('http://localhost:3000/api/products');

