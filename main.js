const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800, 
    height: 600,
    minWidth: 800,
    minHeight: 400,
    frame: false, 
    icon: __dirname + '/img/kit.png'
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})


const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Ready!');
  //console.log(client);
});
client.on('disconnect', () => {
  console.log('Logged out!');
});

global.ping = function(message) {
  console.log("Command detected!");
  try{
    client.channels.get( message.channel.id).send("pong");
  }
  catch(e){
    console.log(e);
  }
}
global.login = function(token) {
  client.login(token);
}
global.logout = function(token) {
  client.destroy();
}
global.leaveVC = function(server , channel) {
  console.log("Received request to leave " + server + " " + channel);
  var voiceChannel = client.guilds.find("name", server).channels.find("name", channel);
  voiceChannel.leave();
}
global.joinVC = function(server , channel) {
  console.log("Received request to connect to " + server + " " + channel);
  var voiceChannel = client.guilds.find("name", server).channels.find("name", channel);
  voiceChannel.join()
    .then(connection => {
      console.log('Connected!');
      global.playFile = function(file) {
        console.log("Playing " + file);
        const dispatcher = connection.playFile(file);
        global.stopPlay = function() {
          dispatcher.end();
        }
      }
    })
    .catch(console.error);
}