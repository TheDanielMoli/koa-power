# koa-power [![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/koa-power.svg
[npm-url]: https://www.npmjs.com/package/koa-power

Koa with superpowers! Effortless clustering, CLI logging, response time & colors with Koa.

<p align="center">
  <img src="https://www.sadkit.com/assets/img/koa-power-minimal.png" alt="Koa Power" width="539px" height="217px" />
</p>

## Installation

Install Koa Power with npm:

```
npm install --save koa-power
```

## Usage & Examples

Minimal example - examples/minimal.js

```javascript
const Power = require('koa-power');
const {log} = Power;

const main = app => {
    app.listen(80, () => log(`App listening on port ${'80'.green}.`));
};

Power.load(main);
```

Extended Example - examples/extended.js

```javascript
const Power = require('koa-power');
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
```

In production, usage of [pm2](https://www.npmjs.com/package/pm2) to run your Koa Power app is *strongly recommended*.

## Options

Power options you can use in `Power.load(main, options);`

| Option | Default Value | What it does |
| --- | --- | --- |
| appName | 'Koa Power App' | Sets the app name
| appNameColor | 'italy' | Sets the app name color
| mid | [] | Array of koa middleware
| numWorkers | 2 | Number of workers
| locale | 'en' | moment locale
| enableLog | false | Enable logging to file
| logFileName | appDirectory + '/power.log' | Log filename

## Full Reference

Require Koa Power this way:

```ecmascript 6
const Power = require('koa-power');
```

Now, the exported elements are:

```ecmascript 6
const {load, log, italy, space, name} = Power;
```

Let's see them in detail:

| Element | What it does | Proto |
| --- | --- | --- |
| load | Powers Koa | load(worker, options)
| log | Power logs to console | log(text)
| italy | Colors text as Italian flag | italy(text) / text.italy
| space | Spaces text in a row | space(text, width)
| name | Changes the worker name | name(text)

Power options you can use in `load(main, options);`

| Option | Default Value | What it does |
| --- | --- | --- |
| appName | 'Koa Power App' | Sets the app name
| appNameColor | 'italy' | Sets the app name color
| mid | [] | Array of koa middleware
| numWorkers | 2 | Number of workers
| locale | 'en' | moment locale

*Notice: this package uses [Colors](https://www.npmjs.com/package/colors) internally, which extends the String prototype.*

## Contributing

Feel free to open an Issue or send me a direct message.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Sadkit/koa-power/tags). 

## Authors

* **Daniele Molinari** - [Sadkit](https://github.com/Sadkit)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details.