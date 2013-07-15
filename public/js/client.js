var actions, client, currentRoom, game, nickname, socket;

socket = io.connect('http://localhost:8080/');

nickname = 'Rapha';

currentRoom = !window.location.hash ? 1 : void 0;

client = {};

game = {};

actions = {};

actions.ATTACK = "attack";

client.connect = function(nickname, currentRoom) {
  return socket.emit('connect', {
    nickname: nickname,
    room: currentRoom
  });
};

client.attack = function(angle, force) {
  return socket.emit('gameAction', {
    room: currentRoom,
    action: actions.ATTACK,
    angle: angle,
    force: force
  });
};

client.connect(nickname, currentRoom);

socket.on('ready', function(data) {
  return console.log("Ready");
});

socket.on('gameAction', function(data) {
  if (data.action === actions.ATTACK) {
    return game.attack(data.angle, data.force);
  }
});
