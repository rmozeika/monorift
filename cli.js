#!/usr/bin/env node

// let command = require('./command')

// command()
const util = require('util');
const path = require('path');
const fs = require('fs');
const { exec, execFile } = require('child_process');
const execa = util.promisify(require('child_process').exec);
// exec('ls | grep js', (err, stdout, stderr) => {
//   if (err) {
//     //some err occurred
//     console.error(err)
//   } else {
//    // the *entire* stdout and stderr (buffered)
//    console.log(`stdout: ${stdout}`);
//    console.log(`stderr: ${stderr}`);
//   }
// });
let args = process.argv.slice(2)
if (args.length == 0) {
    // exec('')
    // return
    args = ['start']
}
const isDockerContainersRunning = async () => {
    const psCmd = await execa(' docker ps --filter "label=com.monorift.app=monorift" --quiet', [])
    const { error, stdout, stderr } = psCmd;
    if (!stdout) {
        return false;
    }
    const runningContainers = stdout.match(/[a-z0-9]+\n/g);
    if (runningContainers.length == 3) {
        return true
    }
    if (runningContainers.length > 1) {
        return true 
        //  not all running though, need to change this
    }
    return false;
}
const composeUp = async () => {
    await goToPath();
    process.chdir('./packages/devops/docker/');
    // async function lsExample() {
    //     const { stdout, stderr } = await execa('ls');
    //     console.log('stdout:', stdout);
    //     console.error('stderr:', stderr);
    //   }
    const prcs = await execa('docker-compose up', ["-d"]);
    const { error, stdout, stderr } = prcs
     console.log(stdout);
}
const composeDown = async () => {
    await goToPath();
    process.chdir('./packages/devops/docker/');
    // async function lsExample() {
    //     const { stdout, stderr } = await execa('ls');
    //     console.log('stdout:', stdout);
    //     console.error('stderr:', stderr);
    //   }
    const prcs = await execa('docker-compose down', []);
    const { error, stdout, stderr } = prcs
     console.log(stdout);
}
async function isMonorift() {
    const isMonorift = pwd.stdout.match(/monorift\/.+/);
    if (isMonorift.length > 0) {
        const prcs = await execa('touch .temp && chmod +xrw .temp && echo "echo \$(pwd)" > .temp');
        const test = await execa('pwd');
        const testFile = await exaca('.temp')
        prcs.chdir('~/Development/monorift/');
    }
    console.log(pwd)
}

async function goToPath() {
    var lib  = path.join(path.dirname(fs.realpathSync(__filename)));
    process.chdir(lib)
}
const argInterface = {
    main: {
        cm: {
            name: 'commit',
            val: 'cm',
            func: async () => {
                console.log('test')
                const child = execFile('./.bin/mr.sh', ['cm'], (error, stdout, stderr) => {
                    if (error) {
                        throw error;
                    }
                    console.log(stdout);
                });
            }
        },
        start: {
            name: 'start',
            val: 'start',
            func: async () => { 
                const isRunning = await isDockerContainersRunning();
                if (isRunning) {
                    console.log('Run \n$ monorift stop\n')
                    const compose = await composeDown();
                } else {
                    const compose = await composeUp();
                }                
            }
        },
        stop: {
            name: 'stop',
            val: 'stop',
            func: async () => { 
                const isRunning = await isDockerContainersRunning();
                if (isRunning) {
                    console.log('Killing containers\n')
                    const compose = await composeDown();
                } else {
                    console.log('Monorift has not been started\n Run monorift start')
                }
            }
        },
        test: {
            name: 'test',
            val: 'test',
            func: async () => {
                var lib  = path.join(path.dirname(fs.realpathSync(__filename)));
                console.log(lib)
            }
        },
        logs: {
            val: 'logs',
            func: async ([]) => {

            }
        }
    }
}

const [ mainArg, ...otherArgs ] = args;
const cmd = argInterface.main[mainArg]
if (!cmd) {
    console.log( `no known argument: ${mainArg}`)
    return
}
const { func } = cmd
func([ ...args]);
console.log('done')
// const child = execFile('./.bin/mr.sh', ['cm'], (error, stdout, stderr) => {
//     if (error) {
//       throw error;
//     }
//     console.log(stdout);
//   });
// const myShellScript = exec('sh doSomething.sh /myDir');
// myShellScript.stdout.on('data', (data)=>{
//     console.log(data); 
//     // do whatever you want here with data
// });
// myShellScript.stderr.on('data', (data)=>{
//     console.error(data);
// }) ;