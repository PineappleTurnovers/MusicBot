const Discord = require('discord.js');
const geniusLyricsAPI = "yrcoC0YFzbB_92rdqz9ptQfrGN-ArsS1Mmj3dZLivMGPrDjb4y1-v55_-dRMu2xL";
const geniusApi = require('genius-lyrics-api');


module.exports = {
  name: 'lyrics',
  description: 'This command shows the lyrics of the current song.',
  commandtitle : 'Lyrics',
  aliases: ['lyrics', 'ly'],
  usage: 'lyrics',
  perms: 'Mini DJ role +',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`Unfortunatley due to our host, we have had to disable this command. We are working hard to try get it fixed!`)
    );
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid)||message.member.roles.cache.has(serverasigment.minidjroleid) ||client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
    const serverQueue = message.client.queue.get(message.guild.id);
    const serverTrivia = message.client.trivia.get(message.guild.id);
    if (serverTrivia){
      return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but trivia is playing!`));
    }
    const { channel } = message.member.voice;
    if (!channel)
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`I'm sorry but you need to be in a voice channel to do this command!`)
    );
    if (!serverQueue)
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`There is nothing playing.`)
    );
    var songName;
    if (!args[0]){
        var song = serverQueue.songs[0];
        songName = song.title;
    }
    else if (!isNaN(parseInt(args[0]))){
      if (serverQueue.songs[args[0]-1] == null) return message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
      .setDescription(`There is not a item in the queue with that number.`))
        else{
          var song = serverQueue.songs[args[0] - 1];
          songName = song.title;
        }
    }
    else{
      var argument = ""
      for(i = 0; i <= args.length - 1; i++){
        argument = argument + args[i];
      }
      songName = argument;
    }
    songName = songName.replace(/ *\([^)]*\) */g, '');
    songName = songName.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    );
    var help = parseTitleString(songName);
    var artist = help.artist; 
    var title = help.title;
    artist = artist.toLowerCase();
    title = title.toLowerCase();
    const options = {
      apiKey: geniusLyricsAPI,
      title: title,
      artist: artist,
      optimizeQuery: true
    }
    var help = await geniusApi.getLyrics(options);
    if (!help){return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
      .setTitle(songName + " lyrics:")
      .setDescription(`I'm sorry but the lyrics you are looking for were not found!`)
    );}
    else{
      return message.channel.send(
        new Discord.MessageEmbed()
        .setColor(client.config.embedColors.music)
        .setTitle(songName + " lyrics:")
        .setDescription(trimString(help, 2000))
      );
    }
}
else{
  message.channel.send(new Discord.MessageEmbed()
  .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
  }
}
}
trimString = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str)
function parseTitleString(string) {
  var artist, title, credits = [];
  var string = string || '';

  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  function capitalize(str) {
    if (typeof s !== 'string') return ' '
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  var baddies = ['[dubstep]', '[electro]', '[edm]', '[house music]',
    '[glitch hop]', '[video]', '[official video]', '(official video)',
    '(official music video)', '(lyrics)',
    '[ official video ]', '[official music video]', '[free download]',
    '[free dl]', '( 1080p )', '(with lyrics)', '(high res / official video)',
    '(music video)', '[music video]', '[hd]', '(hd)', '[hq]', '(hq)',
    '(original mix)', '[original mix]', '[lyrics]', '[free]', '[trap]',
    '[monstercat release]', '[monstercat freebie]', '[monstercat]',
    '[edm.com premeire]', '[edm.com exclusive]', '[enm release]',
    '[free download!]', '[monstercat free release]'];
  baddies.forEach(function(token) {
    string = string.replace(token + ' - ', '').trim();
    string = string.replace(token.toUpperCase() + ' - ', ' ').trim();
    string = string.replace(token.toLowerCase() + ' - ', ' ').trim();
    string = string.replace(capitalize(token) + ' - ', ' ').trim();

    string = string.replace(token, '').trim();
    string = string.replace(token.toUpperCase(), ' ').trim();
    string = string.replace(token.toLowerCase(), ' ').trim();
    string = string.replace(capitalize(token), ' ').trim();
  });

  var parts = string.split( ' - ' );

  for (var i = 0; i < parts.length; i++) {
    if ( baddies.indexOf( parts[i].toLowerCase() ) >= 0 ) {
      parts.splice( i , 1 );
    }
  }

  if (parts.length == 2) {
    artist = parts[0];
    title = parts[1];
  } else if (parts.length > 2) {
    // uh...
    artist = parts[0];
    title = parts[1];
  } else {
    artist = parts[0];
    title = parts[0];
  }


  // one last pass
  baddies.forEach(function(baddy) {
    title  = title.replace( new RegExp( escapeRegExp(baddy) , 'i') , '').trim();
    artist = artist.replace( new RegExp( escapeRegExp(baddy) , 'i') , '').trim();
  });

  // look for certain patterns in the string
  credits.push(  title.replace(/(.*)\((.*) remix\)/i,       '$2').trim() );
  credits.push(  title.replace(/(.*) ft\.? (.*)/i,          '$1').trim() );
  credits.push(  title.replace(/(.*) ft\.? (.*)/i,          '$2').trim() );
  credits.push(  title.replace(/(.*) feat\.? (.*)/i,        '$1').trim() );
  credits.push(  title.replace(/(.*) feat\.? (.*)/i,        '$2').trim() );
  credits.push(  title.replace(/(.*) featuring (.*)/i,      '$2').trim() );
  credits.push(  title.replace(/(.*) \(ft (.*)\)/i,         '$1').trim() );
  credits.push(  title.replace(/(.*) \(ft (.*)\)/i,         '$2').trim() );
  credits.push(  title.replace(/(.*) \(feat\.? (.*)\)/i,    '$2').trim() );
  credits.push(  title.replace(/(.*) \(featuring (.*)\)/i,  '$2').trim() );
  credits.push( artist.replace(/(.*) ft\.? (.*)/i,          '$1').trim() );
  credits.push( artist.replace(/(.*) ft\.? (.*)/i,          '$2').trim() );
  credits.push( artist.replace(/(.*) feat\.? (.*)/i,        '$1').trim() );
  credits.push( artist.replace(/(.*) feat\.? (.*)/i,        '$2').trim() );
  credits.push( artist.replace(/(.*) featuring (.*)/i,      '$2').trim() );
  credits.push( artist.replace(/(.*) \(ft (.*)\)/i,         '$1').trim() );
  credits.push( artist.replace(/(.*) \(ft (.*)\)/i,         '$2').trim() );
  credits.push( artist.replace(/(.*) \(feat\.? (.*)\)/i,    '$1').trim() );
  credits.push( artist.replace(/(.*) \(featuring (.*)\)/i,  '$2').trim() );
  credits.push( artist.replace(/(.*) & (.*)/ig,             '$1').trim() );
  credits.push( artist.replace(/(.*) & (.*)/ig,             '$2').trim() );
  credits.push( artist.replace(/(.*) vs\.? (.*)/i,          '$1').trim() );
  credits.push( artist.replace(/(.*) vs\.? (.*)/i,          '$2').trim() );
  credits.push( artist.replace(/(.*) x (.*)/i,              '$1').trim() );
  credits.push( artist.replace(/(.*) x (.*)/i,              '$2').trim() );

  var creditMap = {};
  credits.forEach(function(credit) {
    if (credit !== title) {
      creditMap[ credit ] = credit;
    }
  });

  var output = {
      artist: artist
    , title: title
    , credits: Object.keys(creditMap)
  };

  //console.log('artist: ' + artist);
  //console.log('title: ' + title);
  return(output);
}
