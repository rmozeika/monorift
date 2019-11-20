
const Tail = require('tail').Tail;
 

class tailer {
    constructor() {
        this.tail = new Tail("fileToTail");
        tail.on('line', function(data) {
            console.log(data);
        });
    }
}

module.exports = tailer;