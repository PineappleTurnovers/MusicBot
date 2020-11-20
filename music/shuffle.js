const Discord = require('discord.js');


module.exports = {
  name: 'shuffle',
  description: 'This command shuffles current queue.',
  commandtitle : 'Shuffle',
  aliases: ['shuffle', 'shuff', 'shuf', 'randomize', 'randomize'],
  usage: 'shuffle',
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

  var max = serverQueue.songs.length - 1;
  var min = 1;
  for (var i = max; i >= min; i--) {
    var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    var itemAtIndex = serverQueue.songs[randomIndex];
    serverQueue.songs[randomIndex] = serverQueue.songs[i];
    serverQueue.songs[i] = itemAtIndex;
  }
  return message.channel.send(
    new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
    .setDescription("🔀 Successfully shuffled queue!")
  );
  }
  else{
    message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
  }
}}


