const PromisifiedItem = require("./promisifiedItem");

class ImmutableItem extends PromisifiedItem {
  update() {
    throw new Error("Item is immutable");
  }
}

module.exports = ImmutableItem;
