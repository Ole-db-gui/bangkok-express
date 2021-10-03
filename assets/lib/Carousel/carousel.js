import createElement from "../create-element.js";

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.render();
  }

  render() {
    let carousel = createElement(`<div class="carousel">
    </div>`);
    const arrowRight =
      createElement(`<div class="carousel__arrow carousel__arrow_right">
    <img src="./assets/images/icons/angle-icon.svg" alt="icon">
  </div>`);
    const arrowLeft =
      createElement(`<div class="carousel__arrow carousel__arrow_left">
    <img src="./assets/images/icons/angle-left-icon.svg" alt="icon">
  </div>`);
    carousel.append(arrowRight);
    carousel.append(arrowLeft);
    let carouselInner = createElement(`<div class="carousel__inner"></div>
    `);

    for (let i = 0; i < this.slides.length; i++) {
      let carouselSlide = createElement(
        `<div class="carousel__slide" data-id="${this.slides[i].id}">`
      );
      carouselSlide.innerHTML = `
              <img src="./assets/images/carousel/${
                this.slides[i].image
              }" class="carousel__img" alt="slide">
              <div class="carousel__caption">
                <span class="carousel__price">€${Number(
                  this.slides[i].price
                ).toFixed(2)}</span>
                <div class="carousel__title">${this.slides[i].name}</div>
                <button type="button" class="carousel__button">
                  <img src="./assets/images/icons/plus-icon.svg" alt="icon">
                </button>
              </div>`;
      carouselInner.append(carouselSlide);

      let btnPlus = carouselSlide.querySelector(".carousel__button");
      onClick = onClick.bind(this);
      btnPlus.addEventListener("click", onClick);

      function onClick(ev) {
        console.log(ev.target);
        let target = ev.target.closest(".carousel__button");
        if (!target) return;

        let event = new CustomEvent("product-add", {
          detail: this.slides[i].id,
          bubbles: true,
        });

        target.dispatchEvent(event);
      }
    }

    carousel.append(carouselInner);
    let offset = carouselInner.offsetWidth;
    let activeSlide = 0;
    arrowLeft.style.display = "none";
    let position = 0;

    function changeSlideRight() {
      position = position - carouselInner.offsetWidth;
      carouselInner.style.transform = `translateX(${position}px)`;
      arrowLeft.style.display = "";
      activeSlide++;
      if (activeSlide >= carouselInner.children.length - 1) {
        activeSlide = carouselInner.children.length - 1;
        arrowRight.style.display = "none";
      }
    }

    function changeSlideLeft() {
      position = position + carouselInner.offsetWidth;
      carouselInner.style.transform = `translateX(${position}px)`;
      arrowRight.style.display = "";
      activeSlide--;
      if (activeSlide <= 0) {
        activeSlide = 0;
        arrowLeft.style.display = "none";
      }
    }

    arrowRight.addEventListener("click", () => {
      changeSlideRight();
    });

    arrowLeft.addEventListener("click", () => {
      changeSlideLeft();
    });

    this._container = carousel;
  }

  get elem() {
    return this._container;
  }
}
