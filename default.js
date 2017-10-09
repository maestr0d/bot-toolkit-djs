document.getElementById("status").innerHTML = "Loading js file...";
(function () {
  var totalpresets = 1;
  document.getElementById("status").innerHTML = "Creating node variables...";
  try {
      document.getElementById("status").innerHTML = require.resolve("discord.js");
  } catch(e) {
      document.getElementById("status").innerHTML = e.message;
  }
  const Discord = require("discord.js");
  document.getElementById("status").innerHTML = "Discord.js loaded!";
  const client = new Discord.Client();
  document.getElementById("status").innerHTML = "Discord.js client created!";
  const shell = require('electron').shell;
  document.getElementById("status").innerHTML = "Electron shell loaded!";
  const remote = require('electron').remote;
  document.getElementById("status").innerHTML = "Electron remote loaded";
  var jsonfile = require('jsonfile');
  document.getElementById("status").innerHTML = "Jsonfile loaded";
  var fs = require('fs');
  document.getElementById("status").innerHTML = "Filesystem loaded";

  //first time login check and display changelog
  var logcheck = './jsondata/lv.json';
  if (exists("./resources")) {logcheck = './resources/app/jsondata/lv.json';}
  document.getElementById("status").innerHTML = "Checking login file...";
  jsonfile.readFile(logcheck, function(err, obj) {
    if (err) {document.getElementById("status").innerHTML = err;}
    else{
      if (obj.seen==0) {
        document.getElementById("changelogprompt").style.display = 'block';
        jsonfile.writeFile(logcheck, { "seen":1}, function (err) {
          if (err) {document.getElementById("status").innerHTML = err;}
          else{}
        });
      }
    }
  });

  document.getElementById("status").innerHTML = "Adding event listener for login...";
  //LOGIN
  document.getElementById("login").addEventListener("click", function (e) {
    document.getElementById("status").innerHTML = "Attempting login...";
    document.getElementById("consoleoutput").innerHTML += getStamp() + " Attempting login...<br>";
    client.login(document.getElementById("token").value).then(function() {
        document.getElementById("status").innerHTML = "Login success!";
        document.getElementById("consoleoutput").innerHTML += getStamp() + " Successfully logged in<br>";
        getDetails();
        document.getElementById('settingPanel').style.display = 'block';
        document.getElementById('messagePanel').style.display = 'block';
        document.getElementById('invitePanel').style.display = 'block';
        document.getElementById('presetPanel').style.display = 'block';
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
        document.getElementById("status").innerHTML = "Login failed: " + err;
        client.destroy();
    });
  });
  document.getElementById("status").innerHTML = "Adding event listener for logout...";
  //LOGOUT
  document.getElementById("logout").addEventListener("click", function (e) {
    document.getElementById("status").innerHTML = "Attempting logout...";
    document.getElementById("consoleoutput").innerHTML += getStamp() + " Attempting logout...<br>";
    client.destroy().then(function() {
        document.getElementById("status").innerHTML = "Logout success!";
        document.getElementById("consoleoutput").innerHTML += getStamp() + "Successfully logged out<br>";
        eraseDetails();
        document.getElementById('settingPanel').style.display = 'none';
        document.getElementById('messagePanel').style.display = 'none';
        document.getElementById('invitePanel').style.display = 'none';
        document.getElementById('presetPanel').style.display = 'none';
        //HIDE DROPDOWN BUTTONS
        var ele = document.getElementsByClassName('drp-button');
        for (var i = 0; i < ele.length; i++ ) {
            ele[i].style.display = "none";
        }
      }, function(err) {
        document.getElementById("status").innerHTML = "Logout failed: " + err;
        client.destroy();
    });
  });
  document.getElementById("status").innerHTML = "Adding event listener for send...";
  //MESSAGE SEND
  document.getElementById("sendmsg").addEventListener("click", function (e) {
    document.getElementById("status").innerHTML = "Sending message...";
    if (document.getElementById("message-to").value==1) {
      //sending to channel
      document.getElementById("consoleoutput").innerHTML += getStamp() + " Sending \"" + document.getElementById("msg").value +
      "\" to " + document.getElementById("channel").value + " in " + document.getElementById("server").value + "...<br>";
      var channel = client.guilds.find("name", document.getElementById("server").value).channels.find("name", document.getElementById("channel").value);
      client.channels.get(channel.id).send(document.getElementById("msg").value).then(function() {
          document.getElementById("status").innerHTML = "Message sent!";
          document.getElementById("consoleoutput").innerHTML += getStamp() + " Message sent!<br>";
        }, function(err) {
          document.getElementById("status").innerHTML = "Error sending message: " + err;
      });
    }
    else{
      //sending to user
      document.getElementById("consoleoutput").innerHTML += getStamp() + " Sending \"" + document.getElementById("msg").value +
      "\" to " + client.users.find("id", document.getElementById("dmid").value).username + "...<br>";
      client.users.find("id", document.getElementById("dmid").value).send(document.getElementById("msg").value).then(function() {
          document.getElementById("status").innerHTML = "Message sent!";
          document.getElementById("consoleoutput").innerHTML += getStamp() + " Message sent!<br>";
        }, function(err) {
          document.getElementById("status").innerHTML = "Error sending message: " + err;
      });
    }
  });
  document.getElementById("status").innerHTML = "Adding event listener for rte buttons...";
  //RICH TEXT EDITOR
  document.getElementById("formatBold").addEventListener("click", function (e) {
    wrapText('msg','**','**');
  });
  document.getElementById("formatItalic").addEventListener("click", function (e) {
    wrapText('msg','*','*');
  });
  document.getElementById("formatUnderline").addEventListener("click", function (e) {
    wrapText('msg','__','__');
  });
  document.getElementById("formatStrike").addEventListener("click", function (e) {
    wrapText('msg','~~','~~');
  });
  document.getElementById("olBox").addEventListener("click", function (e) {
    wrapText('msg','`','`');
  });
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
  //ABOUT PROMPT
  document.getElementById("about-page").addEventListener("click", function (e) {
    document.getElementById("aboutprompt").style.display = 'block';
  });
  document.getElementById("closeaboutbg").addEventListener("click", function (e) {
    document.getElementById("aboutprompt").style.display = 'none';
  });
  document.getElementById("dismissaboutprompt").addEventListener("click", function (e) {
    document.getElementById("aboutprompt").style.display = 'none';
  });
  //CHANGELOG PROMPT
  document.getElementById("changelog-data").addEventListener("click", function (e) {
    document.getElementById("changelogprompt").style.display = 'block';
  });
  document.getElementById("closechangelogbg").addEventListener("click", function (e) {
    document.getElementById("changelogprompt").style.display = 'none';
  });
  document.getElementById("dismisschangelogprompt").addEventListener("click", function (e) {
    document.getElementById("changelogprompt").style.display = 'none';
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
  document.getElementById("status").innerHTML = "Adding event listener for status settings...";
  //SAVE SETTINGS
  document.getElementById("setSettings").addEventListener("click", function (e) {
    if (document.getElementById("botname").value!=null) {
      document.getElementById("status").innerHTML = "Setting username...";
      document.getElementById("consoleoutput").innerHTML += "Setting bot's username as \"" + document.getElementById("botgame").value + "\"<br>";
      client.user.setUsername(document.getElementById("botname").value).then(function() {
          document.getElementById("status").innerHTML = "Name set!";
        }, function(err) {
          document.getElementById("status").innerHTML = "Name not set: " + err;
      });
    }
    document.getElementById("status").innerHTML = "Setting game...";
    document.getElementById("consoleoutput").innerHTML += "Setting bot's game as \"" + document.getElementById("botgame").value + "\"<br>";
    client.user.setGame(document.getElementById("botgame").value).then(function() {
        document.getElementById("status").innerHTML = "Game set!";
      }, function(err) {
        document.getElementById("status").innerHTML = "Game not set: " + err;
    });
    //BROKEN?
    /*
    client.user.setPresence({game: { name: document.getElementById("botgame").value, type: 0 }}).then(function() {
        document.getElementById("status").innerHTML = "Game set!";
      }, function(err) {
        document.getElementById("status").innerHTML = "Game not set: " + err;
    });*/
    document.getElementById("status").innerHTML = "Setting status...";
    document.getElementById("consoleoutput").innerHTML += "Setting bot's status as \"" + document.getElementById("botstatus").value + "\"<br>";
    client.user.setStatus(document.getElementById("botstatus").value).then(function() {
        document.getElementById("status").innerHTML = "Status set!";
      }, function(err) {
        document.getElementById("status").innerHTML = "Status not set: " + err;
    });
    document.getElementById("status").innerHTML = "Changes saved!";
  });
  document.getElementById("status").innerHTML = "Adding event listener for create preset...";
  //ADD EVENT

  /*
  var totalevents = 1;
  document.getElementById("addevent").addEventListener("click", function (e) {
    var appendme = document.createElement("div");
    appendme.setAttribute("id", "parentdevent" + totalevents);
    appendme.setAttribute("class", "presetnode");
    appendme.innerHTML +=`
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="editabletitle pull-left" contenteditable>Event ` + totalevents + `</div>
          <span class="glyphicon glyphicon-remove pull-right removeevent" data-eventnum="` + totalevents + `" id="event` + totalevents + `"></span>
          <div style="clear:both;"></div>
        </div>
        <div class="panel-body">
          <select class="form-control" id="selevent` + totalevents + `" data-event="` + `">
            <option selected disabled>Event type</option>
            <option value="ev1">Message</option>
            <option value="ev2">User join</option>
            <option value="ev3">User leave</option>
          </select>
          <br>
          <textarea class="form-control" rows="5" id="` + totalevents + `">Code to execute</textarea>
        </div>
      </div>`;
    totalevents+=1;
    document.getElementById("eventcontainer").appendChild(appendme);
  });*/
  //TEST AREA





  //ADD PRESET
  document.getElementById("addpreset").addEventListener("click", function (e) {
    createPreset("", "","","");
  });

  document.getElementById("status").innerHTML = "Adding global event listener for preset sends...";
  document.addEventListener('click', function(e) {
    if (e.srcElement.className.includes("sendpres")) {
      var elid = e.srcElement.getAttribute("data-presetnum");
      document.getElementById("consoleoutput").innerHTML +=
      getStamp() + " Sending \"" + document.getElementById("message"+elid).value + "\" to " +
      document.getElementById("channel"+elid).value + " in " + document.getElementById("server"+elid).value + "...<br>";

      var channel2 = client.guilds.find("name", document.getElementById("server"+elid).value).channels.find("name", document.getElementById("channel"+elid).value);
      client.channels.get(channel2.id).send(document.getElementById("message"+elid).value).then(function() {
          document.getElementById("status").innerHTML = "Message sent!";
          document.getElementById("consoleoutput").innerHTML += getStamp() + " Message sent!<br>";
        }, function(err) {
          document.getElementById("status").innerHTML = "Error sending message: " + err;
          document.getElementById("consoleoutput").innerHTML += getStamp() + "Error sending message: " + err + "!<br>";
      });
    }  
    else if (e.srcElement.className.includes("removepreset")) {
      var elid = e.srcElement.getAttribute("data-presetnum");
      var rmelement = document.getElementById("parentd"+elid);
      rmelement.outerHTML = "";
    }
    else if (e.srcElement.className.includes("removeevent")) {
      var elid = e.srcElement.getAttribute("data-eventnum");
      var rmelement = document.getElementById("parentdevent"+elid);
      rmelement.outerHTML = "";
    }
  }, false);

  document.getElementById("status").innerHTML = "Adding event listener for preset saving...";
  document.getElementById("savepres").addEventListener("click", function (e) {
    createPreset("", document.getElementById("server").value, document.getElementById("channel").value, document.getElementById("msg").value);
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
  document.getElementById("status").innerHTML = "Adding event listener for invite link...";
  //INVITE
  document.getElementById("invite").addEventListener("click", function (e) {
    shell.openExternal('https://discordapp.com/oauth2/authorize?&client_id='
     + document.getElementById("botid").value 
     + '&scope=bot&permissions='
     + document.getElementById("perms").value);
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
  document.getElementById("status").innerHTML = "Adding event listener for perm calculator...";
  //PERMISSION CALCULATOR REDIRECT
  document.getElementById("redirPerms").addEventListener("click", function (e) {
    shell.openExternal('https://discordapi.com/permissions.html');
  });
  //INVITE LINK COPY
  document.getElementById("status").innerHTML = "Adding event listener for invite link...";
  document.getElementById("inviteLink").addEventListener("click", function (e) {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value='https://discordapp.com/oauth2/authorize?&client_id='
     + document.getElementById("botid").value 
     + '&scope=bot&permissions='
     + document.getElementById("perms").value;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
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
      document.getElementById("status").innerHTML = obj;
      var finaldir = './jsondata/config.json';
      if (exists("./resources")) {finaldir = './resources/app/jsondata/config.json';}
      jsonfile.writeFile(finaldir, obj, function (err) {
        if (err) {document.getElementById("status").innerHTML = err;}
        else{document.getElementById("status").innerHTML = "Config imported";}
      });
  }

  document.getElementById('upload').addEventListener('change', onChange);

  //CONFIG SAVING
  document.getElementById("saveconf").addEventListener("click", function (e) {
    document.getElementById("status").innerHTML = "Searching presets...";
    document.getElementById("status").innerHTML = `Found ${document.getElementsByClassName("presetnode").length} presets`;
    var myObj = { "token": document.getElementById("token").value, "presets":[] };
    for (var i = 0; i < document.getElementsByClassName("presetnode").length; i++) {
      var name = document.getElementsByClassName("presetnode")[i].children[0].children[0].children[0].innerHTML;
      var serv = document.getElementsByClassName("presetnode")[i].children[0].children[1].children[0].children[0].value;
      var chan = document.getElementsByClassName("presetnode")[i].children[0].children[1].children[1].children[0].value;
      var mess = document.getElementsByClassName("presetnode")[i].children[0].children[1].children[2].children[0].children[0].value;
      var myObj2 = { "name": name, "server": serv, "channel": chan, "message": mess};
      myObj.presets.push(myObj2);
    }
    var file = './jsondata/config.json';
    if (exists("./resources")) {file = './resources/app/jsondata/config.json';}
    jsonfile.writeFile(file, myObj, function (err) {
      if (err) {document.getElementById("status").innerHTML = err;}
      else{ document.getElementById("status").innerHTML = "Finished saving";}
    });
  });
  //CONFIG LOADING
  document.getElementById("loadconf").addEventListener("click", function (e) {
    var file = './jsondata/config.json';
    if (exists("./resources")) {file = './resources/app/jsondata/config.json';}
    document.getElementById("status").innerHTML = "Loading configuration file...";
    jsonfile.readFile(file, function(err, obj) {
      if (err) {document.getElementById("status").innerHTML = err;}
      else{
        document.getElementById("status").innerHTML = "Reading configuration file...";
        document.getElementById("status").innerHTML = "Assigning token...";
        document.getElementById("token").value = obj.token;
        document.getElementById("status").innerHTML = "Searching presets...";
        document.getElementById("status").innerHTML = `Found ${obj.presets.length} presets`;
        document.getElementById("presetcontainer").innerHTML = "";
        for (var i = 0; i < obj.presets.length; i++) {
          //create presets in a loop
          createPreset(obj.presets[i].name, obj.presets[i].server,obj.presets[i].channel,obj.presets[i].message);
        }
        document.getElementById("status").innerHTML = "Config loaded!";
      }
    });
  });
  //EVENTS
  document.getElementById("status").innerHTML = "Creating event for ready...";
  client.on('ready', () => { 
    document.getElementById("consoleoutput").innerHTML += getStamp() + " Bot ready<br>";
  });

  document.getElementById("status").innerHTML = "Creating event for disconnect...";
  client.on('disconnect', function () {
    document.getElementById("consoleoutput").innerHTML += getStamp() + " Disconnected<br>";
    clearTimeout(client.ws.connection.ratelimit.resetTimer);
  });
  document.getElementById("status").innerHTML = "Creating event for message...";
  client.on('message', (message) =>{
    if(message.content == 'ping'){
      //message.reply('pong');
      try {
        message.channel.send('pong');
      } catch(e) {
          document.getElementById("consoleoutput").innerHTML += getStamp() + " " + e.message;
          //document.getElementById("status").innerHTML = e.message;
      }
      //message.channel.send('pong');
    }
    //RETURN HERE
    //eval(document.getElementById("onMsg").value);
  });
  //TEXTAREAS SMART KEYS
  var textareas = document.getElementsByTagName('textarea');
  var count = textareas.length;
  for(var i=0;i<count;i++){
    textareas[i].onkeydown = function(e){
      if(e.keyCode==9 || e.which==9){
        e.preventDefault();
        var s = this.selectionStart;
        this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
        this.selectionEnd = s+1; 
      }
    }
  }
  //WINDOW CONTROLS
  document.getElementById("status").innerHTML = "Loading function for window buttons...";
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
  document.getElementById("status").innerHTML = "Loading function for window bot details...";
  //FUNCTIONS
  function getDetails()
  {
    //Get bot profile details and add them to Bot Info div
    document.getElementById("botInfo").innerHTML = `
    <img class="botProfile" src="https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png">
    <b>${client.user.username}</b>#${client.user.discriminator}
    <div class="pull-right" data-balloon="These features are rate limited by the library" data-balloon-pos="right">
      <span class="glyphicon glyphicon glyphicon-question-sign"></span>
    </div`;
    document.getElementById("botid").value = client.user.id;
  }
  document.getElementById("status").innerHTML = "Loading function for rte...";
  function wrapText(elementID, openTag, closeTag) {
  var textArea = document.getElementById(elementID);
    if (typeof(textArea.selectionStart) != "undefined") {
      var begin = textArea.value.substr(0, textArea.selectionStart);
      var selection = textArea.value.substr(textArea.selectionStart, textArea.selectionEnd - textArea.selectionStart);
      var end = textArea.value.substr(textArea.selectionEnd);
      textArea.value = begin + openTag + selection + closeTag + end;
    }
  }
  document.getElementById("status").innerHTML = "Loading function for detail reset...";
  function eraseDetails()
  {
    document.getElementById("botInfo").innerHTML = `
    <span class="glyphicon glyphicon glyphicon-user"></span>&emsp;Bot info
    <div class="pull-right" data-balloon="These features are rate limited by the library" data-balloon-pos="right">
      <span class="glyphicon glyphicon glyphicon-question-sign"></span>
    </div`;
    document.getElementById("botid").value = "";
  }
  function getStamp()
  { 
    var d = new Date();
    return `[${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}]`;
  }
  function createPreset(name, server, channel, msg)
  {
    var appendme = document.createElement("div");
    appendme.setAttribute("id", "parentd" + totalpresets);
    appendme.setAttribute("class", "presetnode");
    var presetName = "Preset " + totalpresets;
    if (name!="") { presetName = name; }
    appendme.innerHTML += `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="editabletitle pull-left" contenteditable>` + presetName + `</div>
        <span class="glyphicon glyphicon-remove pull-right removepreset" data-presetnum=` + totalpresets + ` id="remv` + totalpresets + `""></span>
        <div style="clear:both;"></div>
      </div>
      <div class="panel-body">
        <div class="col-xs-3 rpad2">
          <input type="text" class="form-control" placeholder="Server" id="server` + totalpresets + `" value="` + server + `">
        </div>
        <div class="col-xs-3 rpad2">
          <input type="text" class="form-control" placeholder="Channel" id="channel` + totalpresets + `" value="` + channel + `">
        </div>
        <div class="col-xs-6 nopadding">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Message" id="message` + totalpresets + `" value="` + msg + `">
            <span class="input-group-btn">
              <button class="btn btn-default sendpres" type="button" data-presetnum="` + totalpresets + `">Send</button>
            </span>
          </div>
        </div>
      </div>
    </div>`;
    document.getElementById("presetcontainer").appendChild(appendme);
    totalpresets++;
  }
  document.getElementById("status").innerHTML = "Running init...";
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init();
      //hide loading screen
      document.getElementById('loading-screen').style.display = 'none';
    }
  };
})();
document.getElementById("status").innerHTML = "Js file loaded!";