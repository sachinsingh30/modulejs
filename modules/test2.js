$.create("testmoduleE", ["test1"], function (modules) {
    this.hello = modules.testmoduleA.hello;
}, true);

$.create("testmoduleF", ["test1"], function (modules) {
    this.hello = modules.testmoduleB.hello;
}, true);

$.create("testmoduleG", ["test1"], function (modules) {
    this.hello = modules.testmoduleC.hello;
}, true);

$.create("testmoduleH", ["test1"], function (modules) {
    this.hello = modules.testmoduleD.hello;
}, true);