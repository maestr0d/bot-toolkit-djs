var textAbout = `
    &#169; slydoge, Bot Toolkit v{version}
    <br><br>
    Powered by <a href="https://nodejs.org/en/" class="text-a">Node.js</a>, 
    <a href="https://electron.atom.io/" class="text-a">Electron</a>, 
    <a href="https://discord.js.org/" class="text-a">Discord.js</a>, 
    <a href="http://getbootstrap.com/" class="text-a">Bootstrap</a> and 
    <a href="https://kazzkiq.github.io/balloon.css/" class="text-a">Balloon.css</a>
    <br><br>
    Please direct any feeback and bug reports to <b>slydoge#3925</b> on Discord.
    <hr>
    Special thanks to alpha testers:
    <br>
    <br>
    <ul>
      <li>PiTiKi</li>
      <li>K4oS</li>
    </ul>
    <hr>
    <a data-balloon="Trello" data-balloon-pos="up" href="https://trello.com/b/nLa0eXAJ/discordjs-bot-toolkit"><img src="./img/trello.png" width="32px" height="32px"></a>
    <a data-balloon="Discord" data-balloon-pos="up" href="https://discord.gg/Scd2Gtw"><img src="./img/discord.png" width="32px" height="32px"></a>
    <a data-balloon="Github" data-balloon-pos="up" href="https://github.com/maestr0d/bot-toolkit-djs"><img src="./img/github.png" width="32px" height="32px"></a>
    <a data-balloon="Website" data-balloon-pos="up" href="http://slydoge.tk/toolkit"><img src="./img/website.png" width="32px" height="32px"></a>
    
`;
var textHelp = `
	<h3 class="nomargintop">Hello! Thanks for using the toolkit!</h3>
	<h5>If you're here for the first time or need some help on how to work with the toolkit check out the manual below!</h5>
	<hr>
	<h4>First things first!</h4>
	<p class="faqp">
	This is a program made to control Discord bots. You need a token to control the bot and if you don't
	have one yet, or forgot it you should check out <a href="https://discordapp.com/developers/applications/me">this page</a>.
	</p>
	<h4>Lets connect with our bot!</h4>
	<p class="faqp">
	Now that you have your token it's time to get to work! Paste it in the "Bot token" input in the top right and click login.
	If everything goes well (fingers crossed) you will shortly see some panels open with your bot's name and profile picture 
	displaying on the left where "Bot info" was previously present.
	</p>
	<p class="faqp">
	You can invite your bot to a server by using the "Invite bot to a server" panel on the left side. Your id will automatically 
	be pasted in the input field, but you can use any bot's id there (that is if you want to invite some other bot). You can also 
	specify what permissions you want it to have from the beginning by following the link on the right side of the "Perms" input.
	</p>
	<h4>Sending messages!</h4>
	<p class="faqp">
	Sending messages is easy-peasy. Just pick who or where you want to send it to ("Direct message" or "Channel message") from the 
	menu, then pick the server and the channel, or the recipient user from the next menus and then enter your message and click send! 
	You can also neatly format your text the way you want it to show in Discord by clicking on the buttons below the "Message" box.
	</p>
	<h4>Repeating yourself!</h4>
	<p class="faqp">
	Lets be honest: nobody likes to. So i've made it easier for you to do so! You don't need to retype or copy paste the same message 
	as you would have before. Now you can use the "Message presets" panel! Just click the save button in your "Message" box, or pick 
	what kind of preset you'd like to make a click "Create preset" directly in the preset panel!
	</p>
	<hr>
	<h4>Thanks for reading! Remember, this information may be incomplete as the program is still a work-in-progress!</h4>
`;
var textChangelog = `
	<h4>v{version} Changelog:</h4>
	<br>
	<ul>
	  <li>Added the ability to start/stop typing in the guild data panel (requires you to pick a channel first)</li>
	  <li>Added ping to stats panel and refresh rate to settings panel (default is 30 seconds)</li>
	  <li>Moved changelog, about and the manual tab to the Help menu</li>
	  <li>Added menus to the voice playback panel</li>
	  <li>Added refresh button for manual info refresh</li>
	  <li></li>
	</ul> 
`;