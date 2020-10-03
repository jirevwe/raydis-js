import { Redis } from './index';
var commands = require('redis-commands');

commands.list.forEach(
  (c: string) =>
    (Redis.prototype[c] = function () {
      var arr: any[];
      var len = arguments.length;
      var callback: any;
      var i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0];
        if (len === 2) {
          callback = arguments[1];
        }
      } else if (len > 1 && Array.isArray(arguments[1])) {
        if (len === 3) {
          callback = arguments[2];
        }
        len = arguments[1].length;
        arr = new Array(len + 1);
        arr[0] = arguments[0];
        for (; i < len; i += 1) {
          arr[i + 1] = arguments[1][i];
        }
      } else {
        // The later should not be the average use case
        if (
          len !== 0 &&
          (typeof arguments[len - 1] === 'function' ||
            typeof arguments[len - 1] === 'undefined')
        ) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }

      return this.sendCommand([c, ...arr]);
    })
);
