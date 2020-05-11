import { LitElement, html, css } from "lit-element";
import api from "./api";
import "./components/todo-list";
import "./components/todo-create";
import "./components/todo-update";
import "./components/todo-errors";

class TodoApp extends LitElement {
  constructor() {
    super();
    this.todos = [];
    this.selectedItem = {};
    this.errors = [];
    this.filter = {};
  }

  static get properties() {
    return {
      todos: Array,
      selectedItem: Object,
      errors: Array,
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
      }

      .forms {
        display: flex;
        flex-direction: row;
      }
    `;
  }

  /**
   * life cycle hook
   * Called after the element’s DOM has been updated the first time
   */
  firstUpdated() {
    //
  }

  /**
   * life cycle hook
   * გამოიძახება ნებისმიერი ფროფერთის მნიშვნელობის შეცვლისას
   */
  updated(changedProperties) {
    //
    // changedProperties არის javascript-ის Map ობჯექთი
    // Map-ს აქვს სამი 4 მთავარი ფუნქცია:
    // 
    // get - changedProperties.get('rameKey')
    // has - changedProperties.has('rameKey') - აბრუნებს true ან false-ს
    // set - changedProperties.set('rameKey', 'rameValue'), მეორე პარამეტრი შეიძლება იყოს ნებიმისერი ტიპის
    // delete - changedProperties.delete('rameKey')
  }

  /**
   * Invoked when a component is added to the document’s DOM.
   */
  async connectedCallback() {
    super.connectedCallback();
    this.todos = await this._getTodoList();
  }

  /**
   * Invoked when a component is removed from the document’s DOM.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async _getTodoList(filter = {}) {  // filter = {} <-- default parameter, თუ არ გადმოვცემთ პარამეტრს, ცარიელი ობიექტი მიენიჭება
    const response = await api.getAll(filter);
    const todos = response.data;
    return todos;
  }

  async _handleItemCreateEvent(event) {
    // debugger;
    const data = event.detail.data;
    const createdItem = await api
      .create(data)
      .catch((err) => this._handleErrors(err));
    if (!createdItem) return;
    console.log("createdItem", createdItem.data);
    this.todos = await this._getTodoList(this.filter);
    this._clearErrors();
  }

  _handleItemSelectEvent(event) {
    const id = event.detail.id;
    this.selectedItem = this.todos.find((item) => item._id === id);
  }

  async _handleItemUpdateEvent(event) {
    const id = event.detail.id;
    const data = event.detail.data;
    const updatedItem = await api
      .update(id, data)
      .catch((err) => this._handleErrors(err));
    if (!updatedItem) return;
    console.log("updatedItem", updatedItem.data);
    this.todos = await this._getTodoList(this.filter);
    this.selectedItem = {};
    this._clearErrors();
  }

  async _handleItemDeleteEvent(event) {
    const id = event.detail.id;
    await api.remove(id);
    this.todos = await this._getTodoList(this.filter);
    this._clearErrors();
  }

  async _handleFilterChangeEvent(event) {
    const filter = event.detail.filter;
    this.filter = filter;
    this.todos = await this._getTodoList(filter);
  }

  _handleErrors(err) {
    console.log("errors", err.response.data);
    this.errors = err.response.data.errors;
    // debugger;
  }

  _clearErrors() {
    this.errors = [];
  }

  render() {
    return html`
      <todo-list
        .list=${this.todos}
        @on-select=${this._handleItemSelectEvent}
        @on-filter-change=${this._handleFilterChangeEvent}
        @on-delete=${this._handleItemDeleteEvent}
      ></todo-list>
      <div>
        <div class="forms">
          <todo-update
            .item=${this.selectedItem}
            @on-update=${this._handleItemUpdateEvent}
          ></todo-update>
          <todo-create @on-create=${this._handleItemCreateEvent}></todo-create>
        </div>
        <todo-errors .errors=${this.errors}></todo-errors>
      </div>
    `;
  }
}

customElements.define("todo-app", TodoApp);
