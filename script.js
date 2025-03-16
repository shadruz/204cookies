// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    });
});

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.cookie-item, .set-item, .card-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
});

// Добавляем стили для анимации
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Мобильное меню
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 10px;
        }
        
        .mobile-menu-btn span {
            display: block;
            width: 25px;
            height: 3px;
            background-color: #333;
            margin: 5px 0;
            transition: 0.3s;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
            
            .nav-links {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: white;
                padding: 1rem;
                flex-direction: column;
                align-items: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .nav-links.active {
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);
    
    nav.appendChild(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
        
        // Анимация кнопки
        mobileMenuBtn.classList.toggle('active');
        if (mobileMenuBtn.classList.contains('active')) {
            mobileMenuBtn.children[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            mobileMenuBtn.children[1].style.opacity = '0';
            mobileMenuBtn.children[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            mobileMenuBtn.children[0].style.transform = 'none';
            mobileMenuBtn.children[1].style.opacity = '1';
            mobileMenuBtn.children[2].style.transform = 'none';
        }
    });
};

createMobileMenu();

// Language handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    const currentLang = localStorage.getItem('language') || 'ru';
    changeLanguage(currentLang);
    
    // Language selector functionality
    const langButton = document.querySelector('.language-button');
    const langDropdown = document.querySelector('.language-dropdown');
    const currentLangSpan = document.querySelector('.current-lang');
    
    // Показать/скрыть dropdown при клике на кнопку
    langButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        langDropdown.classList.toggle('show');
    });
    
    // Закрыть dropdown при клике вне него
    document.addEventListener('click', (e) => {
        if (!langButton.contains(e.target) && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('show');
        }
    });
    
    // Обработка выбора языка
    document.querySelectorAll('.language-dropdown button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const lang = button.getAttribute('data-lang');
            
            // Update active state
            document.querySelectorAll('.language-dropdown button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update button text and close dropdown
            currentLangSpan.textContent = lang.toUpperCase();
            langDropdown.classList.remove('show');
            
            // Change language
            changeLanguage(lang);
        });
    });
});

// Функция для смены языка
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    translatePage();
}

// Функция для перевода страницы
function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT' && element.getAttribute('type') === 'email') {
                element.placeholder = translations[currentLang][key];
            } else if (element.tagName === 'BUTTON' && element.classList.contains('add-to-cart')) {
                element.textContent = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });

    // Обновляем активный язык в переключателе
    document.querySelectorAll('.lang-switch button').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    translatePage();
});

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Cart button click handler
    const cartButton = document.querySelector('.cart-button');
    const cartDropdown = document.querySelector('.cart-dropdown');
    
    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cartDropdown.classList.toggle('show');
    });
    
    // Close cart dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartButton.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove('show');
        }
    });
    
    // Prevent closing dropdown when clicking inside
    cartDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }
    
    // Add to cart
    window.addToCart = function(productId, name, price, quantity = 1) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name,
                price,
                quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDropdown();
    }
    
    // Remove from cart
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDropdown();
    }
    
    // Clear cart
    window.clearCart = function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDropdown();
    }
    
    // Update item quantity
    window.updateItemQuantity = function(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartDropdown();
            }
        }
    }
    
    // Update cart dropdown
    function updateCartDropdown() {
        const cartItemsContainer = document.querySelector('.cart-items-dropdown');
        const cartTotalAmount = document.querySelector('.cart-total-amount');
        const checkoutButton = document.querySelector('.checkout-button-dropdown');
        const clearCartButton = document.querySelector('.clear-cart-button');
        
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="cart-empty" data-translate="cart_empty">Корзина пуста</div>`;
            checkoutButton.style.display = 'none';
            clearCartButton.style.display = 'none';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item-dropdown';
                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${formatPrice(item.price)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
                `;
                
                cartItemsContainer.appendChild(itemElement);
            });
            
            checkoutButton.style.display = 'block';
            clearCartButton.style.display = 'block';
        }
        
        cartTotalAmount.textContent = formatPrice(total);
    }
    
    function formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' сум';
    }
    
    // Initialize cart
    updateCartCount();
    updateCartDropdown();
});

// Smooth scroll to top when logo is clicked
document.querySelector('.logo-link').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}); 