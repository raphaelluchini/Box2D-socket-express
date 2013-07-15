var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = 8080,
    publicDir = '/public/';
    // hash object to save clients data,
    // { socketid: { clientid, nickname }, socketid: { ... } }
    clients = {};

server.listen(port);

app.use("/css", express.static(__dirname + publicDir + 'css'));
app.use("/js", express.static(__dirname + publicDir + 'js'));
app.use("/images", express.static(__dirname + publicDir + 'images'));
app.use("/libs", express.static(__dirname + publicDir + 'libs'));


app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

io.set('log level', 2);
io.set('transports', ['websocket', 'xhr-polling']);

io.sockets.on('connection', function(socket) {

    socket.on('connect', function(data) {
        connect(socket, data);
    });

    socket.on('gameAction', function(data) {
        gameAction(socket, data);
    });

    socket.on('disconnect', function() {
        disconnect(socket);
    });
});

// create a client for the socket
function connect(socket, data) {
    data.clientId = generateId();
    clients[socket.id] = data;
    socket.emit('ready', {
        clientId: data.clientId
    });
    socket.join(data.room);
}

function disconnect(socket) {
    var rooms = io.sockets.manager.roomClients[socket.id];
    delete clients[socket.id];
}

var actions = {};
actions.ATTACK = "attack";
actions.SET_POSITION = "setPosition";
actions.SET_WIND = "setWind";

function gameAction(socket, data) {
	if (data.action === actions.ATTACK) {
		socket.broadcast.to(data.room).emit('gameAction', {
			client: clients[socket.id],
			room: data.room,
			action: data.action,
			angle: data.angle,
			force: data.force
		});
		console.log("Attack =>", data);
	} else if (data.action === actions.SET_POSITION) {
		//return game.setPosition(data.x);
	} else if (data.action === actions.SET_WIND) {
		//return game.setWind(data.angle, data.force);
	}
}

// unique id generator
function generateId() {
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
console.log('Game is running and listening to port %d...', port);