var ws = require("nodejs-websocket");
var PORT = 8888;
var server = ws.createServer(function(conn) {
    console.log("new connection")

    conn.on("text", function(str) {
        console.log("received " + str)
        conn.sendText(str)
    })

    conn.on("close", function(code, reason) {
        console.log("connection closed")
    })

    conn.on("error", function(err) {
        console.log(err)
    })
}).listen(PORT)

console.log("server is running on port: " + PORT)