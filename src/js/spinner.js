export class Spinner {
  constructor(selector) {
    this.spinner = this.getSpinner(selector);
  }

  getSpinner(selector) {
    return document.querySelector(selector);
  }

  show() {
    this.spinner.classList.remove('is-hidden');
  }

  hide() {
    this.spinner.classList.add('is-hidden');
  }
}
