const ytdl = require("ytdl-core-discord");
const Discord = require('discord.js');
const Search = require("yt-search");
const ytpl = require('ytpl');

const Check = require("youtube-video-exists");
const urlParse = require('url');
const YoutubeVideo = require('ytdl-core');
const prism = require('prism-media');
const { info } = require("console");

module.exports = {
  name: 'play',
  description: 'This command play any music.',
  commandtitle : 'Play',
  aliases: ['play', 'p'],
  usage: 'play {link/name of the song}',
  perms: 'Mini DJ role +',
  cooldown: 4,
  async execute(client, message, args, serverstatic, searching = false){
    serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } }); // just db stuff not needed so you can ignore
    const searchString = args.join(" ");
    if (message.member.roles.cache.has(serverasigment.djroleid)||message.member.roles.cache.has(serverasigment.minidjroleid) || client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
      const { channel } = message.member.voice;
      const serverTrivia = message.client.trivia.get(message.guild.id);
      if (serverTrivia){
        return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but trivia is playing!`));
      }
      if (!channel)return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but you need to be in a voice channel to do this command!`));
      if (channel != message.guild.channels.cache.get(serverasigment.voicechannel)){return message.channel.send(new Discord.MessageEmbed().setColor('#96E2DE').setDescription(`I cannot connect to your voice channel, make sure you are in the music channel!`));}
      const permissions = channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT"))return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I cannot connect to your voice channel, make sure I have the proper permissions!`));
      if (!permissions.has("SPEAK"))return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I cannot speak in this voice channel, make sure I have the proper permissions!`));
      if (!args[0]){
        return message.channel.send(new Discord.MessageEmbed()
        .setColor(client.config.embedColors.music)
        .setDescription(`<@${message.member.user.id}> Not enough arguments given!\n\n Command usage:\n\`${serverasigment.prefix}${this.usage}\` `));
      }
      const serverQueue = message.client.queue.get(message.guild.id);
      if (serverQueue) {
        if (serverQueue.songs.length == 150){
          const tobig =  new Discord.MessageEmbed();
          tobig.setColor(client.config.embedColors.music)
          tobig.setDescription(`Reached queue limit!`)
          return message.channel.send(tobig);
        } 
      }
      let msg;
      if (searching == false){
        if (serverasigment.announce){
          msg = await message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`Searching for your request.`));
        }
        else{
          msg = null;
        }
        const isPlaylist = await ytpl.validateID(searchString);
        if(isPlaylist){ 
          //return msg.edit(new Discord.MessageEmbed().setColor('#96E2DE').setDescription(`Due to restrictions with youtube we cannot currently play playlists`));
          let plID = await ytpl.getPlaylistID(searchString);
          Search({listId: plID}, async function(err, res){  
              if (err){ return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`An unknown error occurred.`));}
              //let videos = res.videos;
              var videos;
              if (res.videos.length > 50){
                videos = res.videos.slice(0, 50);
              }
              else{
                videos = res.videos;
              }
              //console.log(videos.length)
             // console.log(videos)
              //console.log(videos[0]);
              for (let i = 0; i < videos.length; i++){
                 await handleVideo(videos[i], message, channel, true, null);
                //await timer(1);
              }
              if (msg != null)
                msg.edit(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(` Successfully added **${res.title}** to the queue!`)); 
              else
              message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(` Successfully added **${res.title}** to the queue!`)); 
            });
        }
        else{
          if (msg != null){
            if (!searchString){
              return msg.edit(new Discord.MessageEmbed()
              .setColor(client.config.embedColors.music)
              .setDescription(`Not enough arguments given.`));}
              Search(searchString, async function(err, res){  
                if (err){ return msg.edit(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`An unknown error occurred.`));}
                let videos = res.videos.slice(0, 1);
                //console.log(videos[0]);
                await handleVideo(videos[0], message, channel, false, msg);
              });
          }
          else{
            if (!searchString){
              return message.channel.send(new Discord.MessageEmbed()
              .setColor(client.config.embedColors.music)
              .setDescription(`Not enough arguments given.`));}
              Search(searchString, async function(err, res){  
                if (err){ return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`An unknown error occurred.`));}
                let videos = res.videos.slice(0, 1);
                //console.log(videos[0]);
                msg = await message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`Loading your request.`));
                await handleVideo(videos[0], message, channel, false, msg);
              });
          }
        }
      }
      else{
        msg = await message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`Searching for your request.`));
        Search(searchString, async function(err, res){  
            if (err){ return msg.edit(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`An unknown error occurred.`));}
            let videos = res.videos.slice(0, 10);
            const resp = new Discord.MessageEmbed()
            .setColor(client.config.embedColors.music)
            .setTitle('**Songs found:**');
            for(var i = 0; i < videos.length; i++){
               var item = videos[i];
               if (resp.description == undefined) resp.setDescription(`\n${i+1}. [${item.title}](${item.url})`);
               else resp.setDescription(resp.description + `\n${i+1}. [${item.title}](${item.url})`);
            }
            resp.setDescription(resp.description +  `\n\n**Choose a number between** \`1-${videos.length}\` or type \`cancel\` to cancel your search.`);
            resp.setFooter("Requested by " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
            msg.edit(resp);
    
            const filter = m => (((!isNaN(m.content) && m.content < videos.length+1 && m.content > 0) || (m.content == "cancel")) && m.author == message.author);
            const collector = message.channel.createMessageCollector(filter, { time: 15000 });
            collector.videos = videos;
            collector.once('collect', async function(m){
              if(m.content == "cancel"){
                collector.stop()
                return message.channel.send(new Discord.MessageEmbed()
                .setColor(client.config.embedColors.music)
                .setDescription(`Cancelled search.`));
              }
              else{
                //console.log(this.videos[parseInt(m.content)-1])
                var testthumbnail = [this.videos[parseInt(m.content)-1].thumbnail]
                const info = {
                  title: [this.videos[parseInt(m.content)-1].title],
                  videoId: [this.videos[parseInt(m.content)-1].videoId],
                  thumbnail: testthumbnail[0],
                }
               // console.log(info);
                
                await handleVideo(info, message, channel, false, null);
                collector.stop();
              }
            });
            collector.on('end', collected => {
              if (collected.size === 0) {
              msg.edit(new Discord.MessageEmbed()
              .setColor(client.config.embedColors.music)
              .setDescription(`No answer after 15 seconds, operation canceled.`));}
            });
          });
      }
  }
  else{
    message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions.`));
    }
    async function handleVideo(songInfo, message, voiceChannel, playlist = false, msg){
      //console.log(songInfo);
      if (!songInfo){
        if (msg){
          return msg.edit(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`This song does not exist or the link you have provided is invalid!`));
        }
        return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`This song does not exist or the link you have provided is invalid!`));
      }
      const song = {
        id: songInfo.videoId,
        title: songInfo.title,
        url: `https://www.youtube.com/watch?v=${songInfo.videoId}`,
        approxDurationMs: 0,
        request: message.member.user,
        next: null,
        format: null,
        thumbnail: songInfo.thumbnail,
        infoGot: false,
      };
      
        const channel = voiceChannel;
        if (!channel.joinable) {
          message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I cannot join your voice channel.`));
          return;
        }
        await channel.join();
        const parsed = urlParse.parse(song.url, true);
        if (parsed.query.t)
          song.time = parsed.query.t * 1000;
      const serverQueue = message.client.queue.get(message.guild.id);
      if (serverQueue) {
        if (serverQueue.songs.length == 150){
          if (playlist){ return undefined;}
          const tobig =  new Discord.MessageEmbed();
          tobig.setColor(client.config.embedColors.music)
          tobig.setDescription(`Reached queue limit!`)
          if (msg != null){
            return msg.edit(tobig)
            }
            else{
            return message.channel.send(tobig);
            }
        } 
        if (serverQueue.songs.includes(song)){
          if (playlist) {return undefined;}
        }
        serverQueue.songs.push(song);
        if (serverQueue.userRequests.indexOf(song.request.id) !== -1){}
        else serverQueue.userRequests.push(song.request.id);
        if (playlist){ return undefined;}
        else{
          const added = new Discord.MessageEmbed();
          added.setColor(client.config.embedColors.music)
          added.setDescription(` [${song.title}](${song.url}) has been added to the queue!`)
          added.setThumbnail(song.thumbnail)
          added.addField("**Queued by**", `<@${song.request.id}>`, true)
          added.addField("**Position in queue**", `${serverQueue.songs.indexOf(song)+1}`, true);
        if (msg != null){
        return msg.edit(added)
        //.setDescription(`\n\n**Queued by**\n <@${music.request.id}>  \n\n**Position in queue** \n${serverQueue.songs.indexOf(music)+1}`));
        }
        else{
        return message.channel.send(added);
        }
      }
      }
      else{
        const queueConstruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          oldSongs: [],
          playing: true,
          loop: false,
          loopQueue: false,
          back: false,
          jump: false,
          autoplay: false,
          jumpTo: 0,
          userRequests: [],
          boost: {
            bass: 0,
            treble: 0,
            speed: 1,
          },
          volume: 2,
          skipToPoint: false,
          skips: new Set(),
        };
        message.client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        //console.log(queueConstruct.songs);
        if (queueConstruct.userRequests.indexOf(song.request.id) !== -1) { }//console.log("already has this id.");
        else queueConstruct.userRequests.push(song.request.id);
        try {
          const connection = message.guild.me.voice.connection;
          connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
          queueConstruct.connection = connection;
          const songToPlay = queueConstruct.songs[0];
          await play(songToPlay, msg);
        } catch (error) {
          console.error(`I could not join the voice channel: ${error}`);
          message.client.queue.delete(message.guild.id);
          await channel.leave();
          const added = new Discord.MessageEmbed();
          added.setColor(client.config.embedColors.music)
          added.setDescription(`I could not join the voice channel or a unknown error occured!`)
          if (msg != null){
            return msg.edit(added);
          }
          else{
            return message.channel.send(added);
         }
        }
      }
    }

    const play = async(song, msg) => {
      const queue = client.queue.get(message.guild.id);
      if (!song) {
        queue.voiceChannel.leave();
        client.queue.delete(message.guild.id);
        return message.channel.send(new Discord.MessageEmbed()
        .setColor(client.config.embedColors.music)
          .setDescription(` Queue ended or you stopped me, thanks for listening!`));
      }
      //console.log(song.infoGot);
      if (!song.infoGot){
      var music;
      try{
        music = await YoutubeVideo.getInfo(song.url, {filter: 'audioonly'});
      }
      catch (error){
        queue.songs.shift();
        play(queue.songs[0]);
        const added = new Discord.MessageEmbed();
          added.setColor(client.config.embedColors.music)
          added.setDescription(`A unknown error occured, skipping!`)
          if (msg != null){
            return msg.edit(added);
          }
          else{
            return message.channel.send(added);
         }
      }
      if (!music || music == undefined){
      return;
      }
      song.next = music.related_videos[0];
      song.thumbnail = music.player_response.videoDetails.thumbnail.thumbnails[0].url;
      song.infoGot = true;
      //const format = song.formats.find(format => format != undefined && !format.qualityLabel && format.audioChannels);
      const bestFormat = nextBestFormat(music.formats, music.player_response.videoDetails.isLiveContent);
      if (!bestFormat){
        queue.songs.shift();
        play(queue.songs[0]);
        const added = new Discord.MessageEmbed();
          added.setColor(client.config.embedColors.music)
          added.setDescription(`No formats found, skipping!`)
          if (msg != null){
            return msg.edit(added);
          }
          else{
            return message.channel.send(added);
         }
      }
      song.approxDurationMs = bestFormat.approxDurationMs;
      song.bestUrl = bestFormat.url;
      song.infoGot = true;
    }
    //console.log(song.infoGot);
      const transcoder = generateTranscoder(song.bestUrl, 
        {
		      start: song.time ? `${song.time}ms` : 0,
		      duration: song.approxDurationMs ? `${song.approxDurationMs}ms` : 0
	      }, queue.boost);
	    const opus = new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 })
      const stream = transcoder.pipe(opus);
      stream.on('close', ()=>{
        transcoder.destroy();
			  opus.destroy();
      });
      const dispatcher = queue.connection
          .play(stream , { type: 'opus' })
          .on("finish", async() => {
          dispatcher.destroy();
          if (queue.skipToPoint){
            await play(client.queue.get(message.guild.id).songs[0]);
            return;
          }
          else if (!Array.from(client.queue.get(message.guild.id).connection.channel.members.values()).filter(member => !member.user.bot).length) {
            client.queue.get(message.guild.id).connection.disconnect();
            return;
          }
          else{
            queue.skips = new Set();
          if(queue.jump){          
            var old = queue.songs.splice(0, queue.jumpTo);
            for (i = 0; i < old.length; i++)
            {
              queue.oldSongs.push(old[i]);
            }
            queue.jump = false;
          }
          else if (queue.back){
              var lastItem = queue.oldSongs.pop();
              queue.songs.unshift(lastItem);
              queue.back = false;
          }
          else{
            var x = queue.songs[0];
            if (queue.loop){
              x.time = 0;
              await play(client.queue.get(message.guild.id).songs[0]);
              return;
            }
            else{
              if (queue.loopQueue){
                x.time = 0;
                queue.songs.push(x);
              }
              else if(queue.autoplay && queue.songs.length == 1 && song.next){
                const nextInfo = song.next;
                //console.log(nextInfo);
                const next = {
                  id: nextInfo.id,
                  title: nextInfo.title,
                  url: `https://www.youtube.com/watch?v=${nextInfo.id}`,
                  approxDurationMs: 0,
                  request: 'AutoPlay',
                  next: null,
                  format: null,
                  thumbnail: null,
                  infoGot: false,
                };
                  queue.songs.push(next);
              }
              //console.log(queue.autoplay, queue.songs.length, song.next);
              queue.songs.shift();
              queue.oldSongs.push(x);
          }
          }
          await play(queue.songs[0]);
        }
        }).on("error", (error) => console.error(error));
        dispatcher.setVolumeLogarithmic(queue.volume / 5);
        if (!queue.skipToPoint){
      
          if (msg != null){
          msg.edit(new Discord.MessageEmbed()
          .setColor(client.config.embedColors.music)
          .setDescription(`🎶 Started playing: [${song.title}](${song.url}).`));
          }
          else{
            if (serverasigment.announce){
            message.channel.send(new Discord.MessageEmbed()
            .setColor(client.config.embedColors.music)
          .setDescription(`🎶 Started playing: [${song.title}](${song.url}).`));
            }
          }
      }
        if (queue.skipToPoint){
          queue.skipToPoint = false;
        }
    };
  }
}


const generateTranscoder = (url, { start = 0, duration = 0 } = {}, { bass = 0, treble = 0, speed = 1 } = {}) => {
	let args = [
		'-reconnect', '1',
    '-reconnect_streamed', '1',
    '-reconnect_delay_max', '5',
		'-ss', start
	];
	if (duration)
		args = args.concat(['-to', duration]);
	args = args.concat([
		'-i', url,
		'-f', 's16le',
		'-ar', '48000',
		'-ac', '2',
		'-c:v', 'libx264',
		'-preset', 'veryslow',
		'-crf', '0',
		'-movflags', '+faststart',
		'-af', `bass=g=${bass}, treble=g=${treble}, atempo=${speed}, dynaudnorm=f=200`
	]);
	const transcoder = new prism.FFmpeg({ args });
	transcoder._readableState.reading = true;
	transcoder._readableState.needReadable = true;
	return transcoder;
}

function timer(ms) {
 return new Promise(res => setTimeout(res, ms));
}

function nextBestFormat(formats, isLive) {
	let filter = format => format.audioBitrate;
	if (isLive) filter = format => format.audioBitrate && format.isHLS;
	formats = formats
		.filter(filter)
		.sort((a, b) => b.audioBitrate - a.audioBitrate);
	return formats.find(format => !format.bitrate) || formats[0];
}



