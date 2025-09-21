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
    // Загрузка корзины из localStorage
    if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCartCount();
    }

    // Делегирование событий на кнопки "Добавить в корзину"
    productsContainer.addEventListener("click", e => {
    if (e.target.classList.contains("add-btn")) {
        const id = e.target.dataset.id;
        const title = e.target.dataset.title;
        const price = parseInt(e.target.dataset.price);

        if (cart[id]) {
        cart[id].qty++;
        } else {
        cart[id] = { title, price, qty: 1 };
        }
        saveCart();
        updateCartCount();
    }
    });

    // Сохранение в localStorage
    function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Обновление счётчика корзины
    function updateCartCount() {
    const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("cartCount").textContent = count;
    }
    
    const cartItems = document.getElementById("cartItems");

    // Удаление
    cartItems.addEventListener("click", e => {
    if (e.target.classList.contains("remove-btn")) {
        const id = e.target.dataset.id;
        delete cart[id];
        saveCart();
        showCart();
        updateCartCount();
    }
    });

    // Изменение количества
    cartItems.addEventListener("change", e => {
    if (e.target.classList.contains("qty-input")) {
        const id = e.target.dataset.id;
        cart[id].qty = parseInt(e.target.value);
        if (cart[id].qty <= 0) delete cart[id];
        saveCart();
        showCart();
        updateCartCount();
    }
    });
    // Заказ
    const checkoutModal = document.getElementById("checkoutModal");
    document.getElementById("checkoutBtn").onclick = () => {
        checkoutModal.classList.remove("hidden");
    };
    document.getElementById("closeCheckout").onclick = () => checkoutModal.classList.add("hidden");

    document.getElementById("orderForm").addEventListener("submit", e => {
        e.preventDefault();

        const form = e.target;
        const firstName = form.firstName.value.trim();
        const lastName = form.lastName.value.trim();
        const address = form.address.value.trim();
        const phone = form.phone.value.trim();

        // Проверки
        const namePattern = /^[A-Za-zА-Яа-яЁё]{2,}$/;

        if (!namePattern.test(firstName)) {
            alert("Имя должно содержать только буквы и минимум 2 символа");
            return;
        }

        if (!namePattern.test(lastName)) {
            alert("Фамилия должна содержать только буквы и минимум 2 символа");
            return;
        }

        if (address.length < 5) {
            alert("Адрес слишком короткий");
            return;
        }

        const phonePattern = /^\+?\d{10,15}$/; 
        if (!phonePattern.test(phone)) {
            alert("Введите корректный телефон (10–15 цифр, можно с +)");
            return;
        }

        alert("Заказ создан!");
        cart = {};
        saveCart();
        updateCartCount();
        checkoutModal.classList.add("hidden");
        cartModal.classList.add("hidden");
    });

    } catch (err) {
        console.error('Ошибка в основном блоке script.js:', err);
    }
});