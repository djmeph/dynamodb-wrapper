let async = require("async");
const DB       = require('lib');
const chai     = require('chai');
const expect   = chai.expect;
const assert   = chai.assert;
const sinon    = require("sinon");

describe('Item::', function() {
    let Item       = DB.item;
    let mockSchema;
    let TestTableItem;
    let sandbox;
    let createStub;
    let updateStub;
    let deleteStub;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        mockSchema = {};
        mockSchema.create = function() {};
        createStub = sandbox.stub(mockSchema, "create");
        createStub.callsArg(1);
        mockSchema.update = function() {};
        updateStub = sandbox.stub(mockSchema, "update");
        updateStub.callsArg(2);
        mockSchema.delete = function() {};
        deleteStub = sandbox.stub(mockSchema, "delete");
        deleteStub.callsArg(1);
        class TableItem extends Item {
            constructor(json) {
                super({
                    attrs: json,
                    schema: mockSchema
                });
            }
            getFoo(foo) {
                return 'Hello, ' + "foo" + '!';
            }
            extensionWorks() {
                return true;
            }
        }
        TestTableItem = TableItem;
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe("combination", function() {
        it("Should work after set/create/set/update/set", function(done) {
            let id = getUniqueId();
            let rec = new TestTableItem({
                hashKey  : id,
                rangeKey : "2",
                foo : "abc",
                personalInformation: {
                    firstName: 'John'
                }
            });
            async.series([
                (next) => {
                    rec.set("rangeKey", 3);
                    expect(rec.get("rangeKey")).to.equal(3);
                    rec.create(next);
                },
                (next) => {
                    expect(rec.get("rangeKey")).to.equal(3);
                    rec.set("rangeKey", 4);
                    expect(rec.get("rangeKey")).to.equal(4);
                    rec.update(next);
                },
                (next) => {
                    expect(rec.get("rangeKey")).to.equal(4);
                    rec.set("rangeKey", 5);
                    expect(rec.get("rangeKey")).to.equal(5);
                    return next();
                }
            ], done);
        });
    });

    describe("get", function() {
        it('Should be able to retain fields that were previously set', (done) => {
            let id = getUniqueId();
            let rec = new TestTableItem({
                hashKey  : id,
                rangeKey : "2",
                foo : "abc",
                personalInformation: {
                    firstName: 'John'
                }
            });

            rec.set("personalInformation.firstName", "__MODIFIED");
            expect(rec.get("personalInformation.firstName")).to.equal("__MODIFIED");

            expect(rec.get("hashKey")).to.equal(id);
            return done();
        });
    });

    describe("create", function() {
        it('Should be the same rec before and after create', (done) => {
            let id = getUniqueId();
            let rec = new TestTableItem({
                hashKey  : id,
                rangeKey : "2",
                foo : "abc",
                personalInformation: {
                    firstName: 'John'
                }
            });


            let uniqueReference = {a: true};
            rec.uniqueReference = uniqueReference;
            rec.set("personalInformation.firstName", "__MODIFIED");

            rec.create((err) => {
                assert(!err);
                expect(rec.uniqueReference).to.equal(uniqueReference);
                expect(rec.get("personalInformation.firstName")).to.equal("__MODIFIED");
                return done();
            });
        });
    });

    describe("Update", function() {
        it('Should be the same rec before and after update', (done) => {
            let id = getUniqueId();
            let rec = new TestTableItem({
                hashKey  : id,
                rangeKey : "2",
                foo : "abc",
                personalInformation: {
                    firstName: 'John'
                }
            });


            let uniqueReference = {a: true};
            rec.uniqueReference = uniqueReference;
            rec.set("personalInformation.firstName", "__MODIFIED");

            rec.update((err) => {
                assert(!err);
                expect(rec.uniqueReference).to.equal(uniqueReference);
                expect(rec.get("personalInformation.firstName")).to.equal("__MODIFIED");
                return done();
            });
        });
    });

    describe("Add", function() {
        it('Should work', (done) => {
            let id = getUniqueId();
            let rec = new TestTableItem({
                hashKey  : id,
                rangeKey : "2",
                foo : "abc",
                personalInformation: {
                    firstName: 'John'
                }
            });

            rec.add("rangeKey", "1");

            rec.update((err) => {
                assert(!err);
                expect(rec.get("rangeKey")).to.equal(3);
                return done();
            });
        });
    });

    describe("Append", function() {
        it('Should work', (done) => {
            let id = getUniqueId();
            let rec = new TestTableItem({
                hashKey  : id,
                rangeKey : "2",
                foo : [],
                personalInformation: {
                    firstName: 'John'
                }
            });

            rec.append("foo", "1");

            rec.update((err) => {
                assert(!err);
                expect(rec.get("foo")).to.deep.equal(["1"]);
                return done();
            });
        });
    });

    describe("Remove", function() {
        it('Should work', (done) => {
            let id = getUniqueId();
            let rec = new TestTableItem({
                hashKey  : id,
                rangeKey : "2",
                foo : "abc",
                personalInformation: {
                    firstName: 'John'
                }
            });

            rec.remove("foo");

            rec.update((err) => {
                assert(!err);
                expect(rec.get().hasOwnProperty("foo")).to.equal(false);
                expect(rec.get().hasOwnProperty("personalInformation")).to.equal(true);
                return done();
            });
        });
    });
});

let uniqueId = 1;
function getUniqueId() {
    return "" + uniqueId++;
}