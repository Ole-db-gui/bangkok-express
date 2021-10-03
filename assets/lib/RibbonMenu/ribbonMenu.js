import createElement from "../create-element.js";

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.render();
    this.moves(this._ribbon);
  }

  render() {
    const ribbon = createElement(`<div class="ribbon"></div>`);
    const ribbonInner = createElement(`<nav class="ribbon__inner"></nav>
    `);
    const arrowRight =
      createElement(`<button class="ribbon__arrow ribbon__arrow_right">
      <img src="./assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    `);
    const arrowLeft =
      createElement(`<button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
    <img src="./assets/images/icons/angle-icon.svg" alt="icon">
  </button>
    `);
    ribbonInner.append(arrowLeft);
    this.categories.map((item) => {
      let menuItem =
        createElement(`<a href="#" class="ribbon__item" data-id="${item.id}">${item.name}</a>
      `);
      ribbonInner.append(menuItem);
      ribbonInner.querySelectorAll('.ribbon__item').item(0).classList.add('ribbon__item_active');
      return ribbonInner;
    });
    ribbonInner.append(arrowRight);
    ribbon.append(ribbonInner);

    this._ribbon = ribbon;
  }

  moves(element) {
    const arrowRight = element.querySelector(".ribbon__arrow_right");
    const arrowLeft = element.querySelector(".ribbon__arrow_left");
    const innerRibbon = element.querySelector(".ribbon__inner");
    const ribbonItems = element.querySelectorAll(".ribbon__item");
    arrowRight.classList.add("ribbon__arrow_visible");
    arrowLeft.classList.remove("ribbon__arrow_visible");

    function scrollRight() {
      innerRibbon.scrollBy(350, 0);
    }

    function scrollLeft() {
      innerRibbon.scrollBy(-350, 0);
    }

    function scrollMenu() {
      let shiftRight =
        innerRibbon.scrollWidth -
        innerRibbon.scrollLeft -
        innerRibbon.clientWidth;
      if (shiftRight === 0) {
        arrowRight.classList.remove("ribbon__arrow_visible");
      } else {
        arrowRight.classList.add("ribbon__arrow_visible");
      }
      if (innerRibbon.scrollLeft === 0) {
        arrowLeft.classList.remove("ribbon__arrow_visible");
      } else {
        arrowLeft.classList.add("ribbon__arrow_visible");
      }
    }

    innerRibbon.addEventListener("scroll", scrollMenu);
    arrowRight.addEventListener("click", scrollRight);
    arrowLeft.addEventListener("click", scrollLeft);

    ribbonItems.forEach((ribbonItem) => {
      ribbonItem.addEventListener("click", (event) =>
        itemClicked(event, ribbonItem)
      );
    });

    function itemClicked(event, item) {
      event.preventDefault();
      let id = item.dataset.id;
      element
        .querySelector(".ribbon__item_active")
        .classList.remove("ribbon__item_active");
      item.classList.add("ribbon__item_active");
      let ribbonSelected = new CustomEvent("ribbon-select", {
        detail: id,
        bubbles: true,
      });
      element.dispatchEvent(ribbonSelected);
    }
  }

  get elem() {
    return this._ribbon;
  }
}
