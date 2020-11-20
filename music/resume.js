const Discord = require('discord.js');


module.exports = {
  name: 'resume',
  description: 'This command resumes music in voice channel.',
  commandtitle : 'Resume',
  aliases: ['resume', 'unpause'],
  usage: 'resume',
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
  if (serverQueue && !serverQueue.playing) {
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume(true);
    return message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
    .setDescription("▶ Resumed the music for you!"));
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
}
}
