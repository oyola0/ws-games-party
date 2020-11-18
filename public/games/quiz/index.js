class WcQuiz extends HTMLElement {
  static tag() {
    return "wc-quiz";
  }

  constructor() {
    super();
    this.shadowRoot.innerHTML = `<h1>Hello to QUIZ!</h1>`;
  }
}

customElements.define(WcQuiz.tag(), WcQuiz);

export default WcQuiz.tag();
