const fetch = require("node-fetch");
const getAuth = require("./authentication.js");

const API_ENDPOINT = "https://5107.playfabapi.com/Client/GetStoreItems";

module.exports = async function () {
  try {
    const authorization = await getAuth();
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        StoreId: "Store",
      }),
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": authorization,
      },
    });
    const data = await response.json();
    return data.data.Store;
  } catch (error) {
    return { error: true, whatHappened: error };
  }
};
