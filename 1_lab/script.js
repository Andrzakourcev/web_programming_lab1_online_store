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

    } catch (err) {
        console.error('Ошибка в основном блоке script.js:', err);
    }
});