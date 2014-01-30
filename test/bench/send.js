var send = require('../../lib/send.js');

function bench(N) {
    console.time('send');
    var code = 0;
    for (var k = 0; k < N; ++k)
        code += send.arguments({hello: 'world'}).code;
    console.timeEnd('send')
    console.log(code);
}


bench(100000)
