/* globals Choo html */
const app = new Choo();

function itemStore(state, emitter) {
  state.items = [];
  state.loading = false;

  async function getItems() {
    const response = await fetch(document.location.href + "api/items");
    const data = await response.json();
    return data;
  }

  emitter.on("DOMContentLoaded", async () => {
    emitter.on("refresh", async () => {
      state.loading = true;
      emitter.emit("render");
      const data = await getItems();
      state.items = data.items;
      state.loading = false;
      emitter.emit("render");
    });

    state.loading = true;
    emitter.emit("render");
    const data = await getItems();
    state.items = data.items;
    state.loading = false;
    emitter.emit("render");
  });
}

function list({ items, loading }) {
  if (loading) {
    return html`<p>Loading...</p>`;
  }

  return html`
    <ul>
      ${items.map(
        (item) =>
          html`<li>${item.ItemId} - ${item.CustomData.regular_prices.SM}</li>`,
      )}
    </ul>
  `;
}

function main(state, emit) {
  const { items, loading } = state;
  return html`<body>
    <h1>Lohner's Emporium</h1>
    <button onclick=${() => emit("refresh")} disabled=${loading}>
      Refresh
    </button>
    ${list({ items, loading })}
  </body>`;
}

app.use(itemStore);
app.route("*", main);
app.mount("body");
