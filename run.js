const { Redis } = require('./dist/index');

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
