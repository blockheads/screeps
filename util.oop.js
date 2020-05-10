/**
 * OOP related helpers, for my screeps code.
 */

 var OopUtil = {
    extendClass: function (base, extra) {
        let descs = Object.getOwnPropertyDescriptors(extra.prototype);
        delete descs.constructor;
        Object.defineProperties(base.prototype, descs);
    }
 }

 module.exports = OopUtil;