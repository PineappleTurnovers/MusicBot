const Discord = require('discord.js');


module.exports = {
  name: 'pause',
  description: 'This command pauses current music.',
  commandtitle : 'Pause',
  aliases: ['pause'],
  usage: 'pause',
  perms: 'Mini DJ role +',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid)||message.member.roles.cache.has(serverasigment.minidjroleid) ||client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
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
  if (serverQueue && serverQueue.playing) {
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause(true);
    return message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
    .setDescription("⏸ Paused the music for you!"));
  }
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`There is nothing playing.`)
    );
}
else{
  message.channel.send(new Discord.MessageEmbed()
  .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
}
}}
