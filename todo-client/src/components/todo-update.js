import { LitElement, html, css } from "lit-element";

class TodoUpdateForm extends LitElement {
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
      title: String,
      description: String,
      completed: Boolean,
    };
  }

  updated(changedProps) {
    console.log('todo-update -> updated hook', changedProps);
    // if (changedProps.has('item')) {
    //   console.log('item', this.item);
    // }
  }

  _handleSubmitEvent() {
    if (!this.item._id) { 
      alert('შეარჩიეთ Todo');
      return;
    }
    this.dispatchEvent(
      new CustomEvent("on-update", {
        detail: { id: this.item._id, data: this.item },
      })
    );
  }

  render() {
    return html`
      <h3>Update todo</h3>
      <div class="form">
        Title:
        <input
          type="text"
          .value=${this.item.title || ''}
          @change=${(e) => (this.item.title = e.target.value)}
        />
        Description:
        <input
          type="text"
          .value=${this.item.description || ''}
          @change=${(e) => (this.item.description = e.target.value)}
        />
        Completed:
        <input
          type="checkbox"
          .checked=${this.item.completed}
          @click=${(e) => (this.item.completed = !this.item.completed)}
        />
        <button id="submit" @click=${this._handleSubmitEvent}>Update</button>
      </div>
    `;
  }
}

customElements.define("todo-update", TodoUpdateForm);
