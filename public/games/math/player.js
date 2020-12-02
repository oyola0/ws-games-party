class WcMath extends HTMLElement {
  static tag() {
    return "wc-math";
  }

  constructor() {
    super();
    this.innerHTML = `<h1>Hello (Player) to math!</h1>`;
  }
}

customElements.define(WcMath.tag(), WcMath);

export default WcMath.tag();
