var ws = require("nodejs-websocket");
var PORT = 8888;

var clientCount = 0; //客户端数量

var server = ws.createServer(function(conn) {
    //每一次新的连接，clientCount加1
    console.log("new connection")
    clientCount++;
    conn.username = "user" + clientCount; //给每个连接设置不同的username属性
    broadcast(conn.username + "is coming in"); //给每个客户端都广播一下有新的连接进入
    conn.on("text", function(str) { //接收到消息的时候
        console.log("received " + str)
        broadcast(str)
    })

    conn.on("close", function(code, reason) {
        console.log("connection closed");
        broadcast(conn.username + "is leaving")
    })

    conn.on("error", function(err) {
        console.log(err)
    })
}).listen(PORT)

console.log("server is running on port: " + PORT);

function broadcast(str) {
    server.connections.forEach(function(connection) {
        connection.sendText(str)
    })
}