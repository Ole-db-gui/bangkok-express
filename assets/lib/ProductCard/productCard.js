import createElement from "../create-element.js";
export default class ProductCard {
  constructor(product) {
    this._props = product;
    this.render();
  }

  render() {
    let { name, price, category, image, id } = this._props;

    let card = createElement(`
    <div class="card">
      <div class="card__top">
          <img src="./assets/images/products/${image}" class="card__image" alt="product">
          <span class="card__price">€${Number(price).toFixed(2)}</span>
      </div>
    <div class="card__body">
        <div class="card__title">${name}</div>
        <button type="button" class="card__button">
            <img src="./assets/images/icons/plus-icon.svg" alt="icon">
        </button>
    </div>
</div>`);
    let btnPlus = card.querySelector(".card__button");
    onClick = onClick.bind(this);
    btnPlus.addEventListener("click", onClick);

    function onClick(ev) {
      console.log(ev.target);
      let target = ev.target.closest(".card__button");
      if (!target) return;

      let event = new CustomEvent("product-add", {
        detail: this._props.id,
        bubbles: true,
      });

      target.dispatchEvent(event);
    }
    this._elem = card;
  }

  get elem() {
    return this._elem;
  }
}
