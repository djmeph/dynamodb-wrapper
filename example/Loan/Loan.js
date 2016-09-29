var Item = require("../../lib/item");
var joi = require('joi');
var async = require('async');

/* require this file if you already have the json of the database item (So basically in the onboard route only, when we create the loan object) */
/* Hooks which operate using extensions could be defined in this file. */
class Loan extends Item {
    constructor(json) {
        super({
            attrs: json,
            model: require("./TableDefinition"),
            itemConstructor: Loan
        });
    }
    // Extensions are just functions
    getFoo(foo) {
        return 'Hi, ' + "foo" + '!';
    }
}

module.exports = Loan;