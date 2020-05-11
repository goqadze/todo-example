import { LitElement, html, css } from "lit-element";

class TodoCreateForm extends LitElement {
  constructor() {
    super();
    this.item = {};
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        margin: 10px;
      }

      h3 {
        align-self: center;
      }

      .form {
        display: flex;
        flex-direction: column;
        margin: 20px;
        border: 1px solid black;
        padding: 10px;
      }

      input {
        margin: 10px;
      }
    `;
  }

  static get properties() {
    return {
      item: Object,
    };
  }

  updated(changedProps) {
    console.log("todo-create -> updated hook", changedProps);
  }

  async _handleSubmitEvent(e) {
    const newItem = {
      title: this.item.title,
      description: this.item.description,
      completed: !!this.item.completed,
    };
    this.dispatchEvent(
      new CustomEvent("on-create", {
        detail: { data: newItem },
      })
    );
  }

  render() {
    return html`
      <h3>Create todo</h3>
      <div class="form">
        Title:
        <input
          type="text"
          .value=${this.item.title || ""}
          @change=${(e) => (this.item.title = e.target.value)}
        />
        Description:
        <input
          type="text"
          .value=${this.item.description || ""}
          @change=${(e) => (this.item.description = e.target.value)}
        />
        Completed:
        <input
          type="checkbox"
          .checked=${this.item.completed}
          @click=${(e) => (this.item.completed = !this.item.completed)}
        />
        <button @click=${this._handleSubmitEvent}>Create</button>
      </div>
    `;
  }
}

customElements.define("todo-create", TodoCreateForm);
