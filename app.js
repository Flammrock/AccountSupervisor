const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = 'NjkzODI1MzM0ODM1MTUwOTE4.XoCtXw.PF8tzCCwrZ4qnBHpcVkLM9g_aro';

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

bot.login(TOKEN);
