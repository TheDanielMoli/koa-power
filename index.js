const cluster = require('cluster');
const fs = require('fs');
const isMaster = cluster.isMaster;
const colors = require('colors');
const names = require('human-names');
const moment = require('moment');
const Koa = require('koa');

let processName = 'Master';
let powerLog;
let powerPath;
let powerStream;

// equally space text in a width
let space = (text, width) => {
    if (text.length < width)
        return ' '.repeat(width - text.length) + text;
    else
        return text;
};

// set text color to italy's flag
let italy = str => {
    let out = '';
    let cur = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (char !== ' ')
            switch (cur) {
                case 0:
                    out += char.green;
                    cur++;
                    break;
                case 1:
                    out += char.white;
                    cur++;
                    break;
                case 2:
                    out += char.red;
                    cur = 0;
                    break;
            }
        else
            out += char;
    }
    return out;
};

// set italy's color to string prototype
Object.defineProperty(String.prototype, 'italy', {
    get: function () {
        return italy(this);
    }
});

let name = text => {
    processName = text;
};

let log = args => {
    let out = `[${moment().format('YY-MM-DD H:mm:ss:SSS')}] `.cyan + space(processName, 10).cyan + ` | ${args}\n`;
    if (powerLog) {
        let powerOut = out.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
        powerStream.write(powerOut);
    }
    return process.stdout.write(out);
};

let load = (worker, options) => {
    let config = options || {};
    !config.appName && (config.appName = 'Koa Power App');
    !config.numWorkers && (config.numWorkers = 2);
    !config.mid && (config.mid = []);
    !config.enableLog && (config.enableLog = false);

    let appDirectory = require('path').dirname(process.pkg ? process.execPath : (require.main ? require.main.filename : process.argv[0]));
    !config.logFileName && (config.logFileName = appDirectory + '/power.log');

    powerLog = config.enableLog;
    powerPath = config.logFileName;

    let shouldLineBreak = false;

    powerLog && fs.existsSync(powerPath) && (shouldLineBreak = true);

    powerLog && (powerStream = fs.createWriteStream(powerPath, {flags: 'a'}));

    let numWorkers = config.numWorkers;
    let mid = config.mid;

    // set locale
    moment.locale(config.locale || 'en');

    if (isMaster) {

        powerLog && shouldLineBreak && powerStream.write('\n');

        let workers = {};
        let workerNames = [];

        // output app name
        let out = `${config.appName}`.italy;
        if (config.appNameColor && colors[config.appNameColor]) {
            out = `${config.appName}`[config.appNameColor];
        }
        log(out);

        // forking workers
        log(`Forking ${numWorkers} worker` + (numWorkers !== 1 ? 's' : ''));
        [...Array(numWorkers)].map(_ => cluster.fork());

        // wait for worker to be online and give it a name
        cluster.on('online', (worker) => {
            while (!workers[worker.process.pid]) {
                let maybeName = names.allRandom();
                maybeName.length < 10 && !workerNames.includes(maybeName) && (workers[worker.process.pid] = maybeName);
            }
            workerNames.push(workers[worker.process.pid]);
            worker.send({name:workers[worker.process.pid]});
            log(`Worker ${workers[worker.process.pid]} is online`.green)
        });
        cluster.on('exit', (worker, exitCode) => {
            log(`Worker ${worker.process.id} exited with code ${exitCode}`);
            log(`Starting a new worker`);
            cluster.fork();
        })

    } else {
        // get process name from master
        process.on('message', (msg) => {
            if (msg.name) {
                name(msg.name);
            }
        });

        // init koa app
        const app = new Koa();

        // additional prepended middleware
        mid.forEach(middleware => app.use(middleware));

        // logger
        app.use(async (ctx, next) => {
            log(`${ctx.method} ${ctx.url} - BEGIN`.cyan);
            await next();
            const rt = ctx.response.get('X-Response-Time');
            log(`${ctx.method} ${ctx.url} - END`.cyan + ` ~ ${rt}`);
        });

        // x-response-time
        app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
        });

        // call worker
        worker(app);
    }
};

module.exports = {load, log, italy, space, name};
