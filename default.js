(function () {
  lLog("Creating variables...");
  //VARIABLES
  var totalpresets = 1;
  var totalprompts = 1;
  var totalsounds = 1;
  lLog("Loading dependencies...");
  try {
      lLog(require.resolve("discord.js"));
  } catch(e) {
      lLog(e.message);
  }
  const Discord = require("discord.js");
  lLog("Discord.js loaded!");
  const client = new Discord.Client();
  lLog("Discord.js client created!");
  const shell = require('electron').shell;
  lLog("Electron shell loaded!");
  const remote = require('electron').remote;
  lLog("Electron remote loaded");
  var jsonfile = require('jsonfile');
  lLog("Jsonfile loaded");
  var fs = require('fs');
  lLog("Filesystem loaded");
  //first time login check and display changelog

  var appInfo;
  var appSettings;
  try{
    appInfo = require("./jsondata/data.json");
  }
  catch(e){
    sLog(e);
    if (exists("./resources")) { appInfo = require('./resources/app/jsondata/data.json'); }
  }
  try{
    appSettings = require("./jsondata/config.json");
  }
  catch(e){
    sLog(e);
    if (exists("./resources")) { appSettings = require('./resources/app/jsondata/config.json'); }
  }

  document.getElementById("nav-brand").innerHTML = "Bot Toolkit v" + appInfo.version;
  textAbout = textAbout.replace("{version}", appInfo.version);
  textChangelog = textChangelog.replace("{version}", appInfo.version);
  document.title += appInfo.version;

  var logcheck = './jsondata/data.json';
  if (exists("./resources")) { logcheck = './resources/app/jsondata/data.json'; }
  lLog("Checking login file...");
  jsonfile.readFile(logcheck, function(err, obj) {
    if (err) { sLog(err); }
    else{
      if (obj.seen==0) {
        createPrompt("Changelog", textChangelog);
        jsonfile.writeFile(logcheck, { "seen":1, "version":obj.version }, function (err) {
          if (err) { sLog(err); }
        });
      }
    }
  });
  //LOGIN
  document.getElementById("login").addEventListener("click", function (e) {
    sLog("Attempting login...");
    wLog("Attempting login...");
    if (document.getElementById("token").value=="") {
      createPrompt("Error", "Please enter a valid token in the input field!");
      sLog("Error: Token empty...");
      wLog("Error: Token empty...");
      return;
    }
    login(document.getElementById("token").value);
  });
  //LOGOUT
  document.getElementById("logout").addEventListener("click", function (e) {
    sLog("Attempting logout...");
    wLog("Attempting logout...");
    logout();
  });
  //MESSAGE SEND
  document.getElementById("sendmsg").addEventListener("click", function (e) {
    sLog("Sending message...");
    if (document.getElementById("message-to").value==1) {
      //sending to channel
      wLog(`Sending ${document.getElementById("msg").value} to ${document.getElementById("channel").value} in ${document.getElementById("server").value}...`);
      var channel = client.guilds.find("name", document.getElementById("server").value).channels.find("name", document.getElementById("channel").value);
      client.channels.get(channel.id).send(document.getElementById("msg").value).then(function() {
          sLog("Message sent!");
          wLog("Message sent!");
        }, function(err) {
          sLog("Error sending message: " + err);
      });
    }
    else{
      //sending to user
      wLog(`Sending ${document.getElementById("msg").value} to ${client.users.find("id", document.getElementById("dmid").value).username}...`);
      client.users.find("id", document.getElementById("dmid").value).send(document.getElementById("msg").value).then(function() {
          sLog("Message sent!");
          wLog("Message sent!");
        }, function(err) { sLog("Error sending message: " + err); });
    }
  });
  //RICH TEXT EDITOR
  document.getElementById("formatBold").addEventListener("click", function (e) { wrapText('msg','**','**'); });
  document.getElementById("formatItalic").addEventListener("click", function (e) { wrapText('msg','*','*'); });
  document.getElementById("formatUnderline").addEventListener("click", function (e) { wrapText('msg','__','__'); });
  document.getElementById("formatStrike").addEventListener("click", function (e) { wrapText('msg','~~','~~'); });
  document.getElementById("olBox").addEventListener("click", function (e) { wrapText('msg','`','`'); });
  //CODE PROMPT
  document.getElementById("formatBox").addEventListener("click", function (e) {
    document.getElementById("codeprompt").style.display = 'block';
  });
  document.getElementById("closecodebg").addEventListener("click", function (e) {
    document.getElementById("codeprompt").style.display = 'none';
    document.getElementById("codetype").options.selectedIndex = 0;
  });
  document.getElementById("dismisscodeprompt").addEventListener("click", function (e) {
    document.getElementById("codeprompt").style.display = 'none';
    document.getElementById("codetype").options.selectedIndex = 0;
  });
  document.getElementById("addcodep").addEventListener("click", function (e) {
    document.getElementById("codeprompt").style.display = 'none';
    wrapText('msg', "\n```" + document.getElementById("codetype").value + "\n","\n```\n");
    document.getElementById("codetype").options.selectedIndex = 0;
  });
  document.getElementById("create-sound-sb").addEventListener("click", function (e) {
    createBoard("","");
  });
  //ABOUT PROMPT
  document.getElementById("about-page").addEventListener("click", function (e) {
    createPrompt("About", textAbout);
  });
  document.getElementById("how-to-use").addEventListener("click", function (e) {
    createPrompt("What am i looking at?", textHelp);
  });
  //CHANGELOG PROMPT
  document.getElementById("changelog-data").addEventListener("click", function (e) {
    createPrompt("Changelog", textChangelog);
  });
  //MENTION USER
  document.getElementById("mentionuser").addEventListener("click", function (e) {
    document.getElementById("mentionprompt").style.display = 'block';
  });
  document.getElementById("closementionbg").addEventListener("click", function (e) {
    document.getElementById("mentionprompt").style.display = 'none';
    document.getElementById("mentionid").value = "";
  });
  document.getElementById("dismissmentionprompt").addEventListener("click", function (e) {
    document.getElementById("mentionprompt").style.display = 'none';
    document.getElementById("mentionid").value = "";
  });
  document.getElementById("addmention").addEventListener("click", function (e) {
    document.getElementById("mentionprompt").style.display = 'none';
    wrapText('msg', "<@" + document.getElementById("mentionid").value + ">",'');
    document.getElementById("mentionid").value = "";
  });
  //SAVE GUILD DATA SETTINGS
  document.getElementById("gd-setSettings").addEventListener("click", function (e) {
    const foundGuild = client.guilds.find("name", document.getElementById("gd-server").value);
    if (document.getElementById("botnick").value!="") {
      sLog("Setting nickname...");
      wLog(`Setting bot's nickname as ${document.getElementById("botnick").value}`);
      foundGuild.members.get(client.user.id).setNickname(document.getElementById("botnick").value).then(function() {
          sLog("Nick set!");
        }, function(err) {
          sLog("Nick not set: " + err);
      });
    }
  });
  //SAVE SETTINGS
  document.getElementById("setSettings").addEventListener("click", function (e) {
    if (document.getElementById("botname").value!="") {
      sLog("Setting username...");
      wLog(`Setting bot's username as ${document.getElementById("botname").value}`);
      client.user.setUsername(document.getElementById("botname").value).then(function() {
          sLog("Name set!");
        }, function(err) {
          sLog("Name not set: " + err);
      });
    }
    if (document.getElementById("botgame").value!="") {
      sLog("Setting game...");
      document.getElementById("consoleoutput").innerHTML += "Setting bot's game as \"" + document.getElementById("botgame").value + "\"<br>";
      client.user.setGame(document.getElementById("botgame").value).then(function() {
          sLog("Game set!");
        }, function(err) {
          sLog("Game not set: " + err);
      });
    }
    if (document.getElementById("botPic").value!="") {
      sLog("Setting image...");
      client.user.setAvatar(document.getElementById("botPic").value).then(function() {
          sLog("Image set!");
        }, function(err) {
          sLog("Image not set: " + err);
      });
    }
    //BROKEN?
    /*
    client.user.setPresence({game: { name: document.getElementById("botgame").value, type: 0 }}).then(function() {
        document.getElementById("status").innerHTML = "Game set!";
      }, function(err) {
        document.getElementById("status").innerHTML = "Game not set: " + err;
    });*/
    if (document.getElementById("botstatus").value!="") {
      sLog("Setting status...");
      document.getElementById("consoleoutput").innerHTML += "Setting bot's status as \"" + document.getElementById("botstatus").value + "\"<br>";
      client.user.setStatus(document.getElementById("botstatus").value).then(function() {
          sLog("Status set!");
        }, function(err) { sLog( "Status not set: " + err); });
    }
    sLog("Changes saved!");
  });
  //TEST AREA

  document.getElementById("v-join").addEventListener("click", function (e) {
    
    
    var vserv = document.getElementById("v-server").value;
    var vchan = document.getElementById("v-channel").value;
    wLog("Connecting to " + vserv + " " + vchan);
    remote.getGlobal("joinVC")(vserv, vchan);
    //wLog(voiceChannel);
    /*
    voiceChannel.join().then(connection =>
    {
      wLog("Channel joined!");
    }*/
  });
  document.getElementById("v-leave").addEventListener("click", function (e) {
    var vserv = document.getElementById("v-server").value;
    var vchan = document.getElementById("v-channel").value;
    wLog("Leaving " + vserv + " " + vchan);
    remote.getGlobal("leaveVC")(vserv, vchan);

  });
  document.getElementById("v-play").addEventListener("click", function (e) {
    wLog("Playing" + document.getElementById("v-file").value);
    remote.getGlobal("playFile")(document.getElementById("v-file").value);
  });
  document.getElementById("v-stop").addEventListener("click", function (e) {
    remote.getGlobal("stopPlay")();
  });
  //SOUNDBOARD SAVING
  document.getElementById("v-save").addEventListener("click", function (e) {
    createBoard("", document.getElementById("v-file").value);
  });




  //ADD PRESET
  document.getElementById("addpreset").addEventListener("click", function (e) {
    if (document.getElementById("preset-tt").value=="1") {
      createPreset("1", "", "", "", "", "");
    }
    else{
      createPreset("0", "", "", "", "", "");
    }
  });
  document.getElementById("savepres").addEventListener("click", function (e) {
    //1 = channel, 2 == user
    if (document.getElementById("message-to").value == '1') {
      createPreset("1", "", "", document.getElementById("server").value, document.getElementById("channel").value, document.getElementById("msg").value);
    }
    else{
      createPreset("0", "", document.getElementById("dmid").value, "", "", document.getElementById("msg").value);
    }
  });
  //MESSAGE TYPE SELECTOR
  document.getElementById("message-to").addEventListener("change", function (e) {
    if(document.getElementById("message-to").value == '1'){
        document.getElementById("m-type1").style.display = "block";
        document.getElementById("m-type2").style.display = "none";
    }
    else{
        document.getElementById("m-type1").style.display = "none";
        document.getElementById("m-type2").style.display = "block";
    }
  });
  //INVITE
  document.getElementById("invite").addEventListener("click", function (e) {
    shell.openExternal(`https://discordapp.com/oauth2/authorize?&client_id=${document.getElementById("botid").value}&scope=bot&permissions=${document.getElementById("perms").value}`);
  });
  //OTHER LINKS
  var allLinks = document.querySelectorAll('a');
  for (var i = 0; i < allLinks.length; i++) {
    allLinks[i].addEventListener('click', function(event) {
      if (this.href!="" && this.id != "export-btn") {
        event.preventDefault();
        shell.openExternal(this.href);
      }
    });
  }
  //PERMISSION CALCULATOR REDIRECT
  document.getElementById("redirPerms").addEventListener("click", function (e) {
    shell.openExternal('https://discordapi.com/permissions.html');
  });
  //INVITE LINK COPY
  document.getElementById("inviteLink").addEventListener("click", function (e) {
    copyToClipboard(`https://discordapp.com/oauth2/authorize?&client_id=${document.getElementById("botid").value}&scope=bot&permissions=${document.getElementById("perms").value}`);
  });
  //CONSOLE LOG COPY
  document.getElementById("consoleoutput").addEventListener("click", function (e) {
    copyToClipboard(document.getElementById("consoleoutput").innerHTML);
  });
  //CONFIG IMPORT
  function onChange(event) {
      var reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.readAsText(event.target.files[0]);
  }
  function exists(path){
      try{fs.accessSync(path);} catch (err){return false;}
      return true;
  }
  function onReaderLoad(event){
      console.log(event.target.result);
      var obj = JSON.parse(event.target.result);
      var finaldir = './jsondata/config.json';
      if (exists("./resources")) {finaldir = './resources/app/jsondata/config.json';}
      jsonfile.writeFile(finaldir, obj, function (err) {
        if (err) { sLog(err); }
        else{ sLog("Config imported"); }
      });
  }
  document.getElementById('upload').addEventListener('change', onChange);
  //CONFIG SAVING
  document.getElementById("saveconf").addEventListener("click", function (e) {
    sLog("Searching presets...");
    sLog(`Found ${document.getElementsByClassName("presetnode").length} presets`);
    var myObj = { "token": document.getElementById("token").value, 
                  "prefix": document.getElementById("commandPrefix").value, 
                  "rate":  document.getElementById("pingRate").value, 
                  "presets":[], "sounds":[] };
    for (var i = 0; i < document.getElementsByClassName("presetnode").length; i++) {
      sLog("Selecting preset data...");
      var presetData = document.querySelectorAll("[data-parent='"+document.getElementsByClassName("presetnode")[i].getAttribute('data-presetid')+"']");
      var presetType = document.getElementsByClassName("presetnode")[i].getAttribute('data-type');
      var presetName = presetData[0].innerHTML;
      sLog("Setting preset variables...");
      var presetUser = ""; var presetServer = ""; var presetChannel = ""; var presetMessage = "";
      if (presetType=="0") { 
        presetUser = presetData[1].value;
        presetMessage = presetData[2].value;
      }
      else{
        presetServer = presetData[1].value;
        presetChannel = presetData[2].value;
        presetMessage = presetData[3].value;
      }
      sLog("Creating preset object...");
      var myObj2 = { "type": presetType, "name": presetName, "user": presetUser, "server": presetServer, "channel": presetChannel, "message": presetMessage};
      myObj.presets.push(myObj2);
    }
    //ADD SOUNDS
    for (var i = 0; i < document.getElementsByClassName("soundnode").length; i++) {
      sLog("Selecting sound data...");
      var soundData = document.querySelectorAll("[data-parent-s='"+document.getElementsByClassName("soundnode")[i].getAttribute('data-soundid')+"']");
      sLog("Creating preset object...");
      var myObj2 = { "name": soundData[0].innerHTML, "path": soundData[1].value};
      myObj.sounds.push(myObj2);
    }
    //WRITING OBJECTS
    sLog("Saving to file...");
    var file = './jsondata/config.json';
    if (exists("./resources")) {file = './resources/app/jsondata/config.json';}
    jsonfile.writeFile(file, myObj, function (err) {
      if (err) { sLog(err); }
      else{ sLog("Finished saving"); }
    });
  });
  //CONFIG LOADING
  document.getElementById("loadconf").addEventListener("click", function (e) {
    var file = './jsondata/config.json';
    if (exists("./resources")) {file = './resources/app/jsondata/config.json';}
    sLog("Loading configuration file...");
    jsonfile.readFile(file, function(err, obj) {
      if (err) { sLog(err); }
      else{
        sLog("Reading configuration file...");
        sLog("Assigning token...");
        document.getElementById("token").value = obj.token;
        sLog("Assigning prefix...");
        document.getElementById("commandPrefix").value = obj.prefix;
        sLog("Assigning ping rate...");
        document.getElementById("pingRate").value = obj.rate;
        sLog("Searching presets...");
        sLog(`Found ${obj.presets.length} presets`);
        document.getElementById("presetcontainer").innerHTML = "";
        for (var i = 0; i < obj.presets.length; i++) {
          //create presets in a loop
          createPreset(obj.presets[i].type, obj.presets[i].name, obj.presets[i].user, obj.presets[i].server, obj.presets[i].channel, obj.presets[i].message);
        }
        sLog("Searching sounds...");
        sLog(`Found ${obj.sounds.length} sounds`);
        document.getElementById("sb-container").innerHTML = "";
        for (var i = 0; i < obj.sounds.length; i++) {
          //create sounds in a loop
          createBoard(obj.sounds[i].name, obj.sounds[i].path);
        }
        sLog("Config loaded!");
      }
    });
  });
  //EVENTS
  client.on('ready', () => { 
    wLog("Bot ready"); 
    document.getElementById("server-count").value = client.guilds.size;
    document.getElementById("channel-count").value = client.channels.size;
    document.getElementById("user-count").value = client.users.size;
    document.getElementById("client-ping").value = client.ping.toFixed(2) + " ms";
    var intervalTime = document.getElementById("pingRate").value;
    if (document.getElementById("pingRate").value=="") {
      intervalTime = 30;
    }
    startPing(intervalTime);
  });
  function startPing(time){
    var pingInterval = setInterval(function(){ 
      //wLog("Pinging...");
      if (document.getElementById("pingRate").value!=time) {
        clearInterval(pingInterval);
        intervalTime = document.getElementById("pingRate").value;
        if (document.getElementById("pingRate").value=="") {
          intervalTime = 5;
        }
        startPing(intervalTime);
      }
      document.getElementById("client-ping").value = client.ping.toFixed(2) + " ms"; 
    }, time*1000);
  }
  client.on('disconnect', function () {
    wLog("Disconnected");
    clearTimeout(client.ws.connection.ratelimit.resetTimer);
  });
  client.on('message', (message) =>{
    if (message.channel.type=="dm") {
      document.getElementById("dmfeed").innerHTML += message.author.username + ": " + message.content + "<br>";
    }

  if(message.content.indexOf(appSettings.prefix) == 0){
    wLog("Command received!");
    const args = message.content.slice(appSettings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    wLog(command);
    if(command === "ping") {
      remote.getGlobal("ping")(message);
    }
  }
    //if(message.content == 'ping'){
      //try { message.channel.send('pong'); } catch(e) { wLog(e.message); }
      //message.reply('pong');
      //message.channel.send('pong');
    //}
    //RETURN HERE
    //eval(document.getElementById("onMsg").value);
  });
  //TEXTAREAS SMART KEYS
  for(var i=0;i<document.getElementsByTagName('textarea').length;i++){
    document.getElementsByTagName('textarea')[i].onkeydown = function(e){
      if(e.keyCode==9 || e.which==9){
        e.preventDefault();
        var s = this.selectionStart;
        this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
        this.selectionEnd = s+1; 
      }
    }
  }
  //WINDOW CONTROLS
  function populateServers(item){
    var i;
    for(i = item.options.length - 1 ; i >= 0 ; i--){item.remove(i);}
    var option = document.createElement("option");
    option.text = "Server";
    option.value = "";
    option.selected = "selected";
    option.disabled = "disabled";
    item.appendChild(option);
    for (var i = 0; i < client.guilds.map(g => g.name).length; i++) {
      var option = document.createElement("option");
      option.text = client.guilds.map(g => g.name)[i];
      option.value = client.guilds.map(g => g.name)[i];
      item.appendChild(option);
    }
  }
  function populateChannels(parent, item, type){
    var i;
    for(i = item.options.length - 1 ; i >= 0 ; i--){item.remove(i);}
    var option = document.createElement("option");
    option.text = "Channel";
    option.value = "";
    option.selected = "selected";
    option.disabled = "disabled";
    item.appendChild(option);
    const foundGuilds = client.guilds.find("name", parent);
    //type 1 = text channels
    if (type==1) {
      for (var i = 0; i < foundGuilds.channels.filter(g => g.type!="voice").map(g => g.name).length; i++) {
        var option = document.createElement("option");
        option.text = foundGuilds.channels.filter(g => g.type!="voice").map(g => g.name)[i];
        option.value = foundGuilds.channels.filter(g => g.type!="voice").map(g => g.name)[i];
        item.appendChild(option);
      }
    }
    else{  
      for (var i = 0; i < foundGuilds.channels.filter(g => g.type=="voice").map(g => g.name).length; i++) {
        var option = document.createElement("option");
        option.text = foundGuilds.channels.filter(g => g.type=="voice").map(g => g.name)[i];
        option.value = foundGuilds.channels.filter(g => g.type=="voice").map(g => g.name)[i];
        item.appendChild(option);
      }
    }
  }
  function populateUsers(item){
    var i;
    for(i = item.options.length - 1 ; i >= 0 ; i--){item.remove(i);}
    var option = document.createElement("option");
    option.text = "User";
    option.value = "";
    option.selected = "selected";
    option.disabled = "disabled";
    item.appendChild(option);
    for (var i = 0; i < client.users.filter(g => g.bot==false).map(g => g.username).length; i++) {
      var option = document.createElement("option");
      option.text = client.users.filter(g => g.bot==false).map(g => g.username)[i]+"#"+ client.users.filter(g => g.bot==false).map(g => g.discriminator)[i];
      option.value = client.users.filter(g => g.bot==false).map(g => g.id)[i];
      item.appendChild(option);
    }
    for (var i = 0; i < client.users.filter(g => g.bot==true).map(g => g.username).length; i++) {
      var option = document.createElement("option");
      option.text = client.users.filter(g => g.bot==true).map(g => g.username)[i] + " [BOT]";
      //INSTEAD FIND USERS BY ID NOW
      option.value = client.users.filter(g => g.bot==true).map(g => g.id)[i];
      item.appendChild(option);
    }
  }
  lLog("Loading functions...");
  function init() {
    document.getElementById("min-btn").addEventListener("click", function (e) {
      const window = remote.getCurrentWindow();
      window.minimize();
    });
    document.getElementById("max-btn").addEventListener("click", function (e) {
      const window = remote.getCurrentWindow();
      if (!window.isMaximized()) {
        document.getElementById("max-btn").firstChild.classList.remove("glyphicon-resize-full");
        document.getElementById("max-btn").firstChild.classList.add("glyphicon-resize-small");
        window.maximize();
      } else {
        window.unmaximize();
        document.getElementById("max-btn").firstChild.classList.remove("glyphicon-resize-small");
        document.getElementById("max-btn").firstChild.classList.add("glyphicon-resize-full");
        }
    });
    document.getElementById("close-btn").addEventListener("click", function (e) {
      const window = remote.getCurrentWindow();
      window.close();
    });
  };
  document.getElementById("status").addEventListener("click", function (e) {
    copyToClipboard(document.getElementById("status").innerHTML);
  });
  //FUNCTIONS
  function lLog(str){ document.getElementById("load-log").innerHTML = str; }
  function sLog(str){ document.getElementById("status").innerHTML = str; }
  function wLog(str){ document.getElementById("consoleoutput").innerHTML += `${getStamp()} ${str}<br>`; }
  function openinnew(elem){
    var allnLinks = elem;
    for (var i = 0; i < allnLinks.length; i++) {
      allnLinks[i].addEventListener('click', function(event) {
        if (this.href!="" && this.id != "export-btn") {
          event.preventDefault();
          shell.openExternal(this.href);
        }
      });
    }
  }
  function logout(){
    client.destroy().then(function() {
        sLog("Logout success!");
        wLog(" Successfully logged out");
        eraseDetails();
        //DYNAMIC PANEL HIDE
        var eleR = document.getElementsByClassName('workpanel');
        for (var i = 0; i < eleR.length; i++ ) {
            eleR[i].style.display = "none";
        }
        //HIDE DROPDOWN BUTTONS
        var ele = document.getElementsByClassName('drp-button');
        for (var i = 0; i < ele.length; i++ ) {
            ele[i].style.display = "none";
        }
      }, function(err) {
        sLog("Logout failed: " + err);
        client.destroy();
    });
    remote.getGlobal("logout")();
  }
  function login(token){
    client.login(token).then(function() {
        sLog("Login success!");wLog("Successfully logged in");
        refresh();
        document.getElementById("start-typing").addEventListener("click", function (e) {
          var cChannel = client.guilds.find("name", document.getElementById("gd-server").value).channels.find("name", document.getElementById("gd-channel").value);
          client.channels.get(cChannel.id).startTyping().then(function() {
              wLog("Started typing");
            }, function(err) {
              wLog("Stopped typing");
          });
        });
        document.getElementById("stop-typing").addEventListener("click", function (e) {
          var cChannel = client.guilds.find("name", document.getElementById("gd-server").value).channels.find("name", document.getElementById("gd-channel").value);
          client.channels.get(cChannel.id).stopTyping().then(function() {
              wLog("Started typing");
            }, function(err) {
              wLog("Stopped typing");
          });
        });
        //DYNAMIC PANEL DISPLAY
        var eleR = document.getElementsByClassName('workpanel');
        for (var i = 0; i < eleR.length; i++ ) {
            eleR[i].style.display = "block";
        }
        //SHOW DROPDOWN BUTTONS
        var ele = document.getElementsByClassName('drp-button');
        for (var i = 0; i < ele.length; i++ ) {
            ele[i].style.display = "block";
            ele[i].addEventListener("click", function() {
              if (document.querySelector(this.getAttribute('data-droptarget')).style.display == 'none') {
                document.querySelector(this.getAttribute('data-droptarget')).style.display = 'block';
                this.classList.remove("glyphicon-chevron-down");
                this.classList.add("glyphicon-chevron-up");
              }
              else{
                document.querySelector(this.getAttribute('data-droptarget')).style.display = 'none';
                this.classList.remove("glyphicon-chevron-up");
                this.classList.add("glyphicon-chevron-down");
              }
            });
        }
      }, function(err) {
        sLog("Login failed: " + err);
        client.destroy();
    });
    remote.getGlobal("login")(document.getElementById("token").value);
  }
  document.getElementById("refresh-app").addEventListener("click", function (e) {
    refresh();
  });
  function refresh(){
    populateServers(document.getElementById("server"));
    populateServers(document.getElementById("gd-server"));
    populateServers(document.getElementById("v-server"));
    populateUsers(document.getElementById("dmid"));
    getDetails();
    document.getElementById("server").addEventListener("change", function (e) {
      populateChannels(document.getElementById("server").value, document.getElementById("channel"), 1);
    });
    document.getElementById("gd-server").addEventListener("change", function (e) {
      populateChannels(document.getElementById("gd-server").value, document.getElementById("gd-channel"), 1);
    });
    document.getElementById("v-server").addEventListener("change", function (e) {
      populateChannels(document.getElementById("v-server").value, document.getElementById("v-channel"), 0);
    });
  }
  function copyToClipboard(text){
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value=text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
  function getDetails()
  {
    //Get bot profile details and add them to Bot Info div
    document.getElementById("botInfo").innerHTML = `
    <img class="botProfile" src="https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png">
    <b>${client.user.username}</b>#${client.user.discriminator}
    <span class="glyphicon glyphicon-chevron-up drp-button pull-right" data-droptarget="#settingPanel"></span>`;
    document.getElementById("botid").value = client.user.id;
  }
  function wrapText(elementID, openTag, closeTag){
  var textArea = document.getElementById(elementID);
    if (typeof(textArea.selectionStart) != "undefined") {
      var begin = textArea.value.substr(0, textArea.selectionStart);
      var selection = textArea.value.substr(textArea.selectionStart, textArea.selectionEnd - textArea.selectionStart);
      var end = textArea.value.substr(textArea.selectionEnd);
      textArea.value = begin + openTag + selection + closeTag + end;
    }
  }
  function eraseDetails(){
    document.getElementById("botInfo").innerHTML = `
    <span class="glyphicon glyphicon glyphicon-user"></span>&emsp;Bot info
    <span class="glyphicon glyphicon-chevron-up drp-button pull-right" data-droptarget="#settingPanel" style="display:none;"></span>`;
    document.getElementById("botid").value = "";
  }
  function getStamp(){ 
    var d = new Date();
    return `[${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}]`;
  }
  //F12 DEBUG CODE
  document.addEventListener("keydown", function (e) {
    if (e.which === 123) {
      const window = remote.getCurrentWindow();
      window.toggleDevTools();
    } else if (e.which === 116) {
      logout();
      location.reload();
    }
  });

  function createBoard(name, sound){
    var soundItem = document.createElement("div");
    soundItem.setAttribute('data-soundid', totalsounds);
    soundItem.className += " soundnode";
    var soundName = name;
    if (name==""){soundName = "Sound " + totalsounds;}
    soundItem.innerHTML += `
      <div class="panel panel-default">
        <div class="panel-heading preset-header">
          <div class="sound-name" contenteditable data-parent-s="${totalsounds}">${soundName}</div>
          <div class="sound-cp">
            <span class="glyphicon glyphicon-trash glyph-cp remove-sound" data-target="${totalsounds}"></span>
            <span class="glyphicon glyphicon-chevron-up glyph-cp drop-sound" data-target="${totalsounds}"></span>
            <span class="glyphicon glyphicon-stop glyph-cp stop-sound" data-target="${totalsounds}"></span>
            <span class="glyphicon glyphicon-play glyph-cp play-sound" data-target="${totalsounds}"></span>
          </div>
        </div>
        <div class="panel-body" data-visible-s="${totalsounds}">
          <input type="text" class="form-control" data-parent-s="${totalsounds}" placeholder="File location" value="${sound}">
        </div>
      </div>
    `;
    document.getElementById("sb-container").appendChild(soundItem);
    //ADD LISTENERS
    var ele = document.getElementsByClassName('remove-sound');
    for (var i = 0; i < ele.length; i++ ) {
      if (ele[i].getAttribute('data-target')==totalsounds) {
        ele[i].addEventListener('click', removeFuncSound);
      }
    }
    ele = document.getElementsByClassName('play-sound');
    for (var i = 0; i < ele.length; i++ ) {
      if (ele[i].getAttribute('data-target')==totalsounds) {
        ele[i].addEventListener('click', playFuncSound);
      }
    }
    ele = document.getElementsByClassName('drop-sound');
    for (var i = 0; i < ele.length; i++ ) {
      if (ele[i].getAttribute('data-target')==totalsounds) {
        ele[i].addEventListener('click', dropFuncSound);
      }
    }
    ele = document.getElementsByClassName('stop-sound');
    for (var i = 0; i < ele.length; i++ ) {
      if (ele[i].getAttribute('data-target')==totalsounds) {
        ele[i].addEventListener('click', stopFuncSound);
      }
    }
    totalsounds++;
  }

  function createPrompt(title, body){
    var checkPrompts = document.getElementsByClassName('prompt-name');
    var promptExists = false;
    for (var i = 0; i < checkPrompts.length; i++ ) {
      if (title == checkPrompts[i].innerHTML) {
        promptExists = true; break;
      }
    }
    if (!promptExists) {
      var promptItem = document.createElement("div");
      promptItem.setAttribute('data-promptid', totalprompts);
      promptItem.className += " prompt-item";
      promptItem.innerHTML += `
        <div class="prompt-bg remove-prompt" data-target="${totalprompts}"></div>
        <div class="panel panel-info prompt-body">
          <div class="panel-heading">
            <span class="prompt-name">${title}</span>
            <span class="glyphicon glyphicon glyphicon-remove pull-right remove-prompt pointer" data-target="${totalprompts}"></span>
          </div>
          <div class="panel-body prompt-content">
            ${body}
          </div>
        </div>
      `;
      document.body.appendChild(promptItem);
      var childDivs = document.querySelectorAll("[data-promptid='"+totalprompts+"']")[0].getElementsByTagName('a');;
      openinnew(childDivs);
      //ADD LISTENERS
      var ele = document.getElementsByClassName('remove-prompt');
      for (var i = 0; i < ele.length; i++ ) {
        if (ele[i].getAttribute('data-target')==totalprompts) {
          ele[i].addEventListener('click', removeFuncPrompt);
        }
      }
      totalprompts++;
    }
  }

  function removeFuncSound(){
    document.querySelectorAll("[data-soundid='"+this.getAttribute('data-target')+"']")[0].remove();
  }
  function playFuncSound(){
    remote.getGlobal("playFile")(document.querySelectorAll("[data-parent-s='"+this.getAttribute('data-target')+"']")[1].value);
  }
  function stopFuncSound(){
    remote.getGlobal("stopPlay")();
  }
  function dropFuncSound(){
    if (document.querySelectorAll("[data-visible-s='"+this.getAttribute('data-target')+"']")[0].style.display == 'none') {
      document.querySelectorAll("[data-visible-s='"+this.getAttribute('data-target')+"']")[0].style.display = 'block';
      this.classList.remove("glyphicon-chevron-down");
      this.classList.add("glyphicon-chevron-up");
    }
    else{
      document.querySelectorAll("[data-visible-s='"+this.getAttribute('data-target')+"']")[0].style.display = 'none';
      this.classList.remove("glyphicon-chevron-up");
      this.classList.add("glyphicon-chevron-down");
    }
  }


  function removeFunc(){
    document.querySelectorAll("[data-presetid='"+this.getAttribute('data-target')+"']")[0].remove();
  }
  function removeFuncPrompt(){
    document.querySelectorAll("[data-promptid='"+this.getAttribute('data-target')+"']")[0].remove();
  }
  function dropFunc(){
    if (document.querySelectorAll("[data-visible='"+this.getAttribute('data-target')+"']")[0].style.display == 'none') {
      document.querySelectorAll("[data-visible='"+this.getAttribute('data-target')+"']")[0].style.display = 'block';
      this.classList.remove("glyphicon-chevron-down");
      this.classList.add("glyphicon-chevron-up");
    }
    else{
      document.querySelectorAll("[data-visible='"+this.getAttribute('data-target')+"']")[0].style.display = 'none';
      this.classList.remove("glyphicon-chevron-up");
      this.classList.add("glyphicon-chevron-down");
    }
  }
  function sendFunc(){
    var presetData = document.querySelectorAll("[data-parent='"+this.getAttribute('data-target')+"']");
    if (document.querySelectorAll("[data-presetid='"+this.getAttribute('data-target')+"']")[0].getAttribute('data-type')!="1") {
      wLog("Sending message to user...");
      client.users.find("id", presetData[1].value).send(presetData[2].value).then(function() {
          sLog("Message sent!");
          wLog("Message sent!");
        }, function(err) {
          sLog("Error sending message: " + err);
      });
    }
    else{
      wLog("Sending message to server...");
      var cChannel = client.guilds.find("name", presetData[1].value).channels.find("name", presetData[2].value);
      client.channels.get(cChannel.id).send(presetData[3].value).then(function() {
          sLog("Message sent!");
          wLog("Message sent!");
        }, function(err) {
          sLog("Error sending message: " + err);
          wLog("Error sending message: " + err);
      });
    }
  }
  function createPreset(type, name, user, server, channel, msg){
    var presetItem = document.createElement("div");
    presetItem.setAttribute('data-presetid', totalpresets);
    presetItem.setAttribute('data-type', type);
    presetItem.className += " presetnode";
    var presetName = "Preset " + totalpresets;
    if (name!="") { presetName = name; }
    if (type == "0") {
      //type 0 = user preset
      presetItem.innerHTML += `
        <div class="panel panel-default">
          <div class="panel-heading preset-header">
            <div class="preset-name" contenteditable data-parent="${totalpresets}">${presetName}</div>
            <div class="preset-cp">
              <span class="glyphicon glyphicon-trash glyph-cp remove-preset" data-target="${totalpresets}"></span>
              <span class="glyphicon glyphicon-chevron-up glyph-cp drop-preset" data-target="${totalpresets}"></span>
              <span class="glyphicon glyphicon-send glyph-cp send-preset" data-target="${totalpresets}"></span>
            </div>
          </div>
          <div class="panel-body" data-visible="${totalpresets}">  
            <div class="col-xs-4 rpad2">
              <textarea class="form-control nohor" rows="1" data-parent="${totalpresets}" placeholder="User">${user}</textarea>
            </div>
            <div class="col-xs-8 nopadding">
              <textarea class="form-control nohor" rows="1" data-parent="${totalpresets}" placeholder="Message">${msg}</textarea>
            </div>
          </div>
        </div>
      `;
    }
    else{
      presetItem.innerHTML += `
        <div class="panel panel-default">
          <div class="panel-heading preset-header">
            <div class="preset-name" contenteditable data-parent="${totalpresets}">${presetName}</div>
            <div class="preset-cp">
              <span class="glyphicon glyphicon-trash glyph-cp remove-preset" data-target="${totalpresets}"></span>
              <span class="glyphicon glyphicon-chevron-up glyph-cp drop-preset" data-target="${totalpresets}"></span>
              <span class="glyphicon glyphicon-send glyph-cp send-preset" data-target="${totalpresets}"></span>
            </div>
          </div>
          <div class="panel-body" data-visible="${totalpresets}">  
            <div class="col-xs-3 rpad2">
              <textarea class="form-control nohor" rows="1" data-parent="${totalpresets}" placeholder="Server">${server}</textarea>
            </div>
            <div class="col-xs-3 rpad2">
              <textarea class="form-control nohor" rows="1" data-parent="${totalpresets}" placeholder="Channel">${channel}</textarea>
            </div>
            <div class="col-xs-6 nopadding">
              <textarea class="form-control nohor" rows="1" data-parent="${totalpresets}" placeholder="Message">${msg}</textarea>
            </div>
          </div>
        </div>
      `; 
    }
    document.getElementById("presetcontainer").appendChild(presetItem);
    //ADD LISTENERS
    var ele = document.getElementsByClassName('remove-preset');
    for (var i = 0; i < ele.length; i++ ) {
      if (ele[i].getAttribute('data-target')==totalpresets) {
        ele[i].addEventListener('click', removeFunc);
      }
    }
    ele = document.getElementsByClassName('send-preset');
    for (var i = 0; i < ele.length; i++ ) {
      if (ele[i].getAttribute('data-target')==totalpresets) {
        ele[i].addEventListener('click', sendFunc);
      }
    }
    ele = document.getElementsByClassName('drop-preset');
    for (var i = 0; i < ele.length; i++ ) {
      if (ele[i].getAttribute('data-target')==totalpresets) {
        ele[i].addEventListener('click', dropFunc);
      }
    }
    totalpresets++;
  }
  lLog("Initializing...");
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init();
      //hide loading screen
      document.getElementById('loading-screen').style.display = 'none';
    }
  };
})();