const Discord = require('discord.js');


module.exports = {
  name: 'back',
  description: 'This command skips to the previous song.',
  commandtitle : 'Back',
  aliases: ['back', 'b', 'previous', 'prev'],
  usage: 'back',
  perms: 'Mini DJ role +', 
  cooldown: 2,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid)||message.member.roles.cache.has(serverasigment.minidjroleid) || client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
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
  if (serverQueue.oldSongs[0] == null || serverQueue.oldSongs[0] == undefined)
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`Nothing has been previously played.`)
    );
    serverQueue.back = true;
    message.client.queue.set(message.guild.id, serverQueue);
    serverQueue.connection.dispatcher.end("Back command has been used!");
    }
    else{
      message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
    }
    
}}