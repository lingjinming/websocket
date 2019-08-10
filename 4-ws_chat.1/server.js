var ws = require("nodejs-websocket");
var PORT = 8888;
var TYPE_ENTER = 0; //进入
var TYPE_LEAVE = 1; //离开
var TYPE_MSG = 2; //正常
var clientCount = 0; //客户端数量

var server = ws.createServer(function(conn) {

    clientCount++; //每一次新的连接，clientCount加1
    console.log("new connection,当前在线数量:" + clientCount)
    conn['username'] = "用户" + clientCount; //给每个连接设置不同的username属性

    //给每个客户端都广播一下有新的连接进入
    broadcast({
        type: TYPE_ENTER,
        msg: conn['username'] + "is coming in",
        time: new Date().toLocaleTimeString()
    });

    // 接收到某个客户端消息的时候
    conn.on("text", function(str) {
        console.log('received::' + str)

        broadcast({
            type: TYPE_MSG,
            msg: conn['username'] + "says: " + str,
            time: new Date().toLocaleTimeString()
        });
    })

    // 连接断开
    conn.on("close", function(code, reason) {
        clientCount--; //每一次新的连接，clientCount减1
        console.log("connection closed,当前在线数量:" + clientCount);
        broadcast({
            type: TYPE_LEAVE,
            msg: conn['username'] + "is leaving",
            time: new Date().toLocaleTimeString()
        }); //告诉所有人有人离开了
    })

    // 连接错误
    conn.on("error", function(err) {
        console.log(err)
    })
}).listen(PORT)

console.log("server is running on port: " + PORT);

function broadcast(data) {
    // 所有连接connections
    server.connections.forEach(function(connection) {
        connection.sendText(JSON.stringify(data)) //只允许发送字符串
    })
}