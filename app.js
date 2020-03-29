const Discord = require('discord.js');
const mysql = require("mysql");
const bot = new Discord.Client();

const TOKEN = 'NjkzODI1MzM0ODM1MTUwOTE4.XoC3CQ.meL6PnRHcv91pS2xnyRytJ3oiZE';
const DATABASE_URI = 'mysql://bf3a501fa9da19:d1726edb@us-cdbr-iron-east-01.cleardb.net/heroku_bc02ac5f0db76cb?reconnect=true';

const PREFIX = '+';

const DATABASE = {
	host:       'us-cdbr-iron-east-01.cleardb.net',
	user:       'bf3a501fa9da19',
	password:   'd1726edb',
	database:   'heroku_bc02ac5f0db76cb'
};

var connection = mysql.createConnection(DATABASE);
connection.connect((err) => {
  if (err) throw err;
  console.log('Mysql: Connected!');
});

/*
connection.query(`CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  money int(11),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});*/

class Command {
	
	constructor(name,_fn) {
		this.name = name || '';
		this._fn = _fn || function(){};
		Command.List[this.name] = this;
	}
	
	static isExist(name) {
		return typeof Command.List !== 'undefined';
	}
	
	static execute(msg,data) {
		Command.List[data.name]._fn(msg,data.args);
	}
	
	
}
Command.List = {};

class ParserCommand {
	
	constructor(data) {
		this.rawdata = data || '';
		this.parse();
	}
	
	parse() {
		this.name = "";
		this.args = [];
		var i1 = this.rawdata.indexOf(' ');
		if (i1 > 0) {
			this.name = this.rawdata.substring(1,i1);
			this.args = this.rawdata.substring(i1+1).match(/"[^"]*"|[^ ]+/g);
			if (this.args == null) this.args = [];
		} else {
			this.name = this.rawdata.substring(1);
		}
	}
	
}


new Command('hello_world', function(msg,args) {
	msg.channel.send('wesh comment ça va?');
});


//console.log(TOKEN);

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content.substring(0,PREFIX.length)==PREFIX) {
    var data = new ParserCommand(msg.content);
	if (Command.isExist(data.name)) {
		Command.execute(msg,data);
	}
  }
});

bot.login(TOKEN);
