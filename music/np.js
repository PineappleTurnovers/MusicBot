const Discord = require('discord.js');


module.exports = {
  name: 'np',
  description: 'This command shows what song is current playing.',
  commandtitle : 'Now playing',
  aliases: ['np', 'nowplaying', 'song'],
  usage: 'np',
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
  let song = serverQueue.songs[0];
  const current = song;
  let time = (current.time ? current.time : 0) + serverQueue.connection.dispatcher.streamTime;
		let maxBar = 18;
		let rate = maxBar * time / current.approxDurationMs;
		let bar = '';
		while (maxBar--)
			if (rate-- > 0)
				bar += `${CustomEmojis.barRed}`;
			else{
        bar += `${CustomEmojis.barGrey}`
      }
      if (song.request.id == undefined){
        requester = song.request;
      }
      else{
        requester = `<@${song.request.id}>`
      }
  const npEmbed = new Discord.MessageEmbed();
  npEmbed.setAuthor("Now playing", "https://i.imgur.com/XyHXh2I.gif");
  npEmbed.setThumbnail(song.thumbnail);
  //console.log(song.videoDetails.video_thumbnail)
  npEmbed.setColor(client.config.embedColors.music);
  npEmbed.setDescription(`[${song.title}](${song.url}) \n\n${display(time)}/${display(song.approxDurationMs)}\n${bar}\n\n **Special Effects**\n Bass Boost: **${serverQueue.boost.bass}**, Treble: **${serverQueue.boost.treble}**, Speed: **${serverQueue.boost.speed}**\n\nQueued by ${requester}`);
  return message.channel.send(npEmbed);
  }
  else{
    message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
  }
}
}

const display = millis => {
	millis -= millis % 1000;
	millis /= 1000;
	let seconde = millis % 60;
	const minute = (millis - seconde) / 60;
	if (seconde < 10)
		seconde = `0${seconde}`;
	return `${minute}:${seconde}`;
};
