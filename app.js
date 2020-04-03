const Discord = require('discord.js');
const mysql = require("mysql");
const bot = new Discord.Client();


const TOKEN = 'NjkzODI1MzM0ODM1MTUwOTE4.XoLXNQ.hFJvWBxgMR3gd7_A6iHSEOcDZwU';
const DATABASE_URI = process.env.CLEARDB_DATABASE_URL;
const TOKENINIT = 'qSlZyUk-w0-aOWJHuInzBA';


//const DATABASE_PARSE = DATABASE_URI.match(/mysql:\/\/([^:]+):([^@]+)@([^\/]+)\/([^\?]+)\??/);

//console.log(DATABASE_PARSE);

const PREFIX = '+';

/*const DATABASE = {
	host:       DATABASE_PARSE[3],
	user:       DATABASE_PARSE[1],
	password:   DATABASE_PARSE[2],
	database:   DATABASE_PARSE[4]
};*/

var DATABASE = {
	host:       null,
	user:       null,
	password:   null,
	database:  null
};


console.log(DATABASE);

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

function query(SQL,fn) {
	
	var connection = mysql.createConnection(DATABASE);
	connection.connect((err) => {
		if (err) {connection.end();console.log(err);return;};
		if (SQL) {
			connection.query(SQL,(err,rows) => {
				if (err) {console.log(err);connection.end();return;};
				try {
					fn(err,rows);
					connection.end();return;
				} catch (e) {connection.end();console.log(e);return;}
			});
		} else {
			console.log('Mysql: Connected!');
			connection.end();
		}
	});
	connection.on('error', function() {connection.end();});
	
}
function escape_mysql(s) {return s.replace(/'/g,"''");}
query();

/*
query(`DROP TABLE users`,(err,rows) => {
query(`DROP TABLE bank`,(err,rows) => {
query(`DROP TABLE shop`,(err,rows) => {
query(`DROP TABLE items`,(err,rows) => {
query(`DROP TABLE job`,(err,rows) => {
query(`DROP TABLE company`,(err,rows) => {
query(`DROP TABLE dataapp`,(err,rows) => {
query(`DROP TABLE characterdata`,(err,rows) => {});});});});});});});});
*/

function createTables(msg,callback) {
	query(`CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if (err) {
	  if (msg) msg.channel.send('```diff\n-Error when creating/updating users table: '+err.toString()+'\n```');
	  else throw err;
  }

  if (msg) msg.channel.send('```css\n   - [users] table created/updated with Success!\n```');

query(`CREATE TABLE IF NOT EXISTS bank (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if (err) {
	  if (msg) msg.channel.send('```diff\n-Error when creating/updating bank table: '+err.toString()+'\n```');
	  else throw err;
  }

  if (msg) msg.channel.send('```css\n   - [bank] table created/updated with Success!\n```');

query(`CREATE TABLE IF NOT EXISTS shop (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if (err) {
	  if (msg) msg.channel.send('```diff\n-Error when creating/updating shop table: '+err.toString()+'\n```');
	  else throw err;
  }

  if (msg) msg.channel.send('```css\n   - [shop] table created/updated with Success!\n```');

query(`CREATE TABLE IF NOT EXISTS items (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if (err) {
	  if (msg) msg.channel.send('```diff\n-Error when creating/updating items table: '+err.toString()+'\n```');
	  else throw err;
  }

  if (msg) msg.channel.send('```css\n   - [items] table created/updated with Success!\n```');

query(`CREATE TABLE IF NOT EXISTS job (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if (err) {
	  if (msg) msg.channel.send('```diff\n-Error when creating/updating job table: '+err.toString()+'\n```');
	  else throw err;
  }

  if (msg) msg.channel.send('```css\n   - [job] table created/updated with Success!\n```');

query(`CREATE TABLE IF NOT EXISTS company (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if (err) {
	  if (msg) msg.channel.send('```diff\n-Error when creating/updating company table: '+err.toString()+'\n```');
	  else throw err;
  }

  if (msg) msg.channel.send('```css\n   - [company] table created/updated with Success!\n```');

query(`CREATE TABLE IF NOT EXISTS dataapp (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if (err) {
	  if (msg) msg.channel.send('```diff\n-Error when creating/updating dataapp table: '+err.toString()+'\n```');
	  else throw err;
  }

  if (msg) msg.channel.send('```css\n   - [shop] dataapp created/updated with Success!\n```');

query(`CREATE TABLE IF NOT EXISTS characterdata (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if (err) {
	  if (msg) msg.channel.send('```diff\n-Error when creating/updating characterdata table: '+err.toString()+'\n```');
	  else throw err;
  }

  if (msg) msg.channel.send('```css\n   - [characterdata] table created/updated with Success!\n```');
  callback();
});
});});});});});});});

}


//////////////////////////////////////
//           COMMAND BOT            //
//////////////////////////////////////
class Command {
	
	constructor(name,_fn,_fnhelp) {
		this.name = name || '';
		this._fn = _fn || function(){};
		this._fnhelp = _fnhelp || function(){};
		Command.List[this.name] = this;
	}
	
	static isExist(name) {
		return typeof Command.List[name] !== 'undefined';
	}
	
	static execute(appdata,msg,data) {
		Command.List[data.name]._fn(appdata,data.name,msg,data.args);
	}
	
	static checkPermission(msg,mode,l) {
		switch (mode) {
			case 'ADMIN':
				if (!(msg.member.roles.cache.some(r => r.name === "AccountSupervisorAdmin") || msg.member.hasPermission("ADMINISTRATOR"))) {
					if (!l) msg.delete();
					if (!l) msg.author.send('Sorry, you don\'t have the permissions :cold_sweat:\nAnd i\'ve decided to delete your message.');
					return false;
				}
				break;
			case 'CITIZEN':
				if (!(msg.member.roles.cache.some(r => r.name === "AccountSupervisorAdmin") || msg.member.roles.cache.some(r => r.name === "AccountSupervisorCitizen") || msg.member.hasPermission("ADMINISTRATOR"))) {
					if (!l) msg.delete();
					if (!l) msg.author.send('Sorry, you don\'t have the permissions :cold_sweat:\nAnd i\'ve decided to delete your message.');
					return false;
				}
				break;
			default:
				break;
		}
		return true;
	}
	
	static checkSalons(msg,salonslist) {
		var test = /<#(\d+)>/;
		for (var i = 0; i < salonslist.length; i++) {
			if (salonslist[i].match(test)!=null) {
				if (msg.guild.channels.cache.find(r => r.id == [salonslist[i].match(test)[1]])) {
					continue;
				}
			}
			msg.reply('Sorry, '+salonslist[i]+' doesn\'t exist :cold_sweat:');
			return false;
		}
		return true;
	}
	
	static checkItems(msg,itemsList,callback) {
		if (itemsList.length==0) {callback();return;}
		for (var i = 0; i < itemsList.length; i++) {
			itemsList[i] = escape_mysql(itemsList[i]);
		}
		var q = 'name = \''+itemsList.join('OR name = \'')+'\'';
		query('SELECT COUNT(*) as total FROM items WHERE '+q, function(err,rows) {
			if (rows['total'] != itemsList.length) {
				msg.reply('Sorry, one of the item doesn\'t exist :cold_sweat:\nPlease use the command `+list_items` to see the list of items available');
			} else {
				callback();
			}
		});
	}
	
	static getCharacter(msg,id,callback) {
		var idsave = id;
		var test = (id+'').match(/<@!?(\d+)>/);
		if (test==null) {
			query('SELECT * FROM characterdata WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length==0) {
					msg.reply('Sorry,`'+args[0]+'` Character doesn\'t exist :cold_sweat:\nType the Name of Character or type `@` then select a user!');
					return;
				}
				var data = JSON.parse(rows[0].data);
				var charname = rows[0].name.substring(rows[0].name.indexOf('_')+1).substring(rows[0].name.substring(rows[0].name.indexOf('_')+1).indexOf('_')+1);
				callback((data.owner+':')+charname,charname);
			});
		} else {
			id = test[1];
			query('SELECT * FROM characterdata WHERE data LIKE \'%selected_'+escape_mysql(id)+'%\' AND name LIKE \''+escape_mysql('name_'+msg.guild.id+'_')+'%\'',function(err,rows){
				if (rows.length==0) {
					var t = msg.guild.members.cache.find(r => r.id == id);
					if (t) {
						var user = t.user;
						var name = user.username + '#' + user.discriminator;
						callback(id,name);
					} else {
						msg.reply('Sorry,'+args[0]+' User doesn\'t exist :cold_sweat:\nType the Name of Character or type `@` then select a user!');
					}
					return;
				}
				var charname = rows[0].name.substring(rows[0].name.indexOf('_')+1).substring(rows[0].name.substring(rows[0].name.indexOf('_')+1).indexOf('_')+1);
				callback((id+':')+charname,charname);
			});
		}
	}
	
	static getDataApp(guildid,callback) {
		query('SELECT * FROM dataapp WHERE name LIKE \'%'+guildid+'%\'', function(err,rows) {
			var data = {};
			for (var i = 0; i < rows.length; i++) {
				var name = rows[i].name.substring(rows[i].name.indexOf('_')+1).substring(rows[i].name.substring(rows[i].name.indexOf('_')+1).indexOf('_')+1);
				try {
					data[name] = JSON.parse(rows[i].data);
				} catch (e) {
					data[name] = rows[i].data;
				}
			}
			data['money-name'] = data['money-name'] || 'Money';
			callback(data);
		});
	}

	static extractData(content) {
		var data = [];
		if (content.substring(0,1)=='"' && content.slice(-1)=='"') {
			content = content.slice(1,-1);
		}
		content.replace(/\[[^\[\]]*\]|[^ ]+/g,function(m){
			data.push(m.match(/^\[?([^"]*)\]?/)[1]);
			return m;
		});
		return data;
	}
}
Command.List = {};

class ParserCommand {
	
	constructor(data) {
		this.rawdata = data || '';
		this.parse();
	}
	
	parse() {
		var _this = this;
		this.name = "";
		this.args = [];
		var i1 = this.rawdata.indexOf(' ');
		if (i1 > 0) {
			this.name = this.rawdata.substring(PREFIX.length,i1);
			this.args = [];
			this.rawdata.substring(i1+1).replace(/"[^"]*"|[^ ]+/g,function(m){
				_this.args.push(m.match(/^"?([^"]*)"?/)[1]);
				return m;
			});
		} else {
			this.name = this.rawdata.substring(1);
		}
	}
	
}


var Speech = {
	
	"CompanyAlreadyExist": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Company is already created :cold_sweat:');
	},
	"CompanyNotExist": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
	},
	
	"BankAlreadyExist": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Bank is already created :cold_sweat:');
	},
	"BankNotExist": function(data,msg,cname,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Bank doesn\'t exist :cold_sweat:');
	},
	
	"ShopAlreadyExist": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Shop is already created :cold_sweat:');
	},
	"ShopNotExist": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
	},
	
	"ItemAlreadyExist": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Item is already created :cold_sweat:');
	},
	"ItemNotExist": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
	},
	
	"JobAlreadyExist": function(data,cname,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Job is already created :cold_sweat:');
	},
	"JobNotExist": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, `'+args[0]+'` Job doesn\'t exist :cold_sweat:');
	},
	
	
	"NotEnoughtMoney": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, you don\'t have enought '+data['money-name']+' :cold_sweat:');
	},
	"NotHaveBankAccount": function(data,cname,msg,name,args) {
		msg.channel.send(name+', '+'Sorry, you don\'t have an `'+args[2]+'` Bank account :cold_sweat:');
	}
	
};



function tryConnect(args,callback) {
	var connection = mysql.createConnection({
		host:       args[0],
		user:       args[1],
		password:   args[2],
		database:   args[3]
	});
	connection.connect((err) => {
		if (err) {connection.end();callback(false);return;};
		connection.end();
		callback(true);
	});
	connection.on('error', function() {connection.end();callback(false);});
}


// ADMIN
new Command('init', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 4) {
		msg.reply('BAD ARGUMENTS\nPlease use `'+PREFIX+'help '+commandname+'` for help.');
		return;
	}
	// ARGS :
	//    - Host
	//    - User
	//    - Password
	//    - Database
	msg.delete();
	var f = function() {
		tryConnect(args,function(r){
			if (r) {
				msg.reply('```css\nConnected to the MySQL Remote Server with Success!\n```');
				msg.channel.send('```css\nSaving data..\n```');
				var admin = msg.guild.roles.cache.find(r => r.name == 'AccountSupervisorAdmin');
				var everyone = msg.guild.roles.cache.find(r => r.name == '@everyone');
				msg.guild.channels.create('accountsupervisor-database-config', {
					position: 0,
					permissionOverwrites: [
						{
							id: admin.id,
							allow: [8,1024,2048,4096]
						},
						{
							id: everyone.id,
							deny: [1024,2048,4096]
						}
					 ]
				})
				.then(function(){
					msg.channel.send('```css\n   - `accountsupervisor-database-config` Text Channel created with Success!\n```');
					var configChannel = msg.guild.channels.cache.find(r=>r.name=='accountsupervisor-database-config');
					configChannel.send('```\n['+TOKENINIT+'] Configuration:\n   • HOST: '+args[0]+'\n   • USERNAME: '+args[1]+'\n   • PASSWORD: '+args[2]+'\n   • DATABASE: '+args[3]+'\n```');
					msg.channel.send('```css\n   - Data saved with Success!\n```');
					msg.channel.send('```css\nCreate tables..\n```');
					createTables(msg,function(){
						msg.channel.send('```css\nUse `'+PREFIX+commandname+'` to change the configuration!\n```');
					});
				})
				.catch(function(e){
					msg.channel.send('```diff\n-Error: '+e.toString()+'\n```');
				});
			} else {
				msg.reply('```diff\n-Error when attempting to connect to the MySQL Remote Server!\n-Please check if the host, user, password and database name are good!\n```');
			}
		});
	};
	if (msg.guild.channels.cache.find(r=>r.name=='accountsupervisor-database-config')) {
		msg.guild.channels.cache.find(r=>r.name=='accountsupervisor-database-config').delete().then(function(){
			f();
		}).catch(function(e){
			msg.reply('```diff\n-Error: '+e+'\n```');
		});
	} else {
		f();
	}
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [HOST] [USERNAME] [PASSWORD] [DATABASE-NAME]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Need', 'The specified MySQL Server must allow remote access!', true)
		.addField('Description', 'This Bot use a Database to save all data and we give you the possibility to use your own database 😁', false)
	msg.channel.send(_embed);
});





// CITIZEN
new Command('help', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Command Name
	if (typeof Command.List[args[0]] !== 'undefined') {
		Command.List[args[0]]._fnhelp(msg,args[0]);
	}
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CommandName]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Get more information about the specified Command. Example:\n  '+PREFIX+name+' ping', false)
	msg.channel.send(_embed);
});

// ADMIN
new Command('ping', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	msg.channel.send('pong');
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Just Ping the bot to known if the bot is really online.', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('all-reset-all', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	query('DELETE FROM users',function(err,rows1){
		msg.reply('User System is reset!');
	});
	query('DELETE FROM bank',function(err,rows1){
		msg.reply('Bank System is reset!');
	});
	query('DELETE FROM shop',function(err,rows1){
		msg.reply('Shop System is reset!');
	});
	query('DELETE FROM items',function(err,rows1){
		msg.reply('Item System is reset!');
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Reset Bank, Users, Shop, Items Systèmes.', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('set-currency-name', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	query('SELECT * FROM dataapp WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql('money-name')+'\'',function(err,rows){
		if (rows.length > 0) {
			query('UPDATE dataapp SET data = \''+escape_mysql(args[0])+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql('money-name')+'\'',function(err,rows){
				msg.channel.send('Currency Name updated with success!');
			});
		} else {
			query('INSERT INTO dataapp(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql('money-name')+'\',\''+escape_mysql(args[0])+'\')',function(err,rows){
				msg.channel.send('Currency Name updated with success!');
			});
		}
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [money-name]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Change the Money Name, example:\n  '+PREFIX+name+' Yens\n  '+PREFIX+name+' "Super Yens"', false)
	msg.channel.send(_embed);
});


// ADMIN
new Command('destroy-data', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	query(`DROP TABLE users`,(err,rows) => {
	query(`DROP TABLE bank`,(err,rows) => {
	query(`DROP TABLE shop`,(err,rows) => {
	query(`DROP TABLE items`,(err,rows) => {
	query(`DROP TABLE job`,(err,rows) => {
	query(`DROP TABLE company`,(err,rows) => {
	query(`DROP TABLE dataapp`,(err,rows) => {
	query(`DROP TABLE characterdata`,(err,rows) => {});});});});});});});});
	query(`CREATE TABLE IF NOT EXISTS users (
	  id int(11) NOT NULL AUTO_INCREMENT,
	  name text,
	  data text,
	  PRIMARY KEY (id)
	) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
	  if(err) throw err;

	  console.log('TABLE CREATED!');

	query(`CREATE TABLE IF NOT EXISTS bank (
	  id int(11) NOT NULL AUTO_INCREMENT,
	  name text,
	  data text,
	  PRIMARY KEY (id)
	) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
	  if(err) throw err;

	  console.log('TABLE CREATED!');

	query(`CREATE TABLE IF NOT EXISTS shop (
	  id int(11) NOT NULL AUTO_INCREMENT,
	  name text,
	  data text,
	  PRIMARY KEY (id)
	) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
	  if(err) throw err;

	  console.log('TABLE CREATED!');

	query(`CREATE TABLE IF NOT EXISTS items (
	  id int(11) NOT NULL AUTO_INCREMENT,
	  name text,
	  data text,
	  PRIMARY KEY (id)
	) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
	  if(err) throw err;

	  console.log('TABLE CREATED!');

	query(`CREATE TABLE IF NOT EXISTS job (
	  id int(11) NOT NULL AUTO_INCREMENT,
	  name text,
	  data text,
	  PRIMARY KEY (id)
	) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
	  if(err) throw err;

	  console.log('TABLE CREATED!');

	query(`CREATE TABLE IF NOT EXISTS company (
	  id int(11) NOT NULL AUTO_INCREMENT,
	  name text,
	  data text,
	  PRIMARY KEY (id)
	) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
	  if(err) throw err;

	  console.log('TABLE CREATED!');

	query(`CREATE TABLE IF NOT EXISTS dataapp (
	  id int(11) NOT NULL AUTO_INCREMENT,
	  name text,
	  data text,
	  PRIMARY KEY (id)
	) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
	  if(err) throw err;

	  console.log('TABLE CREATED!');

	query(`CREATE TABLE IF NOT EXISTS characterdata (
	  id int(11) NOT NULL AUTO_INCREMENT,
	  name text,
	  data text,
	  PRIMARY KEY (id)
	) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
	  if(err) throw err;

	  console.log('TABLE CREATED!');
	});
	});});});});});});});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'This Command destroy all data.', false)
	msg.channel.send(_embed);
});


// USER
// ADMIN
new Command('user-reset-all', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	query('DELETE FROM users',function(err,rows1){
		msg.reply('User System is reset!');
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Reset Users Système.', false)
	msg.channel.send(_embed);
});


// CHARACTER
// ADMIN
new Command('character-create', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Character Name
	//    - user id
	var id = args[1].match(/<@!?(\d+)>/);
	if (id==null) {
		msg.reply('Sorry, User '+args[1]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id = id[1];
	query('SELECT * FROM characterdata WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length > 0) {
			msg.reply('Sorry, `'+args[0]+'` Character is already created :cold_sweat:');
			return;
		}
		var data = {
			owner: id
		};
		query('INSERT INTO characterdata(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
			msg.reply('`'+args[0]+'` Character created with success!');
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [Character Name] [User]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Create a Character for the targeted user. Example:\n  '+PREFIX+name+' "Bob Le Bricoleur" @Flammrock#5464', false)
	msg.channel.send(_embed);
});
// CITIZEN+OWNER
new Command('character-delete', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Character Name
	var id = msg.member.user.id+'';
	query('SELECT * FROM characterdata WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry,`'+args[0]+'` Character doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Character :cold_sweat:');
			return;
		}
		query('DELETE FROM characterdata WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Character deleted with success!');
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [Character Name]\n```')
		.addField('Permission', 'ADMIN / CITIZEN-OWNER', true)
		.addField('Description', 'Delete a Character by name. Example:\n  '+PREFIX+name+' "Bob Le Bricoleur"', false)
	msg.channel.send(_embed);
});
// CITIZEN+OWNER
new Command('character-select', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Character Name
	var id = msg.member.user.id+'';
	Command.List['character-unselect']._fn(appdata,commandname,msg,[],function(){
		query('SELECT * FROM characterdata WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.reply('Sorry,`'+args[0]+'` Character doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
				msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Character :cold_sweat:');
				return;
			}
			msg.delete();
			try {
				msg.member.setNickname(args[0]);
			} catch (e) {
				msg.author.send('Your role is higher than mine so i can\'t change your nickname you have to do it yourself. (If you are the owner of the server, I cannot change your nickname at all)');
			}
			data.selected = 'selected_'+id;
			query('UPDATE characterdata SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.author.send('`'+args[0]+'` Character selected with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [Character Name]\n```')
		.addField('Permission', 'CITIZEN-OWNER', true)
		.addField('Description', 'Select a Character by name. Only the Owner of the Character can select it! Example:\n  '+PREFIX+name+' "Bob Le Bricoleur"', false)
	msg.channel.send(_embed);
});
// CITIZEN+OWNER
new Command('character-unselect', function(appdata,commandname,msg,args,c) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	var id = msg.member.user.id+'';
	query('SELECT * FROM characterdata WHERE data LIKE \'%selected_'+escape_mysql(id)+'%\' AND name LIKE \''+escape_mysql('name_'+msg.guild.id+'_')+'%\'',function(err,rows){
		if (rows.length==0) {
			if (!c) msg.author.send('Character is already unselected!');
			if (c) c();
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Character :cold_sweat:');
			return;
		}
		if (!c) msg.member.setNickname('');
		data.selected = null;
		delete data.selected;
		query('UPDATE characterdata SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql(rows[0].name)+'\'',function(err,rows){
			if (!c) msg.author.send('Character unselected with success!');
			if (c) c();
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'CITIZEN-OWNER', true)
		.addField('Description', 'Unselect the Character selected if the User have a selected Character. Only the Owner of the Character can unselect it! Example:\n  '+PREFIX+name+'', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('character-list', function(appdata,commandname,msg,args) {
	
	var page = 1;
	var d = false;
	var id = msg.member.user.id+'';
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length >= 1) {
		if (args[0].trim().substring(0,1)=='<') {
			id = args[0].match(/<@!?(\d+)>/);
			if (id==null) {
				msg.reply('Sorry, User '+args[0]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
				return;
			}
			id = id[1];
			page = (args.length >= 2) ? (parseInt(args[1]) || 1) : 1;
			d = true;
		} else {
			page = (args.length >= 1) ? (parseInt(args[0]) || 1) : 1;
		}
	}
	// ARGS :
	//    - Optional: User id
	//    - Optional: page number
	
	if (!msg.guild.members.cache.find(r => r.id == id)) {
		msg.reply('Sorry, User '+args[0]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	
	var duser = msg.guild.members.cache.find(r => r.id == id).user;
	var dname = duser.username + '#' + duser.discriminator;
	
	var Max_Item = 10;
	if (page < 1) {
		page = 1;
	}
	
	
	query('SELECT * FROM characterdata',function(err,rows){
		if (rows.length==0) {
			var _embed = new Discord.MessageEmbed()
			  .setTitle('List Of Characters')
			  .setColor(0xff0000)
			  .setDescription('No Character :stuck_out_tongue_closed_eyes:');
			msg.channel.send(_embed);
		} else {
			var _text = '';
			var index = 0;
			for (var i=0+(page-1)*Max_Item; i < rows.length && i < page*Max_Item; i++) {
				var name = rows[i].name.substring(rows[i].name.indexOf('_')+1).substring(rows[i].name.substring(rows[i].name.indexOf('_')+1).indexOf('_')+1);
				var data = JSON.parse(rows[i].data);
				var user = msg.guild.members.cache.find(r => r.id == data.owner).user;
				var nameu = user.username + '#' + user.discriminator;
				if (d) {
					if (data.owner!=id) continue;
				}
				index++;
				_text += '**'+name+'**'+(d?'\n\n':(': '+nameu+'\n\n'));
			}
			if (_text=='') {
				var _embed = new Discord.MessageEmbed()
					.setTitle(d?('List Of Characters of '+dname):'List Of Characters')
					.setColor(0xff0000)
					.setDescription(page==1?'No Character :stuck_out_tongue_closed_eyes:':('Page '+page+' doesn\'t exist :stuck_out_tongue_closed_eyes:'));
				msg.channel.send(_embed);
				return;
			}
			_text += '*Page '+page+' of '+(Math.ceil(index/Max_Item))+'*';
			var _embed = new Discord.MessageEmbed()
				.setTitle(d?('List Of Characters of '+dname):'List Of Characters')
				.setColor(0xff0000)
				.setDescription(_text);
			msg.channel.send(_embed);
		}
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' {User} {Page}\n```\n        OR\n```css\n'+PREFIX+name+' {Page}\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Get the list of all Character if no User is specified. Else, it will display the list Characters of specified User. Example:\n  '+PREFIX+name+' 2\n  '+PREFIX+name+' @Flammrock#5464\n  '+PREFIX+name+' @Flammrock#5464 3', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('character-who-i-am', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		msg.reply('you are: '+usernamecharname);
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Get the current name of the Character selected. Example:\n  +'+name, false)
	msg.channel.send(_embed);
});


// COMPANY
// CITIZEN
new Command('company-create', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Company Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length > 0) {
				Speech['CompanyAlreadyExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = {
				owner: id
			};
			query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				if (rows.length > 0) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Company-Shop is already created :cold_sweat:');
					return;
				}
				Command.List['shop-create']._fn(appdata,commandname,msg,[
					args[0],
					"",
					"",
					"",
					"",
					"internet",
					"false"
				]);
				query('INSERT INTO company(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
					msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Company created with success!');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Create company by name. Example:\n  '+PREFIX+name+' "Flammrock Corporation"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN+OWNER
new Command('company-delete', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Company Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
				msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
				return;
			}
			Command.List['shop-delete']._fn(appdata,commandname,msg,[args[0]]);
			query('DELETE FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Company deleted with success!');
			});
			
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName]\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Description', 'Delete company by name. Example:\n  '+PREFIX+name+' "Flammrock Corporation"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN+OWNER
new Command('company-add-job', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Job Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
				msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
				return;
			}
			query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows){
				if (rows.length==0) {
					Speech['JobNotExist'](appdata,commandname,msg,usernamecharname,args);
					return;
				}
				data.JobsList = data.JobsList || {};
				data.JobsList[escape_mysql(args[1])] = 1;
				query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
					msg.channel.send(usernamecharname+', '+'Job '+args[1]+' added in `'+args[0]+'` Company with Success!');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] [JobName]\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Need', 'The Job must exist. Use `+help job-create` for more details.', true)
		.addField('Description', 'Add Job to the Company. Example:\n  '+PREFIX+name+' "Flammrock Corporation" "Informatic Engineer"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN+OWNER
new Command('company-remove-job', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Job Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
				msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
				return;
			}
			query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows){
				if (rows.length==0) {
					Speech['JobNotExist'](appdata,commandname,msg,usernamecharname,args);
					return;
				}
				data.JobsList = data.JobsList || {};
				data.Workers = data.Workers || {};
				if (typeof data.JobsList[escape_mysql(args[1])] !== 'undefined') {
					data.JobsList[escape_mysql(args[1])] = null;
					delete data.JobsList[escape_mysql(args[1])];
					for (var i in data.Workers) {
						if (data.Workers.hasOwnProperty(i)) {
							if (data.Workers[i]==args[1]) {
								// fire
								data.Workers[i] = null;
								delete data.Workers[i];
							}
						}
					}
					query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
						msg.channel.send(usernamecharname+', '+'Job '+args[1]+' removed from `'+args[0]+'` Company with Success!');
					});
				} else {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Job not used by `'+args[0]+'` Company :cold_sweat:');
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] [JobName]\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Need', 'The Job must exist. Use `+help job-create` for more details.', true)
		.addField('Description', 'Remove Job to the Company.\n__**WARN: **This Command will fire all User in the Company who have the specified Job.__\nExample:\n  '+PREFIX+name+' "Flammrock Corporation" "Informatic Engineer"', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('company-send-request-job', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Job Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE data LIKE \'%worker_'+escape_mysql(id)+'%\' AND name LIKE \''+escape_mysql('name_'+msg.guild.id+'_')+'%\'',function(err,rows){
			if (rows.length>0) {
				msg.channel.send(usernamecharname+', '+'Sorry, you already have a job :cold_sweat:');
				return;
			}
			query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				if (rows.length==0) {
					Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
					return;
				}
				var data = JSON.parse(rows[0].data);
				query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows){
					if (rows.length==0) {
						msg.channel.send(usernamecharname+', '+'Sorry, `'+args[1]+'` Job doesn\'t exist :cold_sweat:');
						return;
					}
					data.JobRequests = data.JobRequests || {};
					data.JobRequests['request_'+id] = args[1];
					query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
						msg.channel.send(usernamecharname+', '+'You have send a `'+args[1]+'` Job Request in `'+args[0]+'` Company with Success!');
					});
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] [JobName]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Need', 'The Job must exist. Use `+help job-create` for more details.', true)
		.addField('Description', 'Send a request Job for the specified Company. Example:\n  '+PREFIX+name+' "Flammrock Corporation" "Informatic Engineer"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN+OWNER
new Command('company-accept-request-job', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - user ID
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		Command.getCharacter(msg,args[1],function(id2){
			query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				if (rows.length==0) {
					Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
					return;
				}
				var data = JSON.parse(rows[0].data);
				data.JobRequests = data.JobRequests || {};
				data.Workers = data.Workers || {};
				if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
					msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
					return;
				}
				if (typeof data.JobRequests['request_'+id2] !== 'undefined') {
					data.Workers['worker_'+id2] = data.JobRequests['request_'+id2];
					data.JobRequests['request_'+id2] = null;
					delete data.JobRequests['request_'+id2];
					var ff = function () {
						query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
							msg.channel.send(usernamecharname+', '+'You have accepted the request of '+args[1]+' successfully in `'+args[0]+'` Company!');
						});
					};
					query('SELECT * FROM company WHERE data LIKE \'%request_'+id2+'%\' AND name LIKE \''+escape_mysql('name_'+msg.guild.id+'_')+'%\'',function(err,rows){
						var _text = "";
						var _textn = "";
						for (var i = 0; i < rows.length; i++) {
							var datatmp = JSON.parse(rows[i].data);
							datatmp.JobRequests['request_'+id2] = null;
							delete datatmp.JobRequests['request_'+id2];
							_text += "WHEN '"+escape_mysql(rows[i].name)+"' THEN '"+escape_mysql(JSON.stringify(datatmp))+"'";
							_textn += "'"+escape_mysql(rows[i].name)+"',";
						}
						if (_text!="") {
							_text += " END WHERE name IN ("+_textn.slice(0,-1)+")";
							query('UPDATE company SET data = CASE name '+_text,function(err,rows){
								ff();
							});
						} else {
							ff();
						}
					});
				} else {
					msg.channel.send(usernamecharname+', '+'Sorry, '+args[1]+' didn\'t send request to the `'+args[0]+'` Company :cold_sweat:');
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] [User]\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Description', 'Accept the request Job of a User/Character for the specified Company. Example:\n  '+PREFIX+name+' "Flammrock Corporation" @Flammrock#5464\n  '+PREFIX+name+' "Flammrock Corporation" "Bob le Bricoleur"', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('company-give-money', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 4) return;
	// ARGS :
	//    - Company Name
	//    - Bank Company
	//    - Bank User
	//    - Amount
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.bank = data.bank || {};
			if (typeof data.bank[args[1]] === 'undefined') {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Company doesn\'t have an `'+args[1]+'` Bank account :cold_sweat:');
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length==0) {
					Speech['NotEnoughtMoney'](appdata,commandname,msg,usernamecharname);
					return;
				}
				var userdata = JSON.parse(rows[0].data);
				userdata.bank = data.bank || {};
				if (typeof userdata.bank[args[2]] === 'undefined') {
					Speech['NotHaveBankAccount'](appdata,commandname,msg,usernamecharname,args);
					return;
				}
				if ((parseFloat(userdata.bank[args[2]])||0.0) < Math.abs(parseFloat(args[3])||0.0)) {
					Speech['NotEnoughtMoney'](appdata,commandname,msg,usernamecharname);
					return;
				}
				userdata.bank[args[2]] = (parseFloat(userdata.bank[args[2]])||0.0) - Math.abs(parseFloat(args[3])||0.0);
				data.bank[args[1]] = (parseFloat(data.bank[args[1]])||0.0) + Math.abs(parseFloat(args[3])||0.0);
				query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
					query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(userdata))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
						msg.channel.send(usernamecharname+', '+'You give `'+args[3]+'` '+appdata['money-name']+' to `'+args[0]+'` Company!\n{ <@'+id+'>\'s `'+args[2]+'` Bank account ----> `'+args[0]+'`\'s `'+args[1]+'` Bank account }');
					});
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] [BankCompany] [BankUser] [AmountMoney]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Need', 'The Bank must exist. Use `+help bank-create` for more details.', true)
		.addField('Description', 'Give some money for the specified Company. Example:\n  '+PREFIX+name+' "Flammrock Corporation" "My Bank Example" "My Bank Example" 500.0\n  '+PREFIX+name+' "Flammrock Corporation" "Bank of the Company" "Bank of the User" 10.75', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('company-get-money', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Bank Company
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.bank = data.bank || {};
			if (typeof data.bank[args[1]] === 'undefined') {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Company doesn\'t have an `'+args[1]+'` Bank account :cold_sweat:');
				return;
			} else {
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Company have `'+data.bank[args[1]]+'` '+appdata['money-name']+' in `'+args[1]+'` Bank account');
			}
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] [BankCompany]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Need', 'The Bank must exist. Use `+help bank-create` for more details.', true)
		.addField('Description', 'Get money of specified Bank for the specified Company. Example:\n  '+PREFIX+name+' "Flammrock Corporation" "My Bank Example"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN+OWNER
new Command('company-fire', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - user
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		Command.getCharacter(msg,args[1],function(id2){
			query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				if (rows.length==0) {
					Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
					return;
				}
				var data = JSON.parse(rows[0].data);
				data.Workers = data.Workers || {};
				if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
					msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
					return;
				}
				if (typeof data.Workers['worker_'+id2] === 'undefined') {
					msg.channel.send(usernamecharname+', '+'Sorry, '+args[1]+' doesn\'t work in `'+args[0]+'` Company :cold_sweat:');
					return;
				} else {
					data.Workers['worker_'+id2] = null;
					delete data.Workers['worker_'+id2];
					query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
						msg.channel.send(usernamecharname+', '+'you successfully fired '+args[1]+' in the `'+args[0]+'` Company!');
					});
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] [User]\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Description', 'Fire User of the Company. Example:\n  '+PREFIX+name+' "Flammrock Corporation" @Flammrock#5464\n  '+PREFIX+name+' "Flammrock Corporation" "Bob le Bricoleur"', false)
	msg.channel.send(_embed);
}); 
// ADMIN/CITIZEN+OWNER
new Command('company-update-shop', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Key
	//    - Value
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
				msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
				return;
			}
			if (typeof Command.List['shop-update-'+args[1]] === 'undefined') {
				msg.channel.send(usernamecharname+', '+'Sorry, This Settings doesn\'t exist :cold_sweat:');
				return;
			}
			Command.List['shop-update-'+args[1]].fn(appdata,commandname,msg,[args[0],args[2]],true);
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] [salons | need | web] [new-value]\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Information', 'You should type `+help shop-create` to see more details.', true)
		.addField('Description', 'Update the Value of the Shop associed with the company. Example:\n  '+PREFIX+name+' "Flammrock Corporation" salons #general\n  '+PREFIX+name+' "Flammrock Corporation" web true\n  '+PREFIX+name+' "Flammrock Corporation" salons "#general #autre-salon"\n  '+PREFIX+name+' "Flammrock Corporation" need "item1 item2"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN+OWNER
new Command('company-add-shop-website', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Company Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
				msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
				return;
			}
			Command.List['shop-update-web']._fn(appdata,commandname,msg,[args[0],"true"],true);
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName]\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Information', 'You should type `+help shop-create` to see more details.', true)
		.addField('Description', 'Enable Website of the Shop associed with the company. Example:\n  '+PREFIX+name+' "Flammrock Corporation"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN+OWNER
new Command('company-remove-shop-website', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Company Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
				msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
				return;
			}
			Command.List['shop-update-web']._fn(appdata,commandname,msg,[args[0],"false"],true);
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName]\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Information', 'You should type `+help shop-create` to see more details.', true)
		.addField('Description', 'Disable Website of the Shop associed with the company. Example:\n  '+PREFIX+name+' "Flammrock Corporation"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN+OWNER
new Command('company-create-item', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - item args
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
				msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
				return;
			}
			var shopname = args[0];
			var newargs = [];
			for (var i = 1; i < args.length; i++) {
				newargs.push(args[i]);
			}
			if (newargs.length==1) {
				newargs.push("0.0");
				newargs.push(shopname);
			} else if (newargs.length==2) {
				newargs.push(shopname);
			} else if (newargs.length>2) {
				newargs[2] = shopname;
			}
			Command.List['item-create']._fn(appdata,commandname,msg,newargs,true);
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] {{{Item Argument}}}\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Information', 'You should type `+help item-create` to see more details.', true)
		.addField('Description', 'Create an item and add it in the Shop associed with the company. Example:\n  '+PREFIX+name+' "Flammrock Corporation" "My Item" 4.99 "" "type of item" "http://link-to-image.jpg" "My Description"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN+OWNER
new Command('company-delete-item', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - item args
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			if (data.owner!=id && !Command.checkPermission(msg,'ADMIN',true)) {
				msg.channel.send(usernamecharname+', '+'Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
				return;
			}
			query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows1){
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
					return;
				}
				var itemdata = JSON.parse(rows[0].data);
				var ok = false;
				for (var i = 0; i < itemdata.shops.length; i++) {
					if (itemdata.shops[i]==args[0]) {
						ok = true;
						break;
					}
				}
				if (!ok) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item isn\'t created by the `'+args[0]+'` Company :cold_sweat:');
					return;
				}
				Command.List['item-delete']._fn(appdata,commandname,msg,[args[1]],true);
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName] [ItemName]\n```')
		.addField('Permission', 'ADMIN / CITIZEN+OWNER', true)
		.addField('Need', 'The Item must exist. Use `+help item-create` for more details.', true)
		.addField('Description', 'Delete the specified item and remove it from the Shop associed with the company. Example:\n  '+PREFIX+name+' "Flammrock Corporation" "My Item"', false)
	msg.channel.send(_embed);
});

// CITIZEN
new Command('company-view', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Company Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['CompanyNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.JobsList = data.JobsList || {};
			data.JobRequests = data.JobRequests || {};
			data.Workers = data.Workers || {};
			console.log(data);
			var canEdit = data.owner==id || Command.checkPermission(msg,'ADMIN',true);
			var t = data.owner.split(':');
			var ownername = '';
			if (t.length>1) {
				ownername = t[1];
			} else {
				var t2 = msg.guild.members.cache.find(r => r.id == t[0]);
				if (t) {
					var user = t2.user;
					ownername = user.username + '#' + user.discriminator;
				} else {
					ownername = '<@'+t[0]+'>';
				}
			}
			var jobslist = (Object.keys(data.JobsList).length==0)?'No Jobs':Object.keys(data.JobsList).join(', ');
			var jobsrequestkey = "";
			for (var i in data.JobRequests) {
				if (data.JobRequests.hasOwnProperty(i)) {
					var ownernametmp = '';
					var t = i.split('_')[1].split(':');
					if (t.length>1) {
						ownernametmp = t[1];
					} else {
						var t2 = msg.guild.members.cache.find(r => r.id == t[0]);
						if (t) {
							var user = t2.user;
							ownernametmp = user.username + '#' + user.discriminator;
						} else {
							ownernametmp = '<@'+t[0]+'>';
						}
					}
					jobsrequestkey += ownernametmp+' *('+data.JobRequests[i]+')*, ';
				}
			}
			if (jobsrequestkey!="") {
				jobsrequestkey = jobsrequestkey.slice(0,-2);
			} else {
				jobsrequestkey =  "No Jobs Requests";
			}
			var jobsworkerkey = "";
			for (var i in data.Workers) {
				if (data.Workers.hasOwnProperty(i)) {
					var ownernametmp = '';
					var t = i.split('_')[1].split(':');
					if (t.length>1) {
						ownernametmp = t[1];
					} else {
						var t2 = msg.guild.members.cache.find(r => r.id == t[0]);
						if (t) {
							var user = t2.user;
							ownernametmp = user.username + '#' + user.discriminator;
						} else {
							ownernametmp = '<@'+t[0]+'>';
						}
					}
					jobsworkerkey += ownernametmp+' *('+data.Workers[i]+')*, ';
				}
			}
			if (jobsworkerkey!="") {
				jobsworkerkey = jobsworkerkey.slice(0,-2);
			} else {
				jobsworkerkey =  "No Workers";
			}
			var _embed = new Discord.MessageEmbed()
				.setTitle('Campany '+args[0])
				.setColor(0xff0000)
				.setDescription('**ASSOCIED SHOP**: '+args[0]+'\n**OWNER**: '+ownername+'\n**CAN EDIT**: '+(canEdit?'True *(You can edit)*':'False *(You can\'t edit)*')+'\n**JOBS AVAILABLES**: '+jobslist+'\n**JOB REQUESTS**: '+jobsrequestkey+'\n**WORKERS**: '+jobsworkerkey);
			msg.channel.send(_embed);
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [CompanyName]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'View data of the specified company. Example:\n  '+PREFIX+name+' "Flammrock Corporation"', false)
	msg.channel.send(_embed);
});


// JOB
// ADMIN
new Command('job-create', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Job Name
	//    - Salary
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length > 0) {
				Speech['JobAlreadyExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = {
				salary: parseFloat(args[1]) || 325000.0
			};
			query('INSERT INTO job(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Job created with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [JobName] [Salary]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Create a Job with the monthly salary. Example:\n  '+PREFIX+name+' "Informatic Engineer" 3000.0', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('job-delete', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Job Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, Job `'+args[0]+'` doesn\'t exist :cold_sweat:');
				return;
			}
			query('DELETE FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Job deleted with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [JobName]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Delete a Job with the monthly salary. Example:\n  '+PREFIX+name+' "Informatic Engineer"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('job-update-salary', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Job Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, Job `'+args[0]+'` doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.salary = parseFloat(args[1]) || 325000.0;
			query('UPDATE job SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Job updated with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [JobName] [Salary]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Update salary of the specified Job with the new monthly salary. Example:\n  '+PREFIX+name+' "Informatic Engineer" 3200.0', false)
	msg.channel.send(_embed);
});

// CITIZEN
new Command('job-work', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM company WHERE data LIKE \'%worker_'+escape_mysql(id)+'%\' AND name LIKE \''+escape_mysql('name_'+msg.guild.id+'_')+'%\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have Job :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.Workers = data.Workers || {};
			if (typeof data.Workers['worker_'+id] === 'undefined') {
				msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have Job :cold_sweat:');
				return;
			}
			var jobname = data.Workers['worker_'+id].substring(data.Workers['worker_'+id].indexOf('_')+1);
			query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(jobname)+'\'',function(err,rows){
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, Job `'+jobname+'` doesn\'t exist :cold_sweat:');
					return;
				}
				var jobdata = JSON.parse(rows[0].data);
				var salary = parseFloat(jobdata.salary) || 325000.0;
				query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
					if (rows.length==0) {
						var userdata = {money:salary,timework:Date.now()};
						query('INSERT INTO users(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\',\''+escape_mysql(JSON.stringify(userdata))+'\')',function(err,rows){
							msg.channel.send(usernamecharname+', '+'you work with success!\nYou earn: `'+salary+'` '+appdata['money-name']+'!');
						});
					} else {
						var userdata = JSON.parse(rows[0].data);
						userdata.bank = userdata.bank || {};
						
						if (typeof userdata.timework !== 'undefined') {
							var d1 = new Date().getDay();
							var d2 = new Date();
							d2.setTime((parseInt(userdata.timework)||(Date.now()-1000*60*60*24)));
							d2 = d2.getDay();
							if (d1==d2) {
								msg.channel.send(usernamecharname+', '+'Sorry, you can only work once a day :cold_sweat:');
								return;
							}
						}
						
						userdata.timework = Date.now();
						if (args.length >= 1) {
							if (typeof userdata.bank[escape_mysql(args[1])] === 'undefined') {
								userdata.money = (parseFloat(userdata.money) || 0.0) + salary;
							} else {
								userdata.bank[escape_mysql(args[1])] = (parseFloat(userdata.bank[escape_mysql(args[1])]) || 0.0) + salary;
							}
						} else {
							userdata.money = (parseFloat(userdata.money) || 0.0) + salary;
						}
						query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(userdata))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
							msg.channel.send(usernamecharname+', '+'you work with success!\nYou earn: `'+salary+'` '+appdata['money-name']+'!');
						});
					}
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'This Command will succed if you have a Job. You can work only once a day. Example:\n  '+PREFIX+name+'', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('job-leave', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		var ff = function () {
			msg.channel.send(usernamecharname+', '+'you left your job with success!');
		};
		query('SELECT * FROM company WHERE data LIKE \'%worker_'+escape_mysql(id)+'%\' AND name LIKE \''+escape_mysql('name_'+msg.guild.id+'_')+'%\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have Job :cold_sweat:');
				return;
			}
			query('SELECT * FROM company WHERE data LIKE \'%worker_'+id+'%\' AND name LIKE \''+escape_mysql('name_'+msg.guild.id+'_')+'%\'',function(err,rows){
				var _text = "";
				var _textn = "";
				for (var i = 0; i < rows.length; i++) {
					var datatmp = JSON.parse(rows[i].data);
					datatmp.Workers['worker_'+id] = null;
					delete datatmp.Workers['worker_'+id];
					_text += "WHEN '"+escape_mysql(rows[i].name)+"' THEN '"+escape_mysql(JSON.stringify(datatmp))+"'";
					_textn += "'"+escape_mysql(rows[i].name)+"',";
				}
				if (_text!="") {
					_text += " END WHERE name IN ("+_textn.slice(0,-1)+")";
					query('UPDATE company SET data = CASE name '+_text,function(err,rows){
						ff();
					});
				} else {
					ff();
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'This Command will succed if you have a Job. You left your Job. Example:\n  '+PREFIX+name+'', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('job-view', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Job Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length > 0) {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Job doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			var _embed = new Discord.MessageEmbed()
				.setTitle('Job '+args[0])
				.setColor(0xff0000)
				.setDescription('**SALARY (month)**: '+data.salary+'\n**SALARY (day)**: '+(parseFloat(data.salary)||325000.0)/30);
			msg.channel.send(_embed);
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [JobName]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'View data of the specified Job. Example:\n  '+PREFIX+name+' "Informatic Engineer"', false)
	msg.channel.send(_embed);
});

// BANK

// ADMIN
new Command('bank-create', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Bank Name
	//    - Optional: Amount Money On First Registration
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length > 0) {
				Speech['BankAlreadyExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = {
				moneyOnStart: args.length >= 2 ? (parseFloat(args[1]) || 0.0) : 0.0
			};
			query('INSERT INTO bank(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Bank created with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] {onCreateAmountMoney}\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Create a Bank with the starter money amount. Example:\n  '+PREFIX+name+' "Flammrock Bank" 100.0', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('bank-delete', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Bank Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, Bank `'+args[0]+'` doesn\'t exist :cold_sweat:');
				return;
			}
			query('DELETE FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Bank deleted with success!');
			});
			query('SELECT * FROM users WHERE name LIKE \''+escape_mysql('name_'+msg.guild.id+'_')+'%\'',function(err,rows){
				for (var i = 0; i < rows.length; i++) {
					try {
						var data = JSON.parse(rows[i].data);
						if (typeof data.bank !== 'undefined') {
							if (typeof data.bank[escape_mysql(args[0])] !== 'undefined') {
								data.bank[escape_mysql(args[0])] = null;
								delete data.bank[escape_mysql(args[0])];
								query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(rows[i].name)+'\'',function(err,rows){});
							}
						}
					} catch (e) {}
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Delete a Bank by name. Example:\n  '+PREFIX+name+' "Flammrock Bank"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('bank-add-user', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	Command.getCharacter(msg,args[1],function(id,usernamecharname){
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
			if (rows1.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, Bank `'+args[0]+'` doesn\'t exist :cold_sweat:');
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length==0) {
					var obj = {
						bank: {}
					};
					try {
						obj.bank[escape_mysql(args[0])] = parseFloat(JSON.parse(rows1[0].data).moneyOnStart) || 0.0;
					} catch (e) {
						obj.bank[escape_mysql(args[0])] = 0.0;
					}
					query('INSERT INTO users(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\',\''+escape_mysql(JSON.stringify(obj))+'\')',function(err,rows){
						msg.channel.send(usernamecharname+', '+'User '+args[1]+' added in `'+args[0]+'` Bank with Success!');
					});
				} else {
					var obj = JSON.parse(rows[0].data);
					obj.bank = obj.bank || {};
					try {
						if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined') {
							 obj.bank[escape_mysql(args[0])] = (parseFloat(obj.bank[escape_mysql(args[0])]) || 0.0) + (parseFloat(JSON.parse(rows1[0].data).moneyOnStart) || 0.0);
						} else {
							obj.bank[escape_mysql(args[0])] = parseFloat(JSON.parse(rows1[0].data).moneyOnStart) || 0.0;
						}
					} catch (e) {
						obj.bank[escape_mysql(args[0])] = 0.0;
					}
					query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(obj))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
						msg.channel.send(usernamecharname+', '+'User '+args[1]+' added in `'+args[0]+'` Bank with Success!');
					});
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] [User]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Add a User/Character to a Bank by name. Example:\n  '+PREFIX+name+' "Flammrock Bank" @Flammrock#5464\n  '+PREFIX+name+' "Flammrock Bank" "Bob le Bricoleur"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('bank-remove-user', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	Command.getCharacter(msg,args[1],function(id,usernamecharname){
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
			if (rows1.length==0) {
				Speech['BankNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length > 0) {
					var obj = JSON.parse(rows[0].data);
					obj.bank = obj.bank || {};
					try {
						if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined') {
							obj.bank[escape_mysql(args[0])] = null;
							delete obj.bank[escape_mysql(args[0])];
						}
					} catch (e) {}
					query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(obj))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
						msg.channel.send(usernamecharname+', '+'User '+args[1]+' removed in `'+args[0]+'` Bank with Success!');
					});
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] [User]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Remove a User/Character to a Bank by name. Example:\n  '+PREFIX+name+' "Flammrock Bank" @Flammrock#5464\n  '+PREFIX+name+' "Flammrock Bank" "Bob le Bricoleur"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('bank-give-money-user', function(appdata,commandname,msg,args,t) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 3) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
	Command.getCharacter(msg,args[1],function(id,usernamecharname){
		var f = function() {
			msg.channel.send(usernamecharname+', '+'`'+((typeof t !== 'undefined')?(parseFloat(args[2])||0.0):Math.abs((parseFloat(args[2])||0.0)))+'` '+appdata['money-name']+' '+((typeof t !== 'undefined')?'set':(parseFloat(args[2]) || 0.0)<0?'removed':'added')+' to the '+args[1]+'\'s account in the `'+args[0]+'` Bank with Success!');	
		}
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
			if (rows1.length==0) {
				Speech['BankNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length > 0) {
					var obj = JSON.parse(rows[0].data);
					obj.bank = obj.bank || {};
					try {
						if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined' && typeof t === 'undefined') {
							obj.bank[escape_mysql(args[0])] = (parseFloat(obj.bank[escape_mysql(args[0])]) || 0.0) + (parseFloat(args[2]) || 0.0);
						} else {
							obj.bank[escape_mysql(args[0])] = parseFloat(args[2]) || 0.0;
						}
					} catch (e) {
						obj.bank[escape_mysql(args[0])] = parseFloat(args[2]) || 0.0;
					}
					query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(obj))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
						f();
					});
				} else {
					var obj = {bank:{}};
					obj.bank[escape_mysql(args[0])] = (parseFloat(args[2]) || 0.0);
					query('INSERT INTO users(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\',\''+escape_mysql(JSON.stringify(obj))+'\')',function(err,rows){
						f();
					});
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] [User] [AmountMoney]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Add money to the specified User/Character to the specified Bank by name. Example:\n  '+PREFIX+name+' "Flammrock Bank" @Flammrock#5464 1000.0\n  '+PREFIX+name+' "Flammrock Bank" "Bob le Bricoleur" 9.99', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('bank-remove_money_user', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 3) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
	args[2] = (parseFloat(args[2]) || 0.0)*-1;
	Command.List['bank-give-money-user']._fn(appdata,commandname,msg,args);
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] [User] [AmountMoney]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Remove money to the specified User/Character to the specified Bank by name. Example:\n  '+PREFIX+name+' "Flammrock Bank" @Flammrock#5464 10.5\n  '+PREFIX+name+' "Flammrock Bank" "Bob le Bricoleur" 2.0', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('bank-set-money-user', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 3) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
	Command.List['bank-give-money-user']._fn(appdata,commandname,msg,args,true);
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] [User] [AmountMoney]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Set money to the specified User/Character to the specified Bank by name. Example:\n  '+PREFIX+name+' "Flammrock Bank" @Flammrock#5464 5000.0\n  '+PREFIX+name+' "Flammrock Bank" "Bob le Bricoleur" 500.0', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('bank-get-money-user', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	Command.getCharacter(msg,args[1],function(id,usernamecharname){
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
			if (rows1.length==0) {
				Speech['BankNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length > 0) {
					var obj = JSON.parse(rows[0].data);
					obj.bank = obj.bank || {};
					try {
						if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined') {
							msg.channel.send(usernamecharname+', '+'User '+args[1]+' have `'+obj.bank[escape_mysql(args[0])]+'` '+appdata['money-name']+' Left in his `'+args[0]+'` Bank account!');
							return;
						} else {}
					} catch (e) {}
				}
				msg.channel.send(usernamecharname+', '+'User '+args[1]+' don\'t have a `'+args[0]+'` Bank account!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] [User]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Get money to the specified User/Character to the specified Bank by name. Example:\n  '+PREFIX+name+' "Flammrock Bank" @Flammrock#5464\n  '+PREFIX+name+' "Flammrock Bank" "Bob le Bricoleur"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('bank-reset-all', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	Command.getCharacter(msg,args[1],function(id,usernamecharname){
		query('DELETE FROM bank',function(err,rows1){
			msg.channel.send(usernamecharname+', '+'Bank System is reset!');
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Reset Bank System. Example:\n  '+PREFIX+name+'', false)
	msg.channel.send(_embed);
});

// CITIZEN
new Command('give-money', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 4) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - User Bank Name
	//     - Amount Money
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id_currentuser,usernamecharname){
		Command.getCharacter(msg,args[1],function(id_user){
			if (id_currentuser == id_user) {
				msg.channel.send(usernamecharname+', '+'Sorry, you can\'t give yourself your own '+appdata['money-name']+' :upside_down:');
				return;
			}
			query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
				if (rows1.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Bank  doesn\'t exist :cold_sweat:');
					return;
				}
				query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id_currentuser)+'\'',function(err,rowsu){
					if (rowsu.length > 0) {
						var obju = JSON.parse(rowsu[0].data);
						obju.bank = obju.bank || {};
						if (typeof obju.bank[escape_mysql(args[0])] !== 'undefined') {
							if ((parseFloat(obju.bank[escape_mysql(args[0])])||0) < Math.abs((parseFloat(args[3])||0))) {
								msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have enought '+appdata['money-name']+' in your `'+args[0]+'` Bank account!');
								return;
							}
							query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id_user)+'\'',function(err,rows){
								if (rows.length > 0) {
									var obj = JSON.parse(rows[0].data);
									obj.bank = obj.bank || {};
									if (typeof obj.bank[escape_mysql(args[2])] !== 'undefined') {
										obju.bank[escape_mysql(args[0])] = (parseFloat(obju.bank[escape_mysql(args[0])])||0) - Math.abs((parseFloat(args[3])||0));
										obj.bank[escape_mysql(args[2])] = (parseFloat(obj.bank[escape_mysql(args[2])])||0) + Math.abs((parseFloat(args[3])||0));
										query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(obju))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id_currentuser)+'\'',function(err,rows){
											query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(obj))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id_user)+'\'',function(err,rows){
												msg.channel.send(usernamecharname+', '+'You give `'+args[3]+'` '+appdata['money-name']+' to '+args[1]+'!\n{ <@'+id_currentuser+'>\'s `'+args[0]+'` Bank account ----> '+args[1]+'\'s `'+args[2]+'` Bank account }');
											});
										});
										return;
									}
								}
								msg.channel.send(usernamecharname+', '+'Sorry, '+args[1]+' don\'t have a `'+args[0]+'` Bank account!');
							});
							return;
						}
					}
					msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[0]+'` Bank account!');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] [User] [UserBankName] [AmountMoney]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Give Money to another user with specified Banks name. Example:\n  '+PREFIX+name+' "Flammrock Bank" @Flammrock#5464 "Flammrock Bank" 500.0\n  '+PREFIX+name+' "Flammrock Bank" "Bob le Bricoleur" "Flammrock Bank" 1000.0', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('bank-create-account', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Bank Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		var f = function() {
			msg.channel.send(usernamecharname+', '+'Your `'+args[0]+'` Bank account is created with Success!');
		};
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
			if (rows1.length==0) {
				Speech['BankNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length!=0) {
					var obj = JSON.parse(rows[0].data);
					obj.bank = obj.bank || {};
					if (typeof obj.bank[escape_mysql(args[0])] === 'undefined') {
						try {
							obj.bank[escape_mysql(args[0])] = parseFloat(JSON.parse(rows1[0].data).moneyOnStart) || 0.0;
						} catch (e) {
							obj.bank[escape_mysql(args[0])] = 0.0;
						}
						query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(obj))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
							f();
						});
					} else {
						msg.channel.send(usernamecharname+', '+'Sorry, you have already a `'+args[0]+'` Bank account :cold_sweat:');
					}
				} else {
					var obj = {bank:{}};
					try {
						obj.bank[escape_mysql(args[0])] = parseFloat(JSON.parse(rows1[0].data).moneyOnStart) || 0.0;
					} catch (e) {
						obj.bank[escape_mysql(args[0])] = 0.0;
					}
					query('INSERT INTO users(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\',\''+escape_mysql(JSON.stringify(obj))+'\')',function(err,rows){
						f();
					});
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Create a Bank Account in the specified Bank. Example:\n  '+PREFIX+name+' "Flammrock Bank"', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('bank-delete-account', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Bank Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['BankNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length!=0) {
					var obj = JSON.parse(rows[0].data);
					obj.bank = obj.bank || {};
					if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined') {
						obj.bank[escape_mysql(args[0])] = null;
						delete obj.bank[escape_mysql(args[0])];
						query('UPDATE users SET data = \''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(JSON.stringify(obj))+'\' WHERE name=\''+escape_mysql(id)+'\'',function(err,rows){
							msg.channel.send(usernamecharname+', '+'Your `'+args[0]+'` Bank account is deleted with Success!');
						});
						return;
					}
				}
				msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[0]+'` Bank account :cold_sweat:');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Delete a Bank Account in the specified Bank. Example:\n  '+PREFIX+name+' "Flammrock Bank"', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('get-money', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Optional: Bank Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		var f = function(money) {
			msg.channel.send(usernamecharname+', '+'You have `'+money+'` '+appdata['money-name']+' left in your `'+args[0]+'` Bank account!');
		};
		if (args.length==0) {
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[0]+'` Bank account yet!\nPlease create a bank account with the command:\n        `+bank_create_account '+args[0]+'`');
					return;
				} else {
					var obj = JSON.parse(rows[0].data);
					obj.money = parseFloat(obj.money) || 0.0;
					msg.channel.send(usernamecharname+', '+'You have `'+obj.money+'` '+appdata['money-name']+' cash left!');
				}
			});
			return;
		}
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['BankNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[0]+'` Bank account yet!\nPlease create a bank account with the command:\n        `+bank_create_account '+args[0]+'`');
					return;
				} else {
					var obj = JSON.parse(rows[0].data);
					obj.bank = obj.bank || {};
					var money = 0.0;
					try {
						if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined') {
							money = parseFloat(obj.bank[escape_mysql(args[0])]) || 0.0;
						} else {
							msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[0]+'` Bank account yet!\nPlease create a bank account with the command:\n        `+bank_create_account '+args[0]+'`');
							return;
						}
					} catch (e) {}
					f(money);
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' {BankName}\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'If a Bank is specified, the Amount Money in the Bank account is displayed else the Cash Money Amount is dispayed. Example:\n  '+PREFIX+name+' "Flammrock Bank"\n  '+PREFIX+name+'', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('bank-list', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM bank',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'There are no Banks!');
			} else {
				var rows2 = [];
				for (var i = 0; i < rows.length; i++) {
					rows2.push(rows[i].name.substring(rows[i].name.indexOf('_')+1).substring(rows[i].name.substring(rows[i].name.indexOf('_')+1).indexOf('_')+1));
				}
				var _embed = new Discord.MessageEmbed()
					.setTitle('List Of Banks')
					.setColor(0xff0000)
					.setDescription('• **'+rows2.join('**\n• **')+'**');
				msg.author.send(_embed);
				msg.channel.send(usernamecharname+', '+'I sent you the list of Banks!');
			}
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'List all Banks. Example:\n  '+PREFIX+name+'', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('bank-deposit', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	// ARGS :
	//     - Bank Name
	//     - Amount Money
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
			if (rows1.length==0) {
				Speech['BankNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[0]+'` Bank account :cold_sweat:');
					return;
				}
				var userdata = JSON.parse(rows[0].data);
				userdata.money = parseFloat(userdata.money) || 0.0;
				userdata.bank = userdata.bank || {};
				if (typeof userdata.bank[escape_mysql(args[0])] === 'undefined') {
					msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[0]+'` Bank account :cold_sweat:');
					return;
				}
				userdata.bank[escape_mysql(args[0])] = parseFloat(userdata.bank[escape_mysql(args[0])]) || 0.0;
				if (userdata.money < Math.abs(parseFloat(args[1])||0.0)) {
					Speech['NotEnoughtMoney'](appdata,commandname,msg,usernamecharname,args);
					return;
				}
				userdata.money -= Math.abs(parseFloat(args[1])||0.0);
				userdata.bank[escape_mysql(args[0])] += Math.abs(parseFloat(args[1])||0.0);
				query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(userdata))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
					msg.channel.send(usernamecharname+', '+'you deposited `'+args[1]+'` '+appdata['money-name']+' into your `'+args[0]+'` Bank account');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] [AmountMoney]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Deposit your cash money in your Bank account. Example:\n  '+PREFIX+name+' "Flammrock Bank" 500.0', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('bank-withdraw', function(appdata,commandname,msg,args) {
		if (!Command.checkPermission(msg,'CITIZEN')) return false;
	// ARGS :
	//     - Bank Name
	//     - Amount Money
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
			if (rows1.length==0) {
				Speech['BankNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[0]+'` Bank account :cold_sweat:');
					return;
				}
				var userdata = JSON.parse(rows[0].data);
				userdata.money = parseFloat(userdata.money) || 0.0;
				userdata.bank = userdata.bank || {};
				if (typeof userdata.bank[escape_mysql(args[0])] === 'undefined') {
					msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[0]+'` Bank account :cold_sweat:');
					return;
				}
				userdata.bank[escape_mysql(args[0])] = parseFloat(userdata.bank[escape_mysql(args[0])]) || 0.0;
				if (userdata.bank[escape_mysql(args[0])] < Math.abs(parseFloat(args[1])||0.0)) {
					Speech['NotEnoughtMoney'](appdata,commandname,msg,usernamecharname,args);
					return;
				}
				userdata.money += Math.abs(parseFloat(args[1])||0.0);
				userdata.bank[escape_mysql(args[0])] -= Math.abs(parseFloat(args[1])||0.0);
				query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(userdata))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
					msg.channel.send(usernamecharname+', '+'you have withdrawn `'+args[1]+'` '+appdata['money-name']+' from your `'+args[0]+'` Bank account');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [BankName] [AmountMoney]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Withdraw your money in your Bank account. Example:\n  '+PREFIX+name+' "Flammrock Bank" 500.0', false)
	msg.channel.send(_embed);
});



// Item
// ADMIN
new Command('item-create', function(appdata,commandname,msg,args,t) {
	if (!t) if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Item Name
	//    - Price
	//    - Shops
	//    - Type
	//    - Image
	//    - Description
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
			if (rows1.length>0) {
				Speech['ItemAlreadyExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = {};
			data.price = (args.length >= 2) ? (parseFloat(args[1]) || 0.0) : 0.0;
			data.shops = (args.length >= 3) ? Command.extractData(args[2]) : [];
			data.type = (args.length >= 4) ? Command.extractData(args[3]) : [];
			data.image = (args.length >= 5) ? args[4] : '';
			data.description = (args.length >= 6) ? args[5] : 'No Description';
			query('INSERT INTO items(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Item created with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName] {Price} {Shops} {Type} {Image} {Description}\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Create a Item. Example:\n  '+PREFIX+name+' "A Super Item" 9.99 "[Flammrock Shop]" "" "http://image.jpg" "It\'s a super item!"\n  '+PREFIX+name+' "Apple" 2.0 "[Flammrock Shop] [Shop 2]" "[food]" "http://image.jpg" "You can eat with \'+item-eat Apple\'"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('item-update-price', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Price
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.price = (parseFloat(args[1]) || 0.0);
			query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Item updated with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName] [Price]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Update the price of the specified Item. Example:\n  '+PREFIX+name+' "A Super Item" 15.0', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('item-update-shops', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Shops
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.shops = Command.extractData(args[1]);
			query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Item updated with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName] [Shops]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Update the shops of the specified Item. Example:\n  '+PREFIX+name+' "A Super Item" "[Flammrock Shop] [Shop 2]"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('item-update-type', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Type
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.type = Command.extractData(args[1]);
			query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Item updated with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName] [Type]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Update the Types of the specified Item. Example:\n  '+PREFIX+name+' "A Super Item" "[food] [device]"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('item-update-image', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Image
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.image = args[1];
			query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Item updated with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName] [Image]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Update the Image of the specified Item. Example:\n  '+PREFIX+name+' "A Super Item" "http://image.jpg"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('item-update-desciption', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Description
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.description = args[1];
			query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Item updated with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName] [Description]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Update the Description of the specified Item. Example:\n  '+PREFIX+name+' "A Super Item" "Amazing Item"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('item-delete', function(appdata,commandname,msg,args,t) {
	if (!t) if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Item Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
				return;
			}
			query('DELETE FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Item deleted with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Delete the specified Item. Example:\n  '+PREFIX+name+' "A Super Item"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('item-give', function(appdata,commandname,msg,args,t) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - User id
	//    - Optional: Quantity
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(idu,usernamecharname){
		Command.getCharacter(msg,args[1],function(id){
			var f = function() {
				msg.channel.send(usernamecharname+', '+((args.length >= 2) ? (parseInt(args[2]) || 1) > 1 ? args[2]+' Items ' : 'Item ' : 'Item ')+'`'+args[0]+'` successfully given to '+args[1]+'!');
			};
			query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
					return;
				}
				var dataitem = JSON.parse(rows[0].data);
				var g = (typeof t !== 'undefined') ? (args.length >= 2) ? (parseInt(args[2])*-1 || -1) : -1 : (args.length >= 2) ? (parseInt(args[2]) || 1) : 1;
				query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
					if (rows.length==0) {
						var data = {
							inventory: {
								items: {},
								itemstype: {}
							}
						};
						data.inventory.items[escape_mysql(args[0])] = g;
						for (var i = 0; i < dataitem.type.length; i++) {
							data.inventory.itemstype[dataitem.type[i]] = g;
							if (data.inventory.itemstype[dataitem.type[i]] <= 0) {
								data.inventory.itemstype[dataitem.type[i]] = null;
								delete data.inventory.itemstype[dataitem.type[i]];
							}
						}
						if (data.inventory.items[escape_mysql(args[0])] <= 0) {
							data.inventory.items[escape_mysql(args[0])] = null;
							delete data.inventory.items[escape_mysql(args[0])];
						}
						query('INSERT INTO users(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
							f();
						});
					} else {
						var data = JSON.parse(rows[0].data);
						data.inventory = data.inventory || {};
						data.inventory.items = data.inventory.items || {};
						data.inventory.itemstype = data.inventory.itemstype || {};
						if (typeof data.inventory.items[escape_mysql(args[0])] !== 'undefined') {
							data.inventory.items[escape_mysql(args[0])] = (parseInt(data.inventory.items[escape_mysql(args[0])]) || 0) + g;
						} else {
							data.inventory.items[escape_mysql(args[0])] = g;
						}
						if (data.inventory.items[escape_mysql(args[0])] <= 0) {
							data.inventory.items[escape_mysql(args[0])] = null;
							delete data.inventory.items[escape_mysql(args[0])];
						}
						for (var i = 0; i < dataitem.type.length; i++) {
							if (typeof data.inventory.itemstype[dataitem.type[i]] !== 'undefined') {
								data.inventory.itemstype[dataitem.type[i]] = (parseInt(data.inventory.itemstype[dataitem.type[i]]) || 0) + g;
							} else {
								data.inventory.itemstype[dataitem.type[i]] = g;
							}
							if (data.inventory.itemstype[dataitem.type[i]] <= 0) {
								data.inventory.itemstype[dataitem.type[i]] = null;
								delete data.inventory.itemstype[dataitem.type[i]];
							}
						}
						query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
							f();
						});
					}
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName] [User] {Quantity}\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Give the specified Item to a User/Character. Example:\n  '+PREFIX+name+' "A Super Item" @Flammrock#5464\n  '+PREFIX+name+' "A Super Item" "Bob le Bricoleur" 6', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('item-remove', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - User id
	//    - Optional: Quantity
	Command.List['item-give']._fn(appdata,commandname,msg,args,true);
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName] [User] {Quantity}\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Remove the specified Item to a User/Character. Example:\n  '+PREFIX+name+' "A Super Item" @Flammrock#5464\n  '+PREFIX+name+' "A Super Item" "Bob le Bricoleur" 6', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('item-reset-all', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('DELETE FROM items',function(err,rows1){
			msg.channel.send(usernamecharname+', '+'Item System is reset!');
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Reset Items System. Example:\n  '+PREFIX+name+'', false)
	msg.channel.send(_embed);
});

// ADMIN/CITIZEN
new Command('inventory-item-clear', function(appdata,commandname,msg,args) {
	var id = '<@'+msg.member.user.id+'>';
	var current = true;
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (Command.checkPermission(msg,'ADMIN',true) && args.length >= 1) {
		id = args[0];
	}
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(idu,usernamecharname){
		Command.getCharacter(msg,id,function(id){
			var f = function() {
				if (current) {
					msg.channel.send(usernamecharname+', '+'Your Inventory Items has been cleared!');
				} else {
					msg.channel.send(usernamecharname+', '+'User '+args[0]+'\'s Inventory Items has been cleared!');
				}
				
			};
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length==0) {
					f();
				} else {
					var data = JSON.parse(rows[0].data);
					data.inventory = data.inventory || {};
					data.inventory.items = {};
					data.inventory.itemstype = {};
					query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
						f();
					});
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'ADMIN / CITIZEN', true)
		.addField('Description', 'Clear the Inventory, Admin can clear the Inventory of other user. Example:\n  '+PREFIX+name+'\n If you are a admin:\n  '+PREFIX+name+' @Flammrock#5464\n  '+PREFIX+name+' "Bob le Bricoleur"', false)
	msg.channel.send(_embed);
});
// ADMIN/CITIZEN
new Command('inventory-item-view', function(appdata,commandname,msg,args) {
	var page = 1;
	var id = '<@'+msg.member.user.id+'>';
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (!Command.checkPermission(msg,'ADMIN',true)) {
		page = (args.length >= 1) ? (parseInt(args[0]) || 1) : 1;
	} else {
		if (args.length >= 1) {
			if (isNaN(args[0])) {
				id = args[0];
				page = (args.length >= 2) ? (parseInt(args[1]) || 1) : 1;
			} else {
				page = (args.length >= 1) ? (parseInt(args[0]) || 1) : 1;
			}
		}
	}
	// ARGS :
	//    - Optional: User id
	//    - Optional: page number
	
	var Max_Item = 10;
	if (page < 1) {
		page = 1;
	}
	
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(idu,usernamecharname){
		Command.getCharacter(msg,id,function(id,name){
			query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
				if (rows.length==0) {
					var _embed = new Discord.MessageEmbed()
					  .setTitle('Inventory of '+name)
					  .setColor(0xff0000)
					  .setDescription('Empty Inventory :stuck_out_tongue_closed_eyes:');
					msg.channel.send(_embed);
				} else {
					var data = JSON.parse(rows[0].data);
					data.inventory = data.inventory || {};
					data.inventory.items = data.inventory.items || {};
					var items = [];
					for (var i in data.inventory.items) {
						if (data.inventory.items.hasOwnProperty(i)) {
							items.push({name:i,data:data.inventory.items[i]});
						}
					}
					if (items.length==0) {
						var _embed = new Discord.MessageEmbed()
						  .setTitle('Inventory of '+name)
						  .setColor(0xff0000)
						  .setDescription('Empty Inventory :stuck_out_tongue_closed_eyes:');
						msg.channel.send(_embed);
					} else {
						var _text = '';
						for (var i=0+(page-1)*Max_Item; i < items.length && i < page*Max_Item; i++) {
							_text += '**'+items[i].name+'**: '+items[i].data+' Quantity\n\n';
						}
						if (_text=='') {
							var _embed = new Discord.MessageEmbed()
							  .setTitle('Inventory of '+name)
							  .setColor(0xff0000)
							  .setDescription('Page '+page+' doesn\'t exist :stuck_out_tongue_closed_eyes:');
							msg.channel.send(_embed);
							return;
						}
						_text += '*Page '+page+' of '+(Math.ceil(items.length/Max_Item))+'*';
						var _embed = new Discord.MessageEmbed()
							.setTitle('Inventory of '+name)
							.setColor(0xff0000)
							.setDescription(_text);
						msg.channel.send(_embed);
					}
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' {Page}\n```')
		.addField('Permission', 'ADMIN / CITIZEN', true)
		.addField('Description', 'Get the Inventory, Admin can see the Inventory of other user. Example:\n  '+PREFIX+name+'\n If you are a admin:\n  '+PREFIX+name+' @Flammrock#5464\n  '+PREFIX+name+' "Bob le Bricoleur" 3', false)
	msg.channel.send(_embed);
});

// CITIZEN
new Command('item-list', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	// ARGS :
	//    - Optional: Shop Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(idu,usernamecharname){
		if (args.length==0) {
			query('SELECT name FROM items',function(err,rows) {
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'There are no Items!');
				} else {
					var rows2 = [];
					for (var i = 0; i < rows.length; i++) {
						rows2.push(rows[i].name.substring(rows[i].name.indexOf('_')+1).substring(rows[i].name.substring(rows[i].name.indexOf('_')+1).indexOf('_')+1));
					}
					var _embed = new Discord.MessageEmbed()
					  .setTitle('List Of Items')
					  .setColor(0xff0000)
					  .setDescription('• **'+rows2.join('**\n• **')+'**');
					msg.author.send(_embed);
					msg.channel.send(usernamecharname+', '+'I sent you the list of Items!');
				}
			});
		} else {
			query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				if (rows.length==0) {
					Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
					return;
				}
				query('SELECT * FROM items',function(err,rows) {
					if (rows.length==0) {
						msg.channel.send(usernamecharname+', '+'There are no Items!');
					} else {
						var rows2 = [];
						for (var i = 0; i < rows.length; i++) {
							var data = JSON.parse(rows[i].data);
							for (var j = 0; j < data.shops.length; j++) {
								if (data.shops[j]==args[0]) {
									rows2.push(rows[i].name.substring(rows[i].name.indexOf('_')+1).substring(rows[i].name.substring(rows[i].name.indexOf('_')+1).indexOf('_')+1));
									break;
								}
							}
						}
						var _embed = new Discord.MessageEmbed()
						  .setTitle('List Of Items in the Shop '+args[0])
						  .setColor(0xff0000)
						  .setDescription('• **'+rows2.join('**\n• **')+'**');
						msg.author.send(_embed);
						msg.channel.send(usernamecharname+', '+'I sent you the list of Items!');
					}
				});
			});
		}
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' {ShopName}\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'If a Shop is specified, that list all items in the shop else that list all items. Example:\n  '+PREFIX+name+'\n  '+PREFIX+name+' "Flammrock Shop"', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('item-view', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Item Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(idu,usernamecharname){
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			var _embed = new Discord.MessageEmbed()
				.setTitle('Item '+args[0])
				.setColor(0xff0000)
				.setDescription('**PRICE**: '+data.price+'\n**SHOPS**: '+data.shops.join(', ')+'\n**TYPE**: '+data.type+'\n**Image**: '+data.image+'\n**Description**: '+data.description);
			msg.channel.send(_embed);
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'View data of the specified Item. Example:\n  '+PREFIX+name+' "A Super Item"', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('item-pay', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//     - Shop Name
	//     - Item ID
	//     - Optional: Bank Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		var f = function(){
			msg.channel.send(usernamecharname+', '+'You buy the `'+args[1]+'` Item in the `'+args[0]+'` Shop with Success!');
		};
		var chan = '<#'+msg.channel.id+'>';
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var tempdata = JSON.parse(rows[0].data);
			tempdata.web = typeof tempdata.web !== 'undefined' ? tempdata.web : true;
			if (tempdata.salons.length==0) {
				if (tempdata.web) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Shop is only accessible through the web :cold_sweat:\nLink to the online shop: https://accountsupervisorwebinterface.herokuapp.com/guild/'+msg.guild.id+'/shop/'+encodeURIComponent(args[0]));
				} else {
					Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				}
				return;
			} else {
				var okisin = false;
				for (var u = 0; u < tempdata.salons.length; u++) {
					if (tempdata.salons[u]==chan) {
						okisin = true;
						break;
					}
				}
				if (!okisin) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Shop is only accessible on this salons: '+tempdata.salons.join(', '));
					if (tempdata.web) {
						msg.channel.send('However, `'+args[0]+'` Shop is accessible through the web\nLink to the online shop: https://accountsupervisorwebinterface.herokuapp.com/guild/'+msg.guild.id+'/shop/'+encodeURIComponent(args[0]));
					}
					return;
				}
			}
			query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows){
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[1]+'` Item doesn\'t exist :cold_sweat:');
					return;
				}
				var data = JSON.parse(rows[0].data);
				var isin = false;
				for (var i = 0; i < data.shops.length; i++) {
					if (data.shops[i]==args[0]) {
						isin = true;
						break;
					}
				}
				if (isin) {
					query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
						if (rows.length==0) {
							msg.channel.send(usernamecharname+', '+'Sorry, you haven\'t enought '+appdata['money-name']+' :cold_sweat:');
							return;
						}
						var userdata = JSON.parse(rows[0].data);
						userdata.inventory = userdata.inventory || {};
						userdata.inventory.items = userdata.inventory.items || {};
						userdata.inventory.itemstype = userdata.inventory.itemstype || {};
						var can = false;
						for (var t = 0; t < tempdata.need.length; t++) {
							for (var p in userdata.inventory.items) {
								if (userdata.inventory.items.hasOwnProperty(p)) {
									if (p==escape_mysql(tempdata.need[t])) {
										can = true;
										break;
									}
								}
							}
						}
						if (tempdata.need.length==0) can = true;
						var cantype = false;
						for (var t = 0; t < tempdata.needType.length; t++) {
							for (var p in userdata.inventory.itemstype) {
								if (userdata.inventory.itemstype.hasOwnProperty(p)) {
									if (p==tempdata.needType[t]) {
										cantype = true;
										break;
									}
								}
							}
						}
						if (tempdata.needType.length==0) cantype = true;
								
						if (!can) {
							msg.channel.send(usernamecharname+', '+'You must have one of this Items: '+tempdata.need.join(', '));
							return;
						}
						if (!cantype) {
							msg.channel.send(usernamecharname+', '+'You must have one of this Type Items: '+tempdata.needType.join(', '));
							return;
						}
						if (args.length >= 2) {
							query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[2])+'\'',function(err,rows){
								if (rows.length==0) {
									msg.channel.send(usernamecharname+', '+'Sorry, Bank `'+args[0]+'` doesn\'t exist :cold_sweat:');
									return;
								}
								userdata.bank = userdata.bank || {};
								if (typeof userdata.bank[escape_mysql(args[2])] === 'undefined') {
									msg.channel.send(usernamecharname+', '+'Sorry, you don\'t have a `'+args[2]+'` Bank account!');
								} else {
									if ((parseFloat(userdata.bank[escape_mysql(args[2])]) || 0.0) < Math.abs(parseFloat(data.price) || 0.0)) {
										msg.channel.send(usernamecharname+', '+'Sorry, you haven\'t enought '+appdata['money-name']+' :cold_sweat:');
									} else {
										userdata.bank[escape_mysql(args[2])] = (parseFloat(userdata.bank[escape_mysql(args[2])]) || 0.0) - Math.abs(parseFloat(data.price) || 0.0);
										
										if (typeof userdata.inventory.items[escape_mysql(args[1])] === 'undefined') {
											userdata.inventory.items[escape_mysql(args[1])] = 1
										} else {
											userdata.inventory.items[escape_mysql(args[1])] = (parseInt(userdata.inventory.items[escape_mysql(args[1])]) || 0) + 1;
										}
										for (var p = 0; p < data.type.length; p++) {
											if (typeof userdata.inventory.itemstype[data.type[p]] === 'undefined') {
												userdata.inventory.itemstype[data.type[p]] = 1
											} else {
												userdata.inventory.itemstype[data.type[p]] = (parseInt(userdata.inventory.itemstype[data.type[p]]) || 0) + 1;
											}
										}
										query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(userdata))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
											f();
										});
									}
								}
							});
						} else {
							userdata.money = parseFloat(userdata.money) || 0.0;
							if ((parseFloat(userdata.money) || 0.0) < Math.abs(parseFloat(data.price) || 0.0)) {
								msg.channel.send(usernamecharname+', '+'Sorry, you haven\'t enought '+appdata['money-name']+' cash :cold_sweat:');
							} else {
								userdata.money = (parseFloat(userdata.money) || 0.0) - Math.abs(parseFloat(data.price) || 0.0);
								userdata.inventory = userdata.inventory || {};
								userdata.inventory.items = userdata.inventory.items || {};
								if (typeof userdata.inventory.items[escape_mysql(args[1])] === 'undefined') {
									userdata.inventory.items[escape_mysql(args[1])] = 1
								} else {
									userdata.inventory.items[escape_mysql(args[1])] = (parseInt(userdata.inventory.items[escape_mysql(args[1])]) || 0) + 1;
								}
								for (var p = 0; p < data.type.length; p++) {
									if (typeof userdata.inventory.itemstype[data.type[p]] === 'undefined') {
										userdata.inventory.itemstype[data.type[p]] = 1
									} else {
										userdata.inventory.itemstype[data.type[p]] = (parseInt(userdata.inventory.itemstype[data.type[p]]) || 0) + 1;
									}
								}
								query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(userdata))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
									f();
								});
							}
						}
					});
				} else {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[1]+'` Item isn\'t in the `'+args[0]+'` Shop :cold_sweat:');
				}
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName] [ItemName] {BankName}\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Need', 'The Shop must exist. Use `+help shop-create` for more details.', true)
		.addField('Description', 'Pay Item in specified Shop, if not bank specified, the cash is used to pay item. Example:\n  '+PREFIX+name+' "Flammrock Shop" "A Super Item" "Flammrock Bank"', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('item-eat', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	// ARGS :
	//    - Item Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(idu,usernamecharname){
		query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'you don\'t have this Item!');
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.inventory = data.inventory || {};
			data.inventory.items = data.inventory.items || {};
			if (typeof data.inventory.items[escape_mysql(args[0])] === 'undefined') {
				msg.channel.send(usernamecharname+', '+'you don\'t have this Item!');
				return;
			}
			if ((parseInt(data.inventory.items[escape_mysql(args[0])])||0)<=0) {
				msg.channel.send(usernamecharname+', '+'you don\'t have this Item!');
				return;
			}
			query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				if (rows.length==0) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
					return;
				}
				var itemdata = JSON.parse(rows[0].data);
				var isfood = false;
				for (var i = 0; i < itemdata.type.length; i++) {
					if (itemdata.type[i]=='food') {
						isfood = true;
						break;
					}
				}
				if (!isfood) {
					msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Item isn\'t food :cold_sweat:');
					return;
				}
				data.inventory.items[escape_mysql(args[0])] = (parseInt(data.inventory.items[escape_mysql(args[0])])||0) - 1;
				if (data.inventory.items[escape_mysql(args[0])] <= 0) {
					data.inventory.items[escape_mysql(args[0])] = null;
					delete data.inventory.items[escape_mysql(args[0])];
				}
				for (var i = 0; i < itemdata.type.length; i++) {
					data.inventory.itemstype[itemdata.type[i]] = (parseInt(data.inventory.itemstype[itemdata.type[i]])||0) - 1;
					if (data.inventory.itemstype[itemdata.type[i]] <= 0) {
						data.inventory.itemstype[itemdata.type[i]] = null;
						delete data.inventory.itemstype[itemdata.type[i]];
					}
				}
				query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
					msg.channel.send(usernamecharname+', '+'you eat 1 `'+args[0]+'` Item :smiley:');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ItemName]\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Eat the specified Item if the Item is food type. Example:\n  '+PREFIX+name+' "A Super Item"', false)
	msg.channel.send(_embed);
});



// SHOP

// ADMIN
new Command('shop-create', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Shop Name
	//    - Optional: Salons Available
	//    - Optional: Need Item Type for access
	//    - Optional: Need TypeItem Type for access
	//    - Optional: NeedWeb Item Type for access
	//    - Optional: NeedWeb TypeItem Type for access
	//    - Optional: Web access
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length > 0) {
				Speech['ShopAlreadyExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = {
				salons: (args.length >= 2) ? (args[1].trim()!="") ? Command.extractData(args[1]) : [] : [],
				need: (args.length >= 3) ? (args[2].trim()!="") ? Command.extractData(args[2]) : [] : [],
				needType: (args.length >= 4) ? (args[3].trim()!="") ? Command.extractData(args[3]) : [] : [],
				needWeb: (args.length >= 5) ? (args[4].trim()!="") ? Command.extractData(args[4]) : [] : [],
				needWebType: (args.length >= 6) ? (args[5].trim()!="") ? Command.extractData(args[5]) : [] : [],
				web: (args.length >= 7) ? (args[6].trim()!="") ? args[6].toLowerCase()=="true" : false : true,
			};
			if (!Command.checkSalons(msg,data.salons)) return false;
			Command.checkItems(msg,data.need,function(){
				query('INSERT INTO shop(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
					msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop created with success!');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName] {SalonsAvailables} {NeedItems} {NeedTypeItems} {NeedWebItems} {NeedWebTypeItems} {WebAccess}\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Need', 'The Items must exist. Use `+help item-create` for more details.', true)
		.addField('Description', 'Create a Shop. Example:\n  '+PREFIX+name+' "Flammrock Shop" "#general #other-salon" "[A Super Item] [other item name]" "[food] [device]" "" "" "true"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('shop-delete', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Shop Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			query('DELETE FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop deleted with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Delete a Shop by name. Example:\n  '+PREFIX+name+' "Flammrock Shop"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('shop-update-salons', function(appdata,commandname,msg,args,t) {
	if (!t) if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Shop Name
	//    - Salons Available
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.salons = (args[1].trim()!="") ? Command.extractData(args[1]) : [];
			if (!Command.checkSalons(msg,data.salons)) return false;
			query('UPDATE shop SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop updated with success!');
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName] [SalonsAvailables]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Update Salons Availables of the specified Shop. Example:\n  '+PREFIX+name+' "Flammrock Shop" "#general #other-salon"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('shop-update-need', function(appdata,commandname,msg,args,t) {
	if (!t) if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Shop Name
	//    - Need Items
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.need = (args[1].trim()!="") ? Command.extractData(args[1]) : [];
			Command.checkItems(msg,data.need,function(){
				query('UPDATE shop SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
					msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop updated with success!');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName] [NeedItems]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Need', 'The Items must exist. Use `+help item-create` for more details.', true)
		.addField('Description', 'Update Need Items of the specified Shop. Example:\n  '+PREFIX+name+' "Flammrock Shop" "[A Super Item] [other item name]"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('shop-update-needType', function(appdata,commandname,msg,args,t) {
	if (!t) if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Shop Name
	//    - Need Type Items
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.needType = (args[1].trim()!="") ? Command.extractData(args[1]) : [];
			Command.checkItems(msg,data.need,function(){
				query('UPDATE shop SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
					msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop updated with success!');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName] [NeedTypeItems]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Need', 'The Items must exist. Use `+help item-create` for more details.', true)
		.addField('Description', 'Update Need Items Type of the specified Shop. Example:\n  '+PREFIX+name+' "Flammrock Shop" "[food] [device]"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('shop-update-needWeb', function(appdata,commandname,msg,args,t) {
	if (!t) if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Shop Name
	//    - Need Web Items
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.needWeb = (args[1].trim()!="") ? Command.extractData(args[1]) : [];
			Command.checkItems(msg,data.need,function(){
				query('UPDATE shop SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
					msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop updated with success!');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName] [NeedItems]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Need', 'The Items must exist. Use `+help item-create` for more details.', true)
		.addField('Description', 'Update Need Web Items of the specified Shop. Example:\n  '+PREFIX+name+' "Flammrock Shop" "[A Super Item] [other item name]"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('shop-update-needWebType', function(appdata,commandname,msg,args,t) {
	if (!t) if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Shop Name
	//    - Need Web Type Items
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.needWebType = (args[1].trim()!="") ? Command.extractData(args[1]) : [];
			Command.checkItems(msg,data.need,function(){
				query('UPDATE shop SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
					msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop updated with success!');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName] [NeedWebTypeItems]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Need', 'The Items must exist. Use `+help item-create` for more details.', true)
		.addField('Description', 'Update Need Web Items Type of the specified Shop. Example:\n  '+PREFIX+name+' "Flammrock Shop" "[food] [device]"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('shop-update-web', function(appdata,commandname,msg,args,t) {
	if (!t) if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Shop Name
	//    - Web
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.web = (args[1].trim()!="") ? args[1].toLowerCase()=="true" : false;
			Command.checkItems(msg,data.need,function(){
				query('UPDATE shop SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
					msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop updated with success!');
				});
			});
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName] [NeedWebTypeItems]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Update Web Access of the specified Shop. Example:\n  '+PREFIX+name+' "Flammrock Shop" "true"\n  '+PREFIX+name+' "Flammrock Shop" "false"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('shop-delete-all-items-associed-with', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Shop Name
	
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		var f = function() {
			msg.channel.send(usernamecharname+', '+'All Items in `'+args[0]+'` Shop deleted!');
		};
		query('SELECT * FROM items',function(err,rows) {
			if (rows.length==0) {
				f();
			} else {
				var rows2 = [];
				for (var i = 0; i < rows.length; i++) {
					var data = JSON.parse(rows[i].data);
					for (var j = 0; j < data.shops.length; j++) {
						if (data.shops[j]==args[0]) {
							rows2.push(rows[i].name);
							break;
						}
					}
				}
				query('DELETE FROM items WHERE name=\''+rows2.join('\' OR name=\'')+'\'',function(err,rows) {
					f();
				});
			}
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+' [ShopName]\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Information', 'You should type `+help item-create` to see more details.', true)
		.addField('Description', 'Delete all Items associated with the specified Shop. Example:\n  '+PREFIX+name+' "Flammrock Shop"', false)
	msg.channel.send(_embed);
});
// ADMIN
new Command('shop-reset-all', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('DELETE FROM shop',function(err,rows1){
			msg.channel.send(usernamecharname+', '+'Shop System is reset!');
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'ADMIN', true)
		.addField('Description', 'Reset Shop System. Example:\n  '+PREFIX+name+'', false)
	msg.channel.send(_embed);
});

// CITIZEN
new Command('shop-view', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Shop Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(idu,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			var _embed = new Discord.MessageEmbed()
				.setTitle('Shop '+args[0])
				.setColor(0xff0000)
				.setDescription('**SALONS AVAILABLES**: '+data.salons.join(', ')+'\n**NEED ITEMS**: '+data.need.join(', ')+'\n**NEED ITEMS TYPE**: '+data.needType.join(', ')+'\n**NEED WEB ITEMS**: '+data.needWeb.join(', ')+'\n**NEED WEB ITEMS TYPE**: '+data.needWebType.join(', ')+'\n**WEB ACCESS**: '+(data.web?"true":"false"));
			msg.channel.send(_embed);
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'View data of the specified Shop. Example:\n  '+PREFIX+name+' "Flammrock Shop"', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('shop-list', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop',function(err,rows){
			if (rows.length==0) {
				msg.channel.send(usernamecharname+', '+'There are no Shops!');
			} else {
				var rows2 = [];
				for (var i = 0; i < rows.length; i++) {
					rows2.push(rows[i].name.substring(rows[i].name.indexOf('_')+1).substring(rows[i].name.substring(rows[i].name.indexOf('_')+1).indexOf('_')+1));
				}
				var _embed = new Discord.MessageEmbed()
					.setTitle('List Of Shops')
					.setColor(0xff0000)
					.setDescription('• **'+rows2.join('**\n• **')+'**');
				msg.author.send(_embed);
				msg.channel.send(usernamecharname+', '+'I sent you the list of Shops!');
			}
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'List all Shops. Example:\n  '+PREFIX+name+'', false)
	msg.channel.send(_embed);
});
// CITIZEN
new Command('shop-get-website', function(appdata,commandname,msg,args) {
	if (!Command.checkPermission(msg,'CITIZEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Shop Name
	Command.getCharacter(msg,'<@'+msg.member.user.id+'>',function(id,usernamecharname){
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				Speech['ShopNotExist'](appdata,commandname,msg,usernamecharname,args);
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.web = typeof data.web !== 'undefined' ? data.web : true;
			if (data.web) {
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop has an associated website:\n    - https://accountsupervisorwebinterface.herokuapp.com/guild/'+msg.guild.id+'/shop/'+encodeURIComponent(args[0]));
			} else {
				msg.channel.send(usernamecharname+', '+'`'+args[0]+'` Shop has no website');
			}
		});
	});
},function(msg,name){
	var _embed = new Discord.MessageEmbed()
		.setTitle('Command `'+name+'`')
		.setColor('#0099ff')
		.setDescription('```css\n'+PREFIX+name+'\n```')
		.addField('Permission', 'CITIZEN', true)
		.addField('Description', 'Get the Website of the specified Shop if it exist. Example:\n  '+PREFIX+name+' "Flammrock Shop"', false)
	msg.channel.send(_embed);
});

// THIEF
/*
new Command('item_steal', function(msg,args) {
	// ARGS :
	//     - Shop Name
	//     - Item ID
});*/





/*
new Command('bank_create', function(msg,args) {
	//msg.channel.send('wesh comment ça va?');
});
new Command('bank_create', function(msg,args) {
	//msg.channel.send('wesh comment ça va?');
});*/

new Command('list-command', function(appdata,commandname,msg,args) {
	msg.channel.send('• **'+Object.keys(Command.List).join('**\n• **')+'**');
});

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
function activities() {
	var activities_list = [
		["😀 My Creator is Flammrock#5464 😀","WATCHING"], 
		["😝 I will help u if u send me +help","LISTENING"],
		["I update my database 😎","WATCHING"], 
		["I always listen u","LISTENING"],
		["#stayathome 😐","WATCHING"],
		["#restezchezvous 😐","STREAMING"],
		["Hello","WATCHING"],
		["Hi :)","LISTENING"],
		["It's Muffin Times! 😂","STREAMING"],
		["Yeah Man 😎","WATCHING"],
		["You are my bro 😘","PLAYING"],
		["😴 I just woke up, did I miss something? 😴","WATCHING"],
		["😱😱😱😱😱😱😱😱😱😱","PLAYING"],
		["💩","LISTENING"],
		["🤖 Something is wrong, i can feel it!","LISTENING"],
		["Are u ok?","LISTENING"],
		["I work hard for u! can i have choco 🍫 ??","WATCHING"],
		["About 73,600,000 results (0.57 seconds)","PLAYING"],
		["🤯I am moving though the web!! 🤯🤯","STREAMING"],
		["My Creator is a cool French🇫🇷 Guy 🥖","PLAYING"],
		["I'm cool Bot!! 😆","STREAMING"],
		["I'm in the matrix","STREAMING"],
		["Can u beat me?","PLAYING"],
		["my finger is too big!","STREAMING"],
		["Sleeping......","PLAYING"],
		["oh oh oh...🎅🏻🎅🏻","WATCHING"],
		["👨🏻‍💻","PLAYING"]
    ];
	var status_list = [
		"dnd",
		"dnd",
		"invisible",
		"online",
		"invisible",
		"idle",
		"idle",
		"idle"
	];
	var time = Date.now();
	var tick = getRandomIntInclusive(10, 30)*1000;
	
	var time2 = Date.now();
	var tick2 = getRandomIntInclusive(60, 60*4)*1000;
	
	bot.user.setStatus('dnd');
	
	setInterval(() => {
		if (Date.now()-time>tick){
			time = Date.now();
			tick = getRandomIntInclusive(10, 30)*1000;
			var index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
			bot.user.setActivity(activities_list[index][0], {type: activities_list[index][1]});
		}
		if (Date.now()-time2>tick2){
			time2 = Date.now();
			tick2 = getRandomIntInclusive(60, 60*4)*1000;
			var index = Math.floor(Math.random() * (status_list.length - 1) + 1);
			bot.user.setStatus(status_list[index]);
		}
	}, 10000); // Runs this every 10 seconds.
}


//////////////////////////////////////
//           DISCORD BOT            //
//////////////////////////////////////
bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
	activities();
});

bot.on('message', msg => {
	
	if (msg.content.substring(0,PREFIX.length)==PREFIX) {
	
		if (msg.content.substring(0,PREFIX.length+4)==PREFIX+'init') {
			var data = new ParserCommand(msg.content);
			Command.getDataApp(msg.guild.id,function(appdata){
				Command.execute(appdata,msg,data);
			});
			return;
		}
	
		try {
			var role_admin = false;
			var role_citoyen = false;
			msg.guild.roles.cache.forEach(role => {
				if (role.name=='AccountSupervisorAdmin') role_admin = true;
				if (role.name=='AccountSupervisorCitizen') role_citoyen = true;
			});
			if (!role_admin) {
				msg.guild.roles.create({
					data: {
						name: 'AccountSupervisorAdmin',
						color: 'RED',
					},
					reason: '',
				});
			}
			if (!role_citoyen) {
				msg.guild.roles.create({
					data: {
						name: 'AccountSupervisorCitizen',
						color: 'BLUE',
					},
					reason: '',
				});
			}
		} catch(e) {}
	
		if (!msg.guild.channels.cache.find(r=>r.name=='accountsupervisor-database-config')) {
			msg.reply('Sorry, i\'m not yet initialized!\nIf you are a Administrator, use the command `'+PREFIX+'init`');
			return;
		}
		
		
		console.log(msg.channel.id, msg.content);
		
		var data = new ParserCommand(msg.content);
		if (Command.isExist(data.name)) {
			Command.getDataApp(msg.guild.id,function(appdata){
				Command.execute(appdata,msg,data);
			});
		}
	}
});

bot.login(TOKEN);