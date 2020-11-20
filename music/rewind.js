const Discord = require('discord.js');


module.exports = {
  name: 'rewind',
  description: 'This command rewinds the music by a specified time.',
  commandtitle : 'Rewind',
  aliases: ['rewind', 'rw'],
  usage: 'rewind {number of seconds}',
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
    .setDescription(`Could not parse argument to intiger.`));
    const number = parseInt(args[0])
		if (number <= 0) {
			return message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
    .setDescription(`Number too small.`));
		}
		const current = serverQueue.songs[0];
		let time = (current.time ? current.time : 0) + serverQueue.connection.dispatcher.streamTime;
	//	const max = parseInt(current.approxDurationMs);
		if (time < number * 1000)
			time = 0;
		else
			time -= number * 1000
        current.time = time;
        serverQueue.skipToPoint = true;
        message.client.queue.set(message.guild.id, serverQueue);
        serverQueue.connection.dispatcher.end("Rewinding song");
        time -= time % 1000;
		time /= 1000;
		let seconde = time % 60;
		const minute = (time - seconde) / 60;
		if (seconde < 10)
            seconde = `0${seconde}`;
        return message.channel.send(new Discord.MessageEmbed()
        .setColor(client.config.embedColors.music)
            .setDescription(` Rewinded [${current.title}](${current.url}) to **${minute}:${seconde}**.`));
  }
  else{
    message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
  }
}

}