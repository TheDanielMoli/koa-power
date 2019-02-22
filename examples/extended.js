const Power = require('..'); // require('koa-power')
const {log} = Power;

let options = {
    appName: 'Lorem Ipsum Dolor Sit Amet',
    appNameColor: 'rainbow',
    mid: [], // Koa middleware array - e.g. [ compress(), bodyParser() ]
    numWorkers: 3,
    enableLog: true
};

const main = app => {
    app.use(ctx => {
        ctx.status = 200;
        ctx.body = 'Hello, world!';
    });

    app.listen(80, () => log(`App listening on port ${'80'.green}.`));
};

Power.load(main, options);