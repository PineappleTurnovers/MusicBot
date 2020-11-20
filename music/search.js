const Discord = require('discord.js');
const Search = require("yt-search");

const commandFile = require('./play.js');

module.exports = {
  name: 'search',
  description: 'This command searches for a song and outputs the first 10 results.',
  commandtitle : 'Search',
  aliases: ['search'],
  usage: 'search {name of the song}',
  perms: 'Mini DJ role +',
  cooldown: 5,
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
      if (channel != message.guild.channels.cache.get(serverasigment.voicechannel)){
        return message.channel.send(
          new Discord.MessageEmbed()
          .setColor(client.config.embedColors.music)
          .setDescription(`I cannot connect to your voice channel, make sure you are in the music channel!`));
      }
      const permissions = channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT"))
        return message.channel.send(
          new Discord.MessageEmbed()
          .setColor(client.config.embedColors.music)
          .setDescription(`I cannot connect to your voice channel, make sure I have the proper permissions!`)
        );
      if (!permissions.has("SPEAK"))
        return message.channel.send(
          new Discord.MessageEmbed()
          .setColor(client.config.embedColors.music)
          .setDescription(`I cannot speak in this voice channel, make sure I have the proper permissions!`)
        );
        if (!args[0]){
          return message.channel.send(new Discord.MessageEmbed()
          .setColor(client.config.embedColors.music)
          .setDescription(`<@${message.member.user.id}> Not enough arguments given!\n\n Command usage:\n\`${serverasigment.prefix}${this.usage}\` `));
        }
      else{
          commandFile.execute(client, message, args, serverstatic, true);
      }   
    }   
  else{
    message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
  }
}
}