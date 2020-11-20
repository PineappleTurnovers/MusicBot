const Discord = require('discord.js');


module.exports = {
  name: 'voteskip',
  description: 'This command votes to skip the current song.',
  commandtitle : 'Vote skip',
  aliases: ['voteskip', 'vs', 'votenext'],
  usage: 'voteskip',
  perms: 'Mini DJ role +', 
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid)||message.member.roles.cache.has(serverasigment.minidjroleid) || client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
  const { channel } = message.member.voice;
  const serverTrivia = message.client.trivia.get(message.guild.id);
  if (serverTrivia){
    return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but trivia is playing!`));
  }
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
    if (serverQueue.skips.has(message.author.id)) return;
    serverQueue.skips.add(message.author.id);
    const votes = serverQueue.skips.size;
    const channelInfo = Array.from(
        message.member.voice.channel.members.entries()
      );
    const requiredVotes = Math.round(channelInfo.length / 2);
    if (votes >= requiredVotes){ return serverQueue.connection.dispatcher.end("Skip command has been used!");}
    else message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music)
    .setDescription(` <@${message.member.user.id}> has voted to skip! | **${votes}/${requiredVotes}** votes required to skip!`));
    }
    else{
      message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
    }
    
}}