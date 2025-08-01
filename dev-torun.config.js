const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/** @type {import('@zr-lib/dev-torun/jsTypes/config.types.js').DevToRunConfig} */
module.exports = {
  listen_dir: './src/',
  task_delay: 5,
  task_cmd: npmCmd + ' run build:stg',
  task_done: () => {
    console.log(`\n🚀 task_done. ${new Date().toLocaleString()}\n`);
  },
};
