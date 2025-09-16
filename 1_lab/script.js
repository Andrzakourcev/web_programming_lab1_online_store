console.log('script.js загружен');
document.addEventListener('DOMContentLoaded', () => {
  try {
    // --- Товары ---
    const products = [
        { id: 1, title: "Хлеб",   price: 30, image: "images/bread.jpg" },
        { id: 2, title: "Молоко", price: 60, image: "images/milk.jpg" },
        { id: 3, title: "Сыр",    price: 150, image: "images/cheese.jpg" },
        { id: 4, title: "Яблоки", price: 80, image: "images/apples.jpg" },
        { id: 5, title: "Бананы", price: 90, image: "images/bananas.jpg" }
    ];

    const productsContainer = document.getElementById('products');
    if (!productsContainer) {
        console.error('Не найден элемент #products');
        return;
    }

    // --- Каталог ---
    productsContainer.innerHTML = ''; // очистить на всякий случай
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
        <article>
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">${product.price} руб.</p>
            <button class="add-btn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">
            Добавить в корзину
            </button>
        </article>
        `;
        productsContainer.appendChild(li);
    });

    let cart = {};
    
    // Открытие/закрытие корзины
    const cartModal = document.getElementById("cartModal");
    document.getElementById("cartBtn").onclick = () => { showCart(); cartModal.classList.remove("hidden"); };
    document.getElementById("closeCart").onclick = () => cartModal.classList.add("hidden");

    // Показ содержимого корзины
    function showCart() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    let total = 0;
    for (let id in cart) {
        const item = cart[id];
        total += item.price * item.qty;

        const li = document.createElement("li");
        li.innerHTML = `
        ${item.title} - ${item.price} руб. × 
        <input type="number" min="1" value="${item.qty}" data-id="${id}" class="qty-input">
        = ${item.price * item.qty} руб.
        <button class="remove-btn" data-id="${id}">Удалить</button>
        `;
        cartItems.appendChild(li);
    }
    document.getElementById("cartTotal").textContent = total;
}
    } catch (err) {
        console.error('Ошибка в основном блоке script.js:', err);
    }
});