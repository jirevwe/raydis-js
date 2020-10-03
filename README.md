# Raydis

A minimalistic Redis client using modern Node.js

# Motivation

The goal is to write a minimal Redis client that:

- Targets modern versions of Node.js: LTS and stable.
- Uses Promises from the beginning.
- Written in TypeScript.
- Learning about the internals of different redis clients.

# Features

- Automatic reconnection
- Async/Sync operation

# Usage

```node
import { Redis } from 'raydis'

(async () => {
  const redis = new Redis();
  await redis.createClient();

  for (let i = 0; i < 100; i++) {
    await redis.sleep(1000);

    console.log(await redis.set('run', new Date()));
    console.log(await redis.get('run'));

    console.log(
      await redis.hset(
        'game',
        'gameboy',
        JSON.stringify({ name: 'gameboy', level: 3000 })
      )
    );
    console.log(JSON.parse(await redis.hget('game', 'gameboy')));
  }
})();
```

## Credits

Raydis is inspired [djanowski/yoredis](https://github.com/djanowski/yoredis) and [NodeRedis/node-redis](https://github.com/NodeRedis/node-redis). Many thanks to all the people who worked on these libraries.
