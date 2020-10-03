import { Socket } from 'net';
import RedisParser from 'redis-parser';
import { commandToBuffer, RedisOperation } from './operation';

export class Redis {
  private socket: Socket;
  private bufCrlf = Buffer.from('\r\n', 'ascii');
  private options = {
    host: '127.0.0.1',
    port: 6379
  };

  private commands: Array<RedisOperation> = [];
  private ERROR_CODES = ['EALREADY', 'EPIPE', 'ECONNREFUSED'];
  private ready = false;
  private parser: RedisParser;

  constructor() {
    this.parser = new RedisParser({
      returnReply: (res: string) => {
        const operation = this.commands[0];
        operation.addResponse(res);
        if (operation.completed) this.commands.shift();
      },
      returnError: (err: Error) => {
        const operation = this.commands[0];
        operation.addError(err);
        if (operation.completed) this.commands.shift();
      }
    });
  }

  private async connect() {
    this.socket = new Socket();

    const connection = this.socket.connect(this.options);

    connection.on('ready', () => {
      this.ready = true;
      console.log('connected to server!');
    });

    connection.on('data', (data) => this.parser.execute(data));

    connection.on('end', () => {
      console.log('disconnected from server');
    });

    connection.on('error', async (err) => {
      const operation = this.commands.shift();
      operation.reject(err);

      if (this.ERROR_CODES.includes(err['code'])) {
        this.ready = false;
        await this.reconnect();
      }
    });
  }

  async sleep(duration = 1000) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  private async reconnect() {
    while (true) {
      if (this.ready) break;
      await this.sleep();

      this.socket.removeAllListeners();
      this.socket.destroy();
      await this.connect();
    }
  }

  write(buffer: Buffer) {
    if (this.ready) this.socket.write(Buffer.concat([buffer, this.bufCrlf]));
  }

  async createClient() {
    await this.connect();
  }

  //@ts-ignore
  private sendCommand(commands: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      this.commands.push(new RedisOperation(resolve, reject));
      const buffer = commandToBuffer(commands);
      this.socket.write(buffer);
    });
  }
}

import './commands';
