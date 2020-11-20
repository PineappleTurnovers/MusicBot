const Discord = require('discord.js');


module.exports = {
  name: 'end-trivia',
  description: 'This command stops the trivia!',
  commandtitle : 'End-trivia',
  aliases: ['stop-music-trivia','skip-trivia','end-trivia','stop-trivia'],
  usage: 'endtrivia',
  perms: 'Administrator',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
      return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.trivia).setDescription(`I'm sorry but The bot dev has disabled this command due to issues!`));
    serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
    const searchString = args.join(" ");
    if (message.member.hasPermission("ADMINISTRATOR") || client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
        const serverTrivia = message.client.trivia.get(message.guild.id);
        if (!serverTrivia){
            return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.trivia).setDescription(`There is no trivia currently running!`));
        }
      const { channel } = message.member.voice;
      if (!channel)return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.trivia).setDescription(`I'm sorry but you need to be in a voice channel to do this command!`));
      if (channel != message.guild.channels.cache.get(serverasigment.voicechannel)){return message.channel.send(new Discord.MessageEmbed().setColor('#96E2DE').setDescription(`You are not in the music channel, make sure you are in the music channel!`));}
      serverTrivia.triviaQueue = [];
      serverTrivia.wasTriviaEndCalled = true;
      serverTrivia.connection.dispatcher.end("Trivia has ended!");
      return;
    }
}
}