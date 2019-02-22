const Power = require('..'); // require('koa-power')
const {log} = Power;

const main = app => {
    app.listen(80, () => log(`App listening on port ${'80'.green}.`));
};

Power.load(main);