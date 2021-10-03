import createElement from "../create-element.js";

export default class Modal {
  constructor() {
    this.render();
  }

  render() {
    this.modal = createElement('<div class="modal"></div>');
    this.modal.innerHTML = `<div class="modal__overlay"></div>
    <div class="modal__inner">
      <div class="modal__header">
        <button type="button" class="modal__close">
          <img src="./assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>

        <h3 class="modal__title"></h3>
      </div>

      <div class="modal__body">
      </div>
    </div>`;

    document.body.append(this.modal);

    let closeBtn = document.querySelector(".modal__close");

    closeBtn.addEventListener("click", (ev) => this.closeModal(ev, this.modal));
    document.addEventListener("keydown", (ev) =>
      this.closeModal(ev, this.modal)
    );
  }

  closeModal(ev, window) {
    if (ev.currentTarget.className === "modal__close" || ev.code === "Escape") {
      window.remove();
      document.body.classList.remove("is-modal-open");
    }
  }

  open() {
    document.body.classList.add("is-modal-open");
  }

  close() {
    this.modal.remove();
    document.body.classList.remove("is-modal-open");
  }

  setBody(data) {
    document.querySelector(".modal__body").append(data);
  }

  setTitle(data) {
    document.querySelector(".modal__title").innerHTML = `${data}`;
  }
}
