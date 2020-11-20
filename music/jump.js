const Discord = require('discord.js');


module.exports = {
  name: 'jump',
  description: 'This command jump to a certain song in the queue.',
  commandtitle : 'Jump',
  aliases: ['jump', 'j', 'goto'],
  usage: 'jump {song number (includes now playing)}',
  perms: 'DJ role +', 
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid) || client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
    const serverTrivia = message.client.trivia.get(message.guild.id);
    if (serverTrivia){
      return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but trivia is playing!`));
    }
   const { channel } = message.member.voice;
   if (!channel)
   return message.channel.send(
     new Discord.MessageEmbed()
     .setColor(client.config.embedColors.music)
       .setDescription(`I'm sorry but you need to be in a voice channel to do this command!`)
   );
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`There is nothing playing.`)
    );
    if (!args[0]){
      return message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
      .setDescription(`<@${message.member.user.id}> Not enough arguments given!\n\n Command usage:\n\`${serverasigment.prefix}${this.usage}\` `));
    }
    if (isNaN(parseInt(args[0]))) return message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
    .setDescription(`Could not parse argument to intiger.`))
    var guildChannel = message.guild.channels.cache.get(serverasigment.voicechannel);
    item = args[0] - 1
    if (serverQueue.songs[item] == null) return message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
    .setDescription(`There is not a item in the queue with that number.`))
    for (var i = 0; i < serverQueue.songs[item-1]; i++){
      serverQueue.songs.splice(i, 1); 
      i--;           
    }
    serverQueue.jumpTo = item;
    serverQueue.jump = true;
    message.client.queue.set(message.guild.id, serverQueue);
    if (serverQueue.connection != null && serverQueue.connection.dispatcher != null)
      serverQueue.connection.dispatcher.end("Jump command has been used!");
    else
      message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`You cannot jump when I am already jumping!`))
    //serverQueue.connection.dispatcher.end("Jump command has been used!");
    }
    else{
      message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
    }
    
}}