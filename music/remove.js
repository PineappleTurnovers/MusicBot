const Discord = require('discord.js');


module.exports = {
  name: 'remove',
  description: 'This command removes a specific song from the queue.',
  commandtitle : 'Remove',
  aliases: ['remove', 'rm', 'delete', 'del'],
  usage: 'remove {song number (includes now playing)}',
  perms: 'DJ role +',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid)|| client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
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
    if (serverQueue.songs[item] == serverQueue.songs[0]) return message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
    .setDescription(`Cannot remove the currently playing song`)) 
    else{
    serverQueue.songs.splice(item, 1); 
    return message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
    .setDescription(`  Item deleted from queue.`))
    }
  
  }
  else{
    message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
  }
}
}