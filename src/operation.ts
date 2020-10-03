/**
 * Redis Operation
 * @param {Function} resolve - Callback to run when resolved
 * @param {Function} reject - Callback to run when rejected
 */
export class RedisOperation {
  resolve: Function;
  reject: Function;
  completed: boolean;

  constructor(resolve: Function, reject: Function) {
    this.resolve = resolve;
    this.reject = reject;
    this.completed = false;
  }

  /**
   * Add and resolve response
   * @param {string} res - Response
   */
  addResponse(res: string) {
    this.resolve(res);
    this.completed = true;
  }

  /**
   * Add and reject error
   * @param {Error} err - Error
   */
  addError(err: Error) {
    this.reject(err);
    this.completed = true;
  }
}

const bufStar = Buffer.from('*', 'ascii');
const bufDollar = Buffer.from('$', 'ascii');
const bufCrlf = Buffer.from('\r\n', 'ascii');

/**
 * Convert a command - an array of arguments to buffer
 * @param {any[]} command - Command as an array of arguments
 * @return {Buffer}
 */
export function commandToBuffer(command: string[]): Buffer {
  const bufArgCount = Buffer.from(String(command.length), 'ascii');
  return Buffer.concat([
    bufStar,
    bufArgCount,
    bufCrlf,
    ...command.map(argToBuffer)
  ]);
}

/**
 * Convert an argument to buffer
 * @param {an} arg - Argument
 * @return {Buffer}
 */
function argToBuffer(arg: string): Buffer {
  if (arg === null || arg === undefined) arg = '';
  const bufArg = Buffer.from(String(arg), 'ascii');
  const bufByteLength = Buffer.from(String(bufArg.length), 'ascii');
  return Buffer.concat([bufDollar, bufByteLength, bufCrlf, bufArg, bufCrlf]);
}
