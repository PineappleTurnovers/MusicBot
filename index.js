require("dotenv").config();
const { Collection, Client } = require("discord.js");
const Discord = require("discord.js")
const client = new Client({
  shards: 'auto',
});
const fs = require("fs");

client.config = {
  token: process.env.DISCORD_TOKEN,
  prefix: process.env.DISCORD_PREFIX,
  geniusapi: process.env.GENIUS_API,
  devs: ["696438967351902298"],
  embedColors: {
    misc: "GREY",
    music: "DARK_BLUE",
    trivia: "GREEN",
    settings: "GOLD",
  }
};
client.commands = new Collection();
client.cooldowns = new Collection();
client.queue = new Map();
client.trivia = new Map();
client.setup = new Map();

client.once("ready", ()  => {
  fs.readdir(__dirname + "/commands/misc", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/misc/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);
      console.log("Loading Command: "+commandName)
    });
  });
  fs.readdir(__dirname + "/commands/music", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/music/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);
      console.log("Loading Command: "+commandName)
    });
  });
  client.user.setActivity(` users in ${client.guilds.cache.size} servers (defaulting [ / ])`, { type: 'LISTENING' })
  .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
  .catch(console.error);
}
);

client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.member.user.id != '762049278667128832') return;
  if(newState.voicechannel === undefined){
    const serverQueue = client.queue.get(newState.guild.id);
    const serverTrivia = client.trivia.get(newState.guild.id);
    if (!serverQueue && !serverTrivia) return;
    if (serverQueue){
      if (serverQueue.connection == null || serverQueue.connection == undefined) return;
      else{
        client.queue.delete(newState.guild.id);
      }
    }
    else if (serverTrivia){
      if (serverTrivia.connection == null || serverTrivia.connection == undefined) return;
      else{
        client.trivia.delete(newState.guild.id);
      }
    }
  }
});
//-------------------------------------------------------------------------------------Message-handling--------------------------------------------------------------------------
client.on("message", async (message) => {
  if (message.channel.type != 'dm') {
  if (!message.content.startsWith(prefix) || message.author.bot)
    return;
  const permissions = message.channel.permissionsFor(message.client.user);
	if (!permissions.has('SEND_MESSAGES'))
			return;
	if (!permissions.has('EMBED_LINKS')) {
			message.channel.send(`I do not have embedded permissions. Please enable embedded permissions for me!`);
			return;
	};
  const args = message.content.slice(serverasigment.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
  if(!command) return;
  if(message.member.hasPermission("ADMINISTRATOR") || client.config.devs.includes(message.author.id)){
    if (command){
       if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
      }
    
      const now = Date.now();
      const timestamps = client.cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;
    
      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        

    if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(new Discord.MessageEmbed()
        .setColor(client.config.embedColors.settings)
        .setDescription(`<@${message.member.id}> please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`));
    }
      }
      else{
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); 
      }
      command.execute(client, message, args, serverstatic);
    }
  }
}
});


client.login(client.config.token);
