/* Grovix Interactive Enhancements */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Inject clean styling
    const style = document.createElement('style');
    style.textContent = `
      .w-commerce-commercecarterrorstate { display: none !important; }
      .w-webflow-badge { display: none !important; }
    `;
    document.head.appendChild(style);

    initCart();
    initMobileNav();
    initFaqAccordion();
    initScrollTriggers();
  });

  // ---------- CART FUNCTIONALITY ----------
  function initCart() {
    const cartWrapper = document.querySelector('[data-node-type="commerce-cart-container-wrapper"]');
    const openBtns = document.querySelectorAll('[data-node-type="commerce-cart-open-link"], .cart-button');
    const closeBtns = document.querySelectorAll('[data-node-type="commerce-cart-close-link"], .remove-button-x');
    const cartCountEls = document.querySelectorAll('.w-commerce-commercecartopenlinkcount');
    const emptyState = document.querySelector('.w-commerce-commercecartemptystate');
    const cartForm = document.querySelector('.w-commerce-commercecartform');
    const cartList = document.querySelector('.w-commerce-commercecartlist');

    let cartItems = [];

    function updateCartUI() {
      const count = cartItems.reduce((acc, item) => acc + item.qty, 0);
      cartCountEls.forEach(el => {
        el.textContent = count;
      });

      if (count === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (cartForm) cartForm.style.display = 'none';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        if (cartForm) cartForm.style.display = 'block';
        renderCartItems();
      }
    }

    function renderCartItems() {
      if (!cartList) return;
      cartList.innerHTML = '';
      let subtotal = 0;

      cartItems.forEach((item, index) => {
        subtotal += item.price * item.qty;
        const itemEl = document.createElement('div');
        itemEl.className = 'w-commerce-commercecartitem cart-item';
        itemEl.style.display = 'flex';
        itemEl.style.justifyContent = 'space-between';
        itemEl.style.alignItems = 'center';
        itemEl.style.padding = '16px 0';
        itemEl.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';

        itemEl.innerHTML = `
          <div class="cart-hero" style="display:flex;align-items:center;gap:12px;">
            <div style="width:48px;height:48px;background:rgba(255,100,50,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,100,50,0.3)">
              <span style="font-size:20px;">⚡</span>
            </div>
            <div class="product-details-holder">
              <div class="product-name" style="font-weight:600;color:#fff;">${item.name}</div>
              <div class="category" style="font-size:12px;color:rgba(255,255,255,0.6);">${item.category}</div>
              <div class="product-cart-price" style="font-size:14px;color:#ff6b3d;font-weight:600;">$${item.price}.00 USD</div>
            </div>
          </div>
          <div class="price-and-quantity" style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:14px;color:rgba(255,255,255,0.8);">Qty: ${item.qty}</span>
            <button class="remove-cart-item" data-index="${index}" style="background:none;border:none;color:#ff4d4d;cursor:pointer;font-size:18px;line-height:1;padding:4px 8px;" title="Remove">✕</button>
          </div>
        `;
        cartList.appendChild(itemEl);
      });

      const subtotalEl = document.querySelector('.w-commerce-commercecartordervalue');
      if (subtotalEl) {
        subtotalEl.textContent = `$${subtotal}.00 USD`;
      }

      cartList.querySelectorAll('.remove-cart-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          cartItems.splice(idx, 1);
          updateCartUI();
        });
      });
    }

    function openCart() {
      if (!cartWrapper) return;
      cartWrapper.style.display = 'block';
      cartWrapper.style.position = 'fixed';
      cartWrapper.style.top = '0';
      cartWrapper.style.left = '0';
      cartWrapper.style.right = '0';
      cartWrapper.style.bottom = '0';
      cartWrapper.style.zIndex = '999999';
      cartWrapper.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      cartWrapper.style.backdropFilter = 'blur(6px)';
      cartWrapper.style.opacity = '1';
      cartWrapper.style.visibility = 'visible';

      const container = cartWrapper.querySelector('.w-commerce-commercecartcontainer');
      if (container) {
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.right = '0';
        container.style.width = '100%';
        container.style.maxWidth = '420px';
        container.style.height = '100vh';
        container.style.backgroundColor = '#0b0c10';
        container.style.boxShadow = '-10px 0 40px rgba(0,0,0,0.8)';
        container.style.borderLeft = '1px solid rgba(255,255,255,0.1)';
        container.style.transform = 'translateX(0)';
        container.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        container.style.overflowY = 'auto';
        container.style.zIndex = '1000000';
      }
    }

    function closeCart() {
      if (!cartWrapper) return;
      cartWrapper.style.display = 'none';
    }

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeCart();
      });
    });

    if (cartWrapper) {
      cartWrapper.addEventListener('click', (e) => {
        if (e.target === cartWrapper) {
          closeCart();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCart();
    });

    // Add to cart from pricing plans
    document.querySelectorAll('a[href*="/product/"], a.button-simple.w-button').forEach(btn => {
      const text = btn.textContent.trim().toLowerCase();
      if (text.includes('get started') || text.includes('buy') || text.includes('order')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const card = btn.closest('.pricing-holder') || btn.closest('.pricing-list-item');
          let planName = 'Basic Plan';
          let price = 49;
          if (card) {
            const planEl = card.querySelector('.price-plan');
            const priceEl = card.querySelector('.price');
            if (planEl) planName = planEl.textContent.trim();
            if (priceEl) {
              const match = priceEl.textContent.match(/\d+/);
              if (match) price = parseInt(match[0], 10);
            }
          }

          const existing = cartItems.find(i => i.name === planName);
          if (existing) {
            existing.qty += 1;
          } else {
            cartItems.push({
              name: planName,
              category: 'Subscription Plan',
              price: price,
              qty: 1
            });
          }

          updateCartUI();
          openCart();
        });
      }
    });

    updateCartUI();
  }

  // ---------- MOBILE NAV ----------
  function initMobileNav() {
    const menuBtn = document.querySelector('.menu-button, .w-nav-button');
    const navMenu = document.querySelector('.nav-menu, .w-nav-menu');

    if (menuBtn && navMenu) {
      menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const isOpen = navMenu.classList.contains('w--open');
        if (isOpen) {
          navMenu.classList.remove('w--open');
          menuBtn.classList.remove('w--open');
          navMenu.style.display = 'none';
        } else {
          navMenu.classList.add('w--open');
          menuBtn.classList.add('w--open');
          navMenu.style.display = 'block';
          navMenu.style.position = 'absolute';
          navMenu.style.top = '100%';
          navMenu.style.left = '0';
          navMenu.style.right = '0';
          navMenu.style.background = '#08080c';
          navMenu.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
          navMenu.style.padding = '20px';
        }
      });
    }
  }

  // ---------- FAQ ACCORDION ----------
  function initFaqAccordion() {
    const questions = document.querySelectorAll('.questions-container');
    questions.forEach(q => {
      const questionHeader = q.querySelector('.question');
      const answerHolder = q.querySelector('.answer-holder');
      const icon = q.querySelector('.question-icon');

      if (questionHeader && answerHolder) {
        answerHolder.style.overflow = 'hidden';
        answerHolder.style.transition = 'max-height 0.35s ease, opacity 0.3s ease, margin-top 0.3s ease';
        answerHolder.style.maxHeight = '0px';
        answerHolder.style.opacity = '0';
        answerHolder.style.marginTop = '0px';

        questionHeader.style.cursor = 'pointer';
        questionHeader.addEventListener('click', () => {
          const isOpen = answerHolder.style.maxHeight !== '0px';
          // close all
          questions.forEach(other => {
            const otherAns = other.querySelector('.answer-holder');
            const otherIcon = other.querySelector('.question-icon');
            if (otherAns) {
              otherAns.style.maxHeight = '0px';
              otherAns.style.opacity = '0';
              otherAns.style.marginTop = '0px';
            }
            if (otherIcon) {
              otherIcon.style.transform = 'rotate(0deg)';
              otherIcon.style.transition = 'transform 0.3s ease';
            }
          });

          if (!isOpen) {
            answerHolder.style.maxHeight = answerHolder.scrollHeight + 30 + 'px';
            answerHolder.style.opacity = '1';
            answerHolder.style.marginTop = '12px';
            if (icon) {
              icon.style.transform = 'rotate(45deg)';
              icon.style.transition = 'transform 0.3s ease';
            }
          }
        });
      }
    });
  }

  // ---------- SCROLL TRIGGER SAFETY ----------
  function initScrollTriggers() {
    // If Webflow IX2 is present, trigger a window scroll event after load to reveal in-view items
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
      }, 300);
    });

    // Fallback observer: ensure all elements with data-w-id fade in if not already animated
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const style = window.getComputedStyle(el);
            if (style.opacity === '0') {
              el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
              el.style.opacity = '1';
              el.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
            }
          }
        });
      }, { rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('[data-w-id]').forEach(el => observer.observe(el));
    }
  }
})();
