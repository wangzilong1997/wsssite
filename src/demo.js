const os = require('os');


const total = os.totalmem();
console.log(total/1024/1024/1024)

const free = os.freemem();

console.log(free/1024/1024/1024);