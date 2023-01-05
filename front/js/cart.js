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

function displayProduct(product) {
    const html = `
    <article class="cart__item" data-id="${product._id}" data-color="{product-color}">
        <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altText}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>Vert</p>
            <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
            </div>
        </div>
    </article>
      `;

    document.querySelector('#cart__items').insertAdjacentHTML('beforeend', html);
}

async function getAllProducts(cart) {
    try {
        const products = await Promise.all(
            cart.map(async item => {
            const response = await fetch(`http://localhost:3000/api/products/` + `${item.id}`);
            return response.json();
        })
        );
        products.map(product => displayProduct(product));
    } catch(e) {
        console.error(e);
    }
} 


const cart = getCart();
getAllProducts(cart);




  