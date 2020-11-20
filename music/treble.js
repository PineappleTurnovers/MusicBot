const Discord = require('discord.js');

const randomColor = require('randomcolor');

module.exports = {
  name: 'treble',
  description: 'This command changes the treble of the music.',
  commandtitle : 'Treble',
  aliases: ['treble', 'tr'],
  usage: 'treble {number}',
  perms: 'Donator',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (client.config.devs.includes(message.author.id) || client.config.donators.includes(message.author.id)){
  const { channel } = message.member.voice;
  const serverTrivia = message.client.trivia.get(message.guild.id);
    if (serverTrivia){
      return message.channel.send(new Discord.MessageEmbed().setColor(`${randomColor()}`).setDescription(`I'm sorry but trivia is playing!`));
    }
  if (!channel)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor(`${randomColor()}`)
        .setDescription(`I'm sorry but you need to be in a voice channel to do this command!`)
    );
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!serverQueue)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor(`${randomColor()}`)
        .setDescription(`There is nothing playing.`)
    );
  if (!args[0]){
  if (serverQueue){
    var trebleValue = serverQueue.boost.treble;
    return message.channel.send(new Discord.MessageEmbed()
    .setColor(`${randomColor()}`)
    .setDescription(` The current treble gain is: **${trebleValue}**`)
    );
  }
}
    if (isNaN(parseInt(args[0]))) return message.channel.send(new Discord.MessageEmbed()
    .setColor(`${randomColor()}`)
    .setDescription(`Could not parse argument to intiger.`))
    const number = parseFloat(args[0]);
    if (number < -20 || number > 20) {
        return message.channel.send(new Discord.MessageEmbed()
        .setColor(`${randomColor()}`)
        .setDescription(`Treble must be between **-20** and **20**`))
    }
    serverQueue.boost.treble = number;
    const current = serverQueue.songs[0];
    if (serverQueue.connection == null && serverQueue.connection.dispatcher == null){
      message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`You cannot treble boost when I am already treble boosting!`))
      return;
    }
    current.time = (current.time ? current.time : 0) + serverQueue.connection.dispatcher.streamTime;
    serverQueue.skipToPoint = true;
    message.client.queue.set(message.guild.id, serverQueue);
    if (serverQueue.connection != null && serverQueue.connection.dispatcher != null)
        serverQueue.connection.dispatcher.end("trebling song");
    else{
      message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`You cannot treble boost when I am already treble boosting!`))
      serverQueue.skipToPoint = false;
      current.time = 0;
      return;
    }
  return message.channel.send(new Discord.MessageEmbed()
  .setColor(`${randomColor()}`)
  .setDescription(` I set the treble to: **${number}**`));
    }
    else{
      message.channel.send(new Discord.MessageEmbed()
.setColor(`${randomColor()}`)
.setDescription(`You have to be a donator to use this command! If you wish to gain access donate [here](https://www.patreon.com/billybot).`));
    }
}}