import createElement from "../create-element.js";

export default class StepSlider {
    constructor({ steps, value = 0 }) {
        this._steps = steps;
        this._value = value;
        this._segments = steps - 1;
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.render();
    }

    render() {
        this.slider = createElement(`<div></div>`);
        this.slider.classList.add("slider");
        this.sliderThumb =
            createElement(`<div class="slider__thumb" style="left: 0%;">
    <span class="slider__value">${this._value}</span>
  </div>
    `);
        this.slider.append(this.sliderThumb);
        this.sliderProgress =
            createElement(`<div class="slider__progress" style="width: 0%;"></div>
    `);
        this.slider.append(this.sliderProgress);
        this.sliderSteps = createElement(`<div class="slider__steps"></div>`);
        for (let i = 0; i < this._steps; i++) {
            let stepSpan = createElement(`<span></span>`);
            this.sliderSteps.append(stepSpan);
        }
        this.sliderSteps
            .querySelectorAll("span")
            .item(this._value)
            .classList.add("slider__step-active");
        this.slider.append(this.sliderSteps);
        this.sliderValue = this.slider.querySelector(".slider__value");
        this.slider.addEventListener("click", (event) => {
            this.clickSlider(event, this.slider);
        });
        this.sliderThumb.addEventListener("pointerdown", (event) =>
            this.onPointerDown(event, this.slider)
        );
    }

    moves(value) {
        this.sliderValue.innerHTML = value;
        this.value = value;
        let thumb = this.slider.querySelector(".slider__thumb");
        let progress = this.slider.querySelector(".slider__progress");
        let percentLeft = Math.round(100 / this._segments) * this.value;
        let oldValueStep = this.slider.querySelector(".slider__step-active");
        let activeValueStep = this.slider
            .querySelectorAll(".slider__steps span")
            .item(this.value);

        thumb.style.left = `${percentLeft}%`;
        progress.style.width = `${percentLeft}%`;

        oldValueStep.classList.remove("slider__step-active");
        activeValueStep.classList.add("slider__step-active");
    }

    clickSlider(event, element) {
        let point =
            ((event.clientX - element.getBoundingClientRect().left) /
                element.offsetWidth) *
            this._segments;

        this.moves(Math.round(point));

        let sliderChangedEvent = new CustomEvent("slider-change", {
            detail: this.value,
            bubbles: true,
        });
        element.dispatchEvent(sliderChangedEvent);
    }

    onPointerDown(event, element) {
        event.preventDefault();
        let thumb = element.querySelector(".slider__thumb");
        thumb.ondragstart = () => false;
        element.classList.add("slider_dragging");

        document.addEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerMove(event) {
        event.preventDefault();
        let thumb = this.slider.querySelector(".slider__thumb");
        let progress = this.slider.querySelector(".slider__progress");
        let oldValueStep = this.slider.querySelector(".slider__step-active");
        let activeValueStep = this.slider
            .querySelectorAll(".slider__steps span")
            .item(this._value);
        let position =
            (event.clientX - this.slider.getBoundingClientRect().left) /
            this.slider.offsetWidth;

        if (position < 0) {
            position = 0;
        } else if (position > 1) {
            position = 1;
        }

        thumb.style.left = `${position * 100}%`;
        progress.style.width = `${position * 100}%`;
        this._value = Math.round(this._segments * position);
        this.sliderValue.innerHTML = this._value;
        oldValueStep.classList.remove("slider__step-active");
        activeValueStep.classList.add("slider__step-active");
    }

    onPointerUp() {
        let thumb = this.slider.querySelector(".slider__thumb");
        let progress = this.slider.querySelector(".slider__progress");
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);

        this.slider.classList.remove("slider_dragging");

        thumb.style.left = `${(this._value / this._segments) * 100}%`;
        progress.style.width = `${(this._value / this._segments) * 100}%`;

        let sliderChangedEvent = new CustomEvent("slider-change", {
            detail: this._value,
            bubbles: true,
        });
        this.slider.dispatchEvent(sliderChangedEvent);
    }

    get elem() {
        return this.slider;
    }
}