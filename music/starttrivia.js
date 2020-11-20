const ytdl = require("ytdl-core-discord");
const Discord = require('discord.js');
 
const Check = require("youtube-video-exists");
const getYouTubeID = require("get-youtube-id");
const fs = require("fs");


module.exports = {
  name: 'music-trivia',
  description: 'This command allows you to play music trivia with friends!',
  commandtitle : 'Music-trivia',
  aliases: ['music-quiz', 'start-quiz', 'start-trivia'],
  usage: 'musictrivia',
  perms: 'Administrator',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
      return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.trivia).setDescription(`I'm sorry but The bot dev has disabled this command due to issues!`));
    serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
    const searchString = args.join(" ");
    if (message.member.hasPermission("ADMINISTRATOR") || client.config.devs.includes(message.author.id)){
      const { channel } = message.member.voice;
      if (!channel)return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.trivia).setDescription(`I'm sorry but you need to be in a voice channel to do this command!`));
      if (channel != message.guild.channels.cache.get(serverasigment.voicechannel)){return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.trivia).setDescription(`I cannot connect to your voice channel, make sure you are in the music channel!`));}
      const permissions = channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT"))return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.trivia).setDescription(`I cannot connect to your voice channel, make sure I have the proper permissions!`));
      if (!permissions.has("SPEAK"))return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.trivia).setDescription(`I cannot speak in this voice channel, make sure I have the proper permissions!`));
      const serverQueue = message.client.queue.get(message.guild.id);
      const thisTrivia = message.client.trivia.get(message.guild.id);
      var numberOfSongs = 5;
      if (serverQueue || thisTrivia){
          return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.trivia).setDescription(`I'm sorry but either music or trivia is already playing!`));
      }
      const triviaConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        isTriviaRunning: false,
        wasTriviaEndCalled: false,
        triviaQueue: [],
        triviaScore: new Map(),
        volume: 2,
      };
      message.client.trivia.set(message.guild.id, triviaConstruct);
      const serverTrivia = message.client.trivia.get(message.guild.id);
      const jsonSongs = fs.readFileSync(
        'helpers/musictrivia.json',
        'utf8'
      );
      serverTrivia.isTriviaRunning = true;
      message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.trivia)
      .setDescription("How many songs would you like the event to have? (Min: 5, Default: 5, Max: 25)"));
      const filter = msg => !msg.content.includes(serverasigment.prefix) && msg.author == message.author && (!isNaN(msg.content) && msg.content <= 25 && msg.content >= 5);
      const col = message.channel.createMessageCollector(filter, { time: 15000 });
      col.on('collect',async msg => {
        numberOfSongs = msg.content;
        col.stop();
      });   
      col.on('end', async collected => {
        if (collected.size === 0) {
        message.channel.send(new Discord.MessageEmbed()
        .setColor(client.config.embedColors.trivia)
        .setDescription(`No answer after 15 seconds, songs set to default.`));}
        var videoDataArray = JSON.parse(jsonSongs).songs;
        const randomXVideoLinks = getRandom(videoDataArray, numberOfSongs);
        const infoEmbed = new Discord.MessageEmbed()
        .setColor(client.config.embedColors.trivia)
        .setTitle('Starting Music Trivia Event')
        .setDescription(
          `Get ready! \nThere are ${numberOfSongs} songs, you have 30 seconds to guess either the singer/band or the name of the song.\nAnswer using \`${serverasigment.prefix}a {answer}\`! Good luck! \nYou can end the trivia at any point by using the end-trivia command`
        );
        message.channel.send(infoEmbed);
        for (let i = 0; i < randomXVideoLinks.length; i++) {
          const song = {
            url: randomXVideoLinks[i].url,
            singer: randomXVideoLinks[i].singer,
            title: randomXVideoLinks[i].title,
            id: getYouTubeID(randomXVideoLinks[i].url),
          };
          serverTrivia.triviaQueue.push(song);
        }
        const channelInfo = Array.from(
          message.member.voice.channel.members.entries()
        );
        channelInfo.forEach(user => {
          if (user[1].user.bot) return;
          serverTrivia.triviaScore.set(user[1].user.username, 0);
        });
        console.log(serverTrivia.triviaQueue);
        try {
          const connection = await channel.join();
          connection.on("disconnect", () => message.client.trivia.delete(message.guild.id));
          serverTrivia.connection = connection;
          var timeleft = 4;
          let countdownMsg = await message.channel.send( new Discord.MessageEmbed()
          .setColor(client.config.embedColors.trivia)
          .setDescription(`Starting in: `))
          var downloadTimer = setInterval(async function(){
          if(timeleft <= 0){
            clearInterval(downloadTimer);
            countdownMsg.edit(new Discord.MessageEmbed()
            .setColor(client.config.embedColors.trivia)
            .setDescription(` Starting!`))
            await play(serverTrivia.triviaQueue[0], message, client);
          } else {
          countdownMsg.edit(new Discord.MessageEmbed()
          .setColor(client.config.embedColors.trivia)
          .setDescription(`Starting in: ${timeleft + 1}`))
          }
          timeleft -= 1;
          }, 500);
        } catch (error) {
          console.error(`I could not join the voice channel: ${error}`);
          message.client.queue.delete(message.guild.id);
          await channel.leave();
          return message.channel.send(
            new Discord.MessageEmbed()
            .setColor(client.config.embedColors.trivia)
            .setDescription(`I cannot connect to your voice channel, make sure I have the proper permissions!`)
          );
        }   
      });      
     
      
    async function play(song, message, client){
        const trivia = client.trivia.get(message.guild.id);
        var endtriviaWords = ['stop-music-trivia','skip-trivia','end-trivia','stop-trivia','endtrivia']
        if (!song){
          trivia.voiceChannel.leave();
          client.trivia.delete(message.guild.id);
          const sortedScoreMap = sortScore(trivia.triviaScore);
          const embed = new Discord.MessageEmbed()
          .setColor(client.config.embedColors.trivia)
            .setTitle(`Music Quiz Results:`)
            .setDescription(
              getLeaderBoard(Array.from(sortedScoreMap.entries()))
            );
          return message.channel.send(embed);
        }
        const checking = await Check.getVideoInfo(song.id);
        if(!checking.existing || !checking.validId){
          message.channel.send(new Discord.MessageEmbed()
          .setColor(client.config.embedColors.trivia)
          .setDescription(`Video is unavailable, skipping`));
          trivia.triviaQueue.shift();
          return play(trivia.triviaQueue[0], message, client);
        }
        if(checking.existing && checking.private){
          message.channel.send(new Discord.MessageEmbed()
          .setColor(client.config.embedColors.trivia)
          .setDescription(`Video is unavailable, skipping`));
          trivia.triviaQueue.shift();
          return play(trivia.triviaQueue[0], message, client);
        }
        const dispatcher = trivia.connection
          .play( await ytdl(song.url), { type: 'opus' })
          .on("start", () => {
            var ended = false;
            let songNameFound = false;
            let songSingerFound = false;
            const filter = msg => msg.content.includes(`${serverasigment.prefix}a`) && trivia.triviaScore.has(msg.author.username);
            const collector = message.channel.createMessageCollector(filter, { time: 30000 });
            collector.on('collect', msg => {
            for (var i = 0; i < endtriviaWords.length; i++) {
                if (msg.content.includes(endtriviaWords[i])) {
                    ended = true;
                    return collector.stop();
                }
            }
            if (!trivia) {return collector.stop();}
            if (!trivia.triviaScore.has(msg.author.username)) return;
            if (msg.content.toLowerCase().includes(song.singer.toLowerCase()) && msg.content.toLowerCase().includes(song.title.toLowerCase())){
              if((songSingerFound && !songNameFound) ||(songNameFound && !songSingerFound)) {
                reactWithPoints(trivia.triviaScore, msg, 100); 
                return collector.stop();
              }
              else{
              reactWithPoints(trivia.triviaScore, msg, 200); 
              return collector.stop();
              }
            } 
            else if (msg.content.toLowerCase().includes(song.title.toLowerCase())) {
              if (songNameFound) return;
              songNameFound = true;
              if (songNameFound && songSingerFound) { reactWithPoints(trivia.triviaScore, msg, 100); return collector.stop(); }
              reactWithPoints(trivia.triviaScore, msg, 100);
            }
            else if (msg.content.toLowerCase().includes(song.singer.toLowerCase())) {
              if (songSingerFound) return;
              songSingerFound = true;
              if (songNameFound && songSingerFound) { reactWithPoints(trivia.triviaScore, msg, 100); return collector.stop(); }
              reactWithPoints(trivia.triviaScore, msg, 100);
            } 
            else {
              return msg.react(CustomEmojis.billysadreact);
            }
          });
          collector.on('end', function() {
            //console.log(client.trivia.get(message.guild.id));
            if (ended || !client.trivia.get(message.guild.id)) {
              return;// console.log("trivia ended");
            }
            else{
            const sortedScoreMap = sortScore(trivia.triviaScore);
            const songData = `${capitalize_Words(song.singer)}: ${capitalize_Words(song.title)}`;
            const embed = new Discord.MessageEmbed()
            .setColor(client.config.embedColors.trivia)
              .setTitle(`The song was:  ${songData}`)
              .setDescription( getLeaderBoard(Array.from(sortedScoreMap.entries())));
            message.channel.send(embed);
            trivia.triviaQueue.shift();
            dispatcher.end();
            return;
            }
          });})
          .on("finish", () => {
                return play(trivia.triviaQueue[0], message, client);
              })
          .on("error", (error) => console.error(error));
          dispatcher.setVolumeLogarithmic(trivia.volume / 5);
      };
    }
    }
}
function getRandom(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[(x in taken) ? taken[x] : x];
      taken[x] = (--len in taken) ? taken[len] : len;
    }
    return result;
  }

  function getLeaderBoard(arr) {
    if (!arr) return;
    let leaderBoard = 'Placements:';

    leaderBoard = `\n 👑   **${arr[0][0]}:** ${arr[0][1]}  points`;

    if (arr.length > 1) {
      for (let i = 1; i < arr.length; i++) {
        leaderBoard =
          leaderBoard + `\n\n  :clap: ${i + 1}: ${arr[i][0]}: ${arr[i][1]}  points`;
      }
    }
    return leaderBoard;
  }
  function capitalize_Words(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  function reactWithPoints(triviaScore, message, points){
    triviaScore.set(message.author.username, triviaScore.get(message.author.username) + points);
    message.react(CustomEmojis.billyhappyreact);
  }
function sortScore(triviaScore){
  return sortedScoreMap = new Map([...triviaScore.entries()].sort(function(a,b) {return b[1] - a[1];}));
}