import createElement from "../create-element.js";
import escapeHtml from "../escape-html.js";

import Modal from "./modal.js";

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.addEventListeners();
  }

  addProduct(product) {
    let selected = null;

    if (!product) {
      return;
    }

    for (let item of this.cartItems) {
      if (item.product.id === product.id) {
        selected = item;
        item.count += 1;
      }
    }

    if (selected) {
      this.onProductUpdate(selected);
    } else {
      let obj = { product: product, count: 1 };
      this.cartItems.push(obj);
      this.onProductUpdate(obj);
    }
  }

  updateProductCount(productId, amount) {
    for (let item of this.cartItems) {
      if (item.product.id === productId) {
        item.count += amount;
        this.onProductUpdate(item);
      }
    }
    this.cartItems = this.cartItems.filter((item) => {
      if (item.count > 0) return item;
    });
  }

  isEmpty() {
    return !this.cartItems.length;
  }

  getTotalCount() {
    let quantity = 0;
    for (let item of this.cartItems) {
      quantity += item.count;
    }
    return quantity;
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let item of this.cartItems) {
      totalPrice += item.product.price * item.count;
    }
    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="./assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="./assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="./assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(
            2
          )}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Tabby Mackerel">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="t.mackerel@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+79995553535">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="Russia, Moscow, Pushkina street Kolotushkina house">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle("Your order");

    let modalBody = document.createElement("div");
    this.cartItems.forEach((element) => {
      modalBody.append(this.renderProduct(element.product, element.count));
    });
    modalBody.append(this.renderOrderForm());

    this.modal.setBody(modalBody);
    modalBody = null;

    this.modal.open();

    this.modal.modal.onclick = (event) => {
      if (
        event.target.alt === "plus" ||
        event.target.className.includes("plus")
      ) {
        this.updateProductCount(
          event.target.closest(".cart-product").dataset.productId,
          +1
        );
      }
      if (
        event.target.alt === "minus" ||
        event.target.className.includes("minus")
      ) {
        this.updateProductCount(
          event.target.closest(".cart-product").dataset.productId,
          -1
        );
      }
    };

    this.modal.modal.querySelector(".cart-form").onsubmit = (event) => {
      this.onSubmit(event);
    };
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (!this.getTotalPrice()) {
      this.modal.close();
      delete this.modal;
      return;
    }

    if (document.querySelector("body").className.includes("is-modal-open")) {
      this.totalPrice = this.modal.modal.querySelector(
        " .cart-buttons__info-price "
      );

      if (cartItem.count < 1) {
        this.modal.modal
          .querySelector(` [data-product-id="${cartItem.product.id}"] `)
          .remove();
        this.totalPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
        cartItem = null;
        return;
      }
      this.quantity = this.modal.modal.querySelector(
        ` [data-product-id="${cartItem.product.id}"] .cart-counter__count `
      );
      this.price = this.modal.modal.querySelector(
        ` [data-product-id="${cartItem.product.id}"] .cart-product__price `
      );

      this.quantity.innerHTML = cartItem.count;
      this.price.innerHTML = `€${(
        cartItem.count * cartItem.product.price
      ).toFixed(2)}`;
      this.totalPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }

    cartItem = null;
  }

  async onSubmit(event) {
    event.preventDefault();
    this.modal.modal
      .querySelector('button[type="submit"]')
      .classList.add("is-loading");

    let promise = await fetch("https://httpbin.org/post", {
      method: "POST",
      body: new FormData(this.modal.modal.querySelector(".cart-form")),
    });

    if (!promise.ok) {
      return;
    } else {
      promise = null;
      this.cartItems = [];
      this.modal.modal.querySelector(".modal__body").firstElementChild.remove();
      let modalBodySuccess = document.createElement("div");
      modalBodySuccess.className = "modal__body-inner";
      modalBodySuccess.insertAdjacentHTML(
        "beforeEnd",
        `
    <p>
      Order successful! Your order is being cooked :) <br>
      We’ll notify you about delivery time shortly.<br>
      <img src="./assets/images/delivery.gif">
    </p>
    `
      );
      this.modal.setTitle("Success!");
      this.modal.setBody(modalBodySuccess);
      modalBodySuccess = null;
    }
    this.cartIcon.update(this);
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
