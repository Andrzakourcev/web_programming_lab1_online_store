/**
 * @jest-environment jsdom
 */
const {
  cart,
  addToCart,
  removeFromCart,
  updateQty,
  getCartCount,
  getCartTotal,
  validateName,
  validatePhone,
  validateAddress
} = require("./script.js");

describe("Cart logic", () => {
  let testCart;

  beforeEach(() => {
    testCart = {};
    document.body.innerHTML = `<span id="cartCount">0</span>`;
    localStorage.clear();
  });


  test("Добавление одного товара увеличивает количество", () => {
    // Arrange
    const product = { id: 1, title: "Хлеб", price: 30 };
    // Act
    addToCart(testCart, product);
    // Assert
    expect(getCartCount(testCart)).toBe(1);
    expect(testCart[1].qty).toBe(1);
  });

  test("Добавление одного и того же товара увеличивает qty", () => {
    const product = { id: 1, title: "Хлеб", price: 30 };

    addToCart(testCart, product);
    addToCart(testCart, product);

    expect(getCartCount(testCart)).toBe(2);
    expect(testCart[1].qty).toBe(2);
  });

  test("Удаление товара из корзины", () => {
    addToCart(testCart, { id: 1, title: "Хлеб", price: 30 });

    removeFromCart(testCart, 1);

    expect(getCartCount(testCart)).toBe(0);
    expect(testCart[1]).toBeUndefined();
  });

  test("Удаление несуществующего товара не ломает корзину", () => {
    removeFromCart(testCart, 999);
    expect(getCartCount(testCart)).toBe(0);
  });


  test("Обновление количества с лимитами", () => {
    addToCart(testCart, { id: 1, title: "Хлеб", price: 30 });
    updateQty(testCart, 1, -5);  // ниже минимума
    expect(testCart[1].qty).toBe(1);
    updateQty(testCart, 1, 20000); // выше максимума
    expect(testCart[1].qty).toBe(10000);
  });

  test("Обновление количества для несуществующего товара ничего не делает", () => {
    updateQty(testCart, 123, 5);
    expect(testCart[123]).toBeUndefined();
  });


  test("Подсчёт общей суммы для нескольких товаров", () => {
    addToCart(testCart, { id: 1, title: "Хлеб", price: 30 });
    addToCart(testCart, { id: 2, title: "Молоко", price: 60 });
    updateQty(testCart, 2, 2);
    expect(getCartTotal(testCart)).toBe(150); 
  });

  test("Общая сумма пустой корзины = 0", () => {
    expect(getCartTotal(testCart)).toBe(0);
  });


  describe("Валидация имени", () => {
    test("Имя слишком короткое", () => expect(validateName("A")).toBe(false));
    test("Имя корректное (en)", () => expect(validateName("John")).toBe(true));
    test("Имя корректное (на русском)", () => expect(validateName("Иван")).toBe(true));
    test("Имя с пробелом или числом невалидно", () => expect(validateName("Иван1")).toBe(false));
  });

  describe("Валидация телефона", () => {
    test("Корректный телефон с +", () => expect(validatePhone("+79998887766")).toBe(true));
    test("Корректный телефон без +", () => expect(validatePhone("89998887766")).toBe(true));
    test("Телефон слишком короткий", () => expect(validatePhone("123")).toBe(false));
    test("Телефон с буквами", () => expect(validatePhone("123abc4567")).toBe(false));
  });

  describe("Валидация адреса", () => {
    test("Адрес слишком короткий", () => expect(validateAddress("123")).toBe(false));
    test("Адрес нормальной длины", () => expect(validateAddress("ул. Ленина, д.5")).toBe(true));
    test("Адрес с пробелами корректно", () => expect(validateAddress("     ул. Ленина, д.5    ")).toBe(true));
  });


  test("Добавление нескольких товаров и подсчёт общего количества", () => {
    addToCart(testCart, { id: 1, title: "Хлеб", price: 30 });
    addToCart(testCart, { id: 2, title: "Молоко", price: 60 });
    addToCart(testCart, { id: 1, title: "Хлеб", price: 30 });
    expect(getCartCount(testCart)).toBe(3);
    expect(getCartTotal(testCart)).toBe(30*2 + 60*1);
  });
});
