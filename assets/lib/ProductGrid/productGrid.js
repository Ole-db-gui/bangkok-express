import createElement from "../create-element.js";
import ProductCard from "../ProductCard/productCard.js";

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = createElement(`<div></div>`);
    this.elem.classList.add("products-grid");
    this.elem.innerHTML = '<div class="products-grid__inner"></div>';
    this.render();
  }

  render() {
    let productsGridInner = this.elem.querySelector(".products-grid__inner");
    productsGridInner.innerHTML = "";

    for (let product of this.products) {
      if (this.filters.noNuts && product.nuts) {
        continue;
      }

      if (this.filters.vegeterianOnly && !product.vegeterian) {
        continue;
      }

      if (
        "maxSpiciness" in this.filters &&
        product.spiciness > this.filters.maxSpiciness
      ) {
        continue;
      }

      if (this.filters.category && product.category !== this.filters.category) {
        continue;
      }
      let card = new ProductCard(product);
      productsGridInner.append(card.elem);
    }
  }

  updateFilter(filters) {
    Object.assign(this.filters, filters);
    this.render();
  }
}
