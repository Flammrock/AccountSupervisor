const Discord = require('discord.js');
const mysql = require("mysql");
const bot = new Discord.Client();


const TOKEN = 'NjkzODI1MzM0ODM1MTUwOTE4.XoLXNQ.hFJvWBxgMR3gd7_A6iHSEOcDZwU';
const DATABASE_URI = process.env.CLEARDB_DATABASE_URL;
const DATABASE_PARSE = DATABASE_URI.match(/mysql:\/\/([^:]+):([^@]+)@([^\/]+)\/([^\?]+)\??/);

console.log(DATABASE_PARSE);

const PREFIX = '+';

const DATABASE = {
	host:       DATABASE_PARSE[3],
	user:       DATABASE_PARSE[1],
	password:   DATABASE_PARSE[2],
	database:   DATABASE_PARSE[4]
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

query(`CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});

query(`CREATE TABLE IF NOT EXISTS bank (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});

query(`CREATE TABLE IF NOT EXISTS shop (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});

query(`CREATE TABLE IF NOT EXISTS items (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});

query(`CREATE TABLE IF NOT EXISTS job (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});

query(`CREATE TABLE IF NOT EXISTS company (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});

query(`CREATE TABLE IF NOT EXISTS dataapp (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});

query(`CREATE TABLE IF NOT EXISTS characterdata (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});


//////////////////////////////////////
//           COMMAND BOT            //
//////////////////////////////////////
class Command {
	
	constructor(name,_fn) {
		this.name = name || '';
		this._fn = _fn || function(){};
		Command.List[this.name] = this;
	}
	
	static isExist(name) {
		return typeof Command.List[name] !== 'undefined';
	}
	
	static execute(msg,data) {
		Command.List[data.name]._fn(msg,data.args);
	}
	
	static checkPermission(msg,mode) {
		switch (mode) {
			case 'ADMIN':
				if (!(msg.member.roles.cache.some(r => r.name === "AccountSupervisorAdmin") || msg.member.hasPermission("ADMINISTRATOR"))) {
					msg.delete();
					msg.author.send('Sorry, you don\'t have the permissions :cold_sweat:\nAnd i\'ve decided to delete your message.');
					return false;
				}
				break;
			case 'CITOYEN':
				if (!(msg.member.roles.cache.some(r => r.name === "AccountSupervisorAdmin") || msg.member.roles.cache.some(r => r.name === "AccountSupervisorCitoyen") || msg.member.hasPermission("ADMINISTRATOR"))) {
					msg.delete();
					msg.author.send('Sorry, you don\'t have the permissions :cold_sweat:\nAnd i\'ve decided to delete your message.');
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
			console.log(salonslist[i].match(test)[1]);
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
			this.name = this.rawdata.substring(1,i1);
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



// ADMIN
new Command('ping', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	msg.channel.send('pong');
});
// ADMIN
new Command('all-reset-all', function(msg,args) {
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
});
// ADMIN
new Command('set-currency', function(msg,args) {
	
});
// ADMIN
new Command('set-cooldown', function(msg,args) {
	
});
// ADMIN
new Command('set-money-format', function(msg,args) {
	
});
// ADMIN
new Command('role-income-add', function(msg,args) {
	//add <role> <cash | bank> <amount> <interval> [<channel> <message>]
});
// ADMIN
new Command('role-income-remove', function(msg,args) {
	//add <role> <cash | bank> <amount> <interval> [<channel> <message>]
});
// ADMIN
new Command('role-income-list', function(msg,args) {
	//add <role> <cash | bank> <amount> <interval> [<channel> <message>]
});


// USER
// ADMIN
new Command('user-reset-all', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	query('DELETE FROM users',function(err,rows1){
		msg.reply('User System is reset!');
	});
});


// CHARACTER
// ADMIN
new Command('character-create', function(msg,args) {
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
});
// CITOYEN+OWNER
new Command('character-delete', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
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
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		query('DELETE FROM characterdata WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Character deleted with success!');
		});
	});
});
// CITOYEN+OWNER
new Command('character-select', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
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
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		console.log(args[0]);
		msg.member.setNickname(args[0]);
		data.selected = 'selected_'+id;
		query('UPDATE characterdata SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Character selected with success!');
		});
	});
});
// CITOYEN+OWNER
new Command('character-unselect', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
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
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		msg.member.setNickname('');
		data.selected = null;
		delete data.selected;
		query('UPDATE characterdata SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Character selected with success!');
		});
	});
});


// COMPANY
// CITOYEN
new Command('company-create', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Company Name
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length > 0) {
			msg.reply('Sorry, `'+args[0]+'` Company is already created :cold_sweat:');
			return;
		}
		var data = {
			owner: id
		};
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length > 0) {
				msg.reply('Sorry, `'+args[0]+'` Company-Shop is already created :cold_sweat:');
				return;
			}
			Command.List['shop-create']._fn(msg,[
				args[0],
				"",
				"",
				"",
				"internet",
				"false"
			]);
			query('INSERT INTO company(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
				msg.reply('`'+args[0]+'` Company created with success!');
			});
		});
	});
});
// ADMIN/CITOYEN+OWNER
new Command('company-delete', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Company Name
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		Command.List['shop-delete']._fn(msg,[args[0]]);
		query('DELETE FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Company deleted with success!');
		});
		
	});
});
// ADMIN/CITOYEN+OWNER
new Command('company-add-job', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Job Name
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.reply('Sorry, `'+args[0]+'` Job doesn\'t exist :cold_sweat:');
				return;
			}
			data.JobsList = data.JobsList || {};
			data.JobsList[escape_mysql(args[1])] = 1;
			query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.reply('Job '+args[1]+' added in `'+args[0]+'` Company with Success!');
			});
		});
	});
});
// ADMIN/CITOYEN+OWNER
new Command('company-remove-job', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Job Name
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.reply('Sorry, `'+args[0]+'` Job doesn\'t exist :cold_sweat:');
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
					msg.reply('Job '+args[1]+' removed from `'+args[0]+'` Company with Success!');
				});
			} else {
				msg.reply('Sorry, `'+args[0]+'` Job not used by `'+args[0]+'` Company :cold_sweat:');
			}
		});
	});
});
// CITOYEN
new Command('company-send-request-job', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Job Name
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.reply('Sorry, `'+args[1]+'` Job doesn\'t exist :cold_sweat:');
				return;
			}
			var data = JSON.parse(rows[0].data);
			data.JobRequests = data.JobRequests || {};
			data.JobRequests[id] = args[1];
			console.log('ID-SEND-REQUEST:','"'+id+'"');
			query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.reply('You have send a `'+args[1]+'` Job Request in `'+args[0]+'` Company with Success!');
			});
		});
	});
});
// ADMIN/CITOYEN+OWNER
new Command('company-accept-request-job', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - user ID
	var id = msg.member.user.id+'';
	var id2 = args[1].match(/<@!?(\d+)>/);
	if (id2==null) {
		msg.reply('Sorry, User '+args[1]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id2 = id2[1];
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.JobRequests = data.JobRequests || {};
		data.Workers = data.Workers || {};
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		console.log('ID-ACCEPT-REQUEST:','"'+id2+'"');
		if (typeof data.JobRequests[id2] !== 'undefined') {
			data.Workers['worker_'+id2] = data.JobRequests[id2];
			data.JobRequests[id2] = null;
			delete data.JobRequests[id2];
			query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.reply('You have accepted the request of '+args[1]+' successfully in `'+args[0]+'` Company!');
			});
		} else {
			msg.reply('Sorry, '+args[1]+' didn\'t send request to the `'+args[0]+'` Company :cold_sweat:');
		}
	});
});
// CITOYEN
new Command('company-give-money', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 4) return;
	// ARGS :
	//    - Company Name
	//    - Bank Company
	//    - Bank User
	//    - Amount
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.bank = data.bank || {};
		if (typeof data.bank[args[1]] === 'undefined') {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t have an `'+args[1]+'` Bank account :cold_sweat:');
			return;
		}
		query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
			if (rows.length==0) {
				msg.reply('Sorry, you don\'t have enought money :cold_sweat:');
				return;
			}
			var userdata = JSON.parse(rows[0].data);
			userdata.bank = data.bank || {};
			if (typeof userdata.bank[args[2]] === 'undefined') {
				msg.reply('Sorry, you don\'t have an `'+args[2]+'` Bank account :cold_sweat:');
				return;
			}
			if ((parseFloat(userdata.bank[args[2]])||0.0) < Math.abs(parseFloat(args[3])||0.0)) {
				msg.reply('Sorry, you don\'t have enought money :cold_sweat:');
				return;
			}
			userdata.bank[args[2]] = (parseFloat(userdata.bank[args[2]])||0.0) - Math.abs(parseFloat(args[3])||0.0);
			data.bank[args[1]] = (parseFloat(data.bank[args[1]])||0.0) + Math.abs(parseFloat(args[3])||0.0);
			query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(userdata))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
					msg.reply('You give `'+args[3]+'` Money to `'+args[0]+'` Company!\n{ <@'+id+'>\'s `'+args[2]+'` Bank account ----> `'+args[0]+'`\'s `'+args[1]+'` Bank account }');
				});
			});
		});
	});
});
// CITOYEN
new Command('company-get-money', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Bank Company
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.bank = data.bank || {};
		if (typeof data.bank[args[1]] === 'undefined') {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t have an `'+args[1]+'` Bank account :cold_sweat:');
			return;
		} else {
			msg.reply('`'+args[0]+'` Company have '+data.bank[args[1]]+' Money in `'+args[1]+'` Bank account');
		}
	});
});
// ADMIN/CITOYEN+OWNER
new Command('company-fire', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - user
	var id = msg.member.user.id+'';
	var id2 = args[1].match(/<@!?(\d+)>/);
	if (id2==null) {
		msg.reply('Sorry, User '+args[1]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id2 = id2[1];
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.Workers = data.Workers || {};
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		if (typeof data.Workers['worker_'+id2] === 'undefined') {
			msg.reply('Sorry, '+args[1]+' doesn\'t work in `'+args[0]+'` Company :cold_sweat:');
			return;
		} else {
			data.Workers['worker_'+id2] = null;
			delete data.Workers['worker_'+id2];
			query('UPDATE company SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.reply('you successfully fired '+args[1]+' in the `'+args[0]+'` Company!');
			});
		}
	});
}); 
// ADMIN/CITOYEN+OWNER
new Command('company-update-shop', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - Key
	//    - Value
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		if (typeof Command.List['shop-update-'+args[1]] === 'undefined') {
			msg.reply('Sorry, This Settings doesn\'t exist :cold_sweat:');
			return;
		}
		Command.List['shop-update-'+args[1]].fn(msg,[args[0],args[2]]);
	});
});
// ADMIN/CITOYEN+OWNER
new Command('company-add-shop-website', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Company Name
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		Command.List['shop-update-web']._fn(msg,[args[0],"true"]);
	});
});
// ADMIN/CITOYEN+OWNER
new Command('company-remove-shop-website', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Company Name
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		Command.List['shop-update-web']._fn(msg,[args[0],"false"]);
	});
});
// ADMIN/CITOYEN+OWNER
new Command('company-create-item', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - item args
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
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
		Command.List['item-create']._fn(msg,newargs);
	});
});
// ADMIN/CITOYEN+OWNER
new Command('company-delete-item', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Company Name
	//    - item args
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Company doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		if (data.owner!=id && !Command.checkPermission(msg,'ADMIN')) {
			msg.reply('Sorry, You aren\'t the owner of `'+args[0]+'` Company :cold_sweat:');
			return;
		}
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows1){
			if (rows.length==0) {
				msg.reply('Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
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
				msg.reply('Sorry, `'+args[0]+'` Item isn\'t created by the `'+args[0]+'` Company :cold_sweat:');
				return;
			}
			Command.List['item-delete']._fn(msg,[args[1]]);
		});
	});
});



// JOB
// ADMIN
new Command('job-create', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Job Name
	//    - Salary
	query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length > 0) {
			msg.reply('Sorry, `'+args[0]+'` Job is already created :cold_sweat:');
			return;
		}
		var data = {
			salary: parseFloat(args[1]) || 325000.0
		};
		query('INSERT INTO job(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
			msg.reply('`'+args[0]+'` Job created with success!');
		});
	});
});
// ADMIN
new Command('job-delete', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Job Name
	query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, Job `'+args[0]+'` doesn\'t exist :cold_sweat:');
			return;
		}
		query('DELETE FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Job deleted with success!');
		});
	});
});
// ADMIN
new Command('job-update-salary', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Job Name
	query('SELECT * FROM job WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, Job `'+args[0]+'` doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.salary = parseFloat(args[1]) || 325000.0;
		query('UPDATE job SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Job updated with success!');
		});
	});
});

// CITOYEN
new Command('job-work', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	var id = msg.member.user.id+'';
	query('SELECT * FROM company WHERE data LIKE \'%worker_'+escape_mysql(id)+'%\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, you don\'t have Job :cold_sweat:');
			return;
		}
		msg.reply('WORK IN PROGRESS!');
	});
});



// BANK

// ADMIN
new Command('bank-create', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Bank Name
	//    - Optional: Amount Money On First Registration
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length > 0) {
			msg.reply('Sorry, `'+args[0]+'` Bank is already created :cold_sweat:');
			return;
		}
		var data = {
			moneyOnStart: args.length >= 2 ? (parseFloat(args[1]) || 0.0) : 0.0
		};
		query('INSERT INTO bank(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
			msg.reply('`'+args[0]+'` Bank created with success!');
		});
	});
});
// ADMIN
new Command('bank-delete', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Bank Name
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, Bank `'+args[0]+'` doesn\'t exist :cold_sweat:');
			return;
		}
		query('DELETE FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Bank deleted with success!');
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
// ADMIN
new Command('bank-add-user', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	var id = args[1].match(/<@!?(\d+)>/);
	if (id==null) {
		msg.reply('Sorry, User '+args[1]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id = id[1];
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
		if (rows1.length==0) {
			msg.reply('Sorry, Bank `'+args[0]+'` doesn\'t exist :cold_sweat:');
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
					msg.reply('User '+args[1]+' added in `'+args[0]+'` Bank with Success!');
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
					msg.reply('User '+args[1]+' added in `'+args[0]+'` Bank with Success!');
				});
			}
		});
	});
});
// ADMIN
new Command('bank-remove-user', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	var id = args[1].match(/<@!?(\d+)>/);
	if (id==null) {
		msg.reply('Sorry, User '+args[1]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id = id[1];
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
		if (rows1.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Bank doesn\'t exist :cold_sweat:');
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
					msg.reply('User '+args[1]+' removed in `'+args[0]+'` Bank with Success!');
				});
			}
		});
	});
});
// ADMIN
new Command('bank-give-money-user', function(msg,args,t) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 3) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
	var id = args[1].match(/<@!?(\d+)>/);
	if (id==null) {
		msg.reply('Sorry, User '+args[1]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id = id[1];
	var f = function() {
		msg.reply('`'+((typeof t !== 'undefined')?(parseFloat(args[2])||0.0):Math.abs((parseFloat(args[2])||0.0)))+'` Money '+((typeof t !== 'undefined')?'set':(parseFloat(args[2]) || 0.0)<0?'removed':'added')+' to the '+args[1]+'\'s account in the `'+args[0]+'` Bank with Success!');	
	}
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
		if (rows1.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Bank doesn\'t exist :cold_sweat:');
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
// ADMIN
new Command('bank-remove_money_user', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 3) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
	args[2] = (parseFloat(args[2]) || 0.0)*-1;
	Command.List['bank-give-money-user']._fn(msg,args);
});
// ADMIN
new Command('bank-set-money-user', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 3) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
	Command.List['bank-give-money-user']._fn(msg,args,true);
});
// ADMIN
new Command('bank-get-money-user', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	var id = args[1].match(/<@!?(\d+)>/);
	if (id==null) {
		msg.reply('Sorry, User '+args[1]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id = id[1];
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
		if (rows1.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Bank doesn\'t exist :cold_sweat:');
			return;
		}
		query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
			if (rows.length > 0) {
				var obj = JSON.parse(rows[0].data);
				obj.bank = obj.bank || {};
				try {
					if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined') {
						msg.reply('User '+args[1]+' have `'+obj.bank[escape_mysql(args[0])]+'` Money Left in his `'+args[0]+'` Bank account!');
						return;
					} else {}
				} catch (e) {}
			}
			msg.reply('User '+args[1]+' don\'t have a `'+args[0]+'` Bank account!');
		});
	});
});
// ADMIN
new Command('bank-reset-all', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	query('DELETE FROM bank',function(err,rows1){
		msg.reply('Bank System is reset!');
	});
});

// CITOYEN
new Command('give-money', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 4) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - User Bank Name
	//     - Amount Money
	var id_currentuser = msg.member.user.id+'';
	var id_user = args[1].match(/<@!?(\d+)>/);
	if (id_user==null) {
		msg.reply('Sorry, User '+args[1]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id_user = id_user[1];
	if (id_currentuser == id_user) {
		msg.reply('Sorry, you can\'t give yourself your own money :upside_down:');
		return;
	}
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
		if (rows1.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Bank  doesn\'t exist :cold_sweat:');
			return;
		}
		query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id_currentuser)+'\'',function(err,rowsu){
			if (rowsu.length > 0) {
				var obju = JSON.parse(rowsu[0].data);
				obju.bank = obju.bank || {};
				if (typeof obju.bank[escape_mysql(args[0])] !== 'undefined') {
					if ((parseFloat(obju.bank[escape_mysql(args[0])])||0) < Math.abs((parseFloat(args[3])||0))) {
						msg.reply('Sorry, you don\'t have enought money in your `'+args[0]+'` Bank account!');
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
										msg.reply('You give `'+args[3]+'` Money to '+args[1]+'!\n{ <@'+id_currentuser+'>\'s `'+args[0]+'` Bank account ----> '+args[1]+'\'s `'+args[2]+'` Bank account }');
									});
								});
								return;
							}
						}
						msg.reply('Sorry, '+args[1]+' don\'t have a `'+args[0]+'` Bank account!');
					});
					return;
				}
			}
			msg.reply('Sorry, you don\'t have a `'+args[0]+'` Bank account!');
		});
	});
});
// CITOYEN
new Command('bank-create-account', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Bank Name
	var id = msg.member.user.id+'';
	var f = function() {
		msg.reply('Your `'+args[0]+'` Bank account is created with Success!');
	};
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
		if (rows1.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Bank doesn\'t exist :cold_sweat:');
			return;
		}
		query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(msg.member.user.id+'')+'\'',function(err,rows){
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
					msg.reply('Sorry, you have already a `'+args[0]+'` Bank account :cold_sweat:');
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
// CITOYEN
new Command('bank-delete-account', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Bank Name
	var id = msg.member.user.id+'';
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Bank doesn\'t exist :cold_sweat:');
			return;
		}
		query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(msg.member.user.id+'')+'\'',function(err,rows){
			if (rows.length!=0) {
				var obj = JSON.parse(rows[0].data);
				obj.bank = obj.bank || {};
				if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined') {
					obj.bank[escape_mysql(args[0])] = null;
					delete obj.bank[escape_mysql(args[0])];
					query('UPDATE users SET data = \''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(JSON.stringify(obj))+'\' WHERE name=\''+escape_mysql(id)+'\'',function(err,rows){
						msg.reply('Your `'+args[0]+'` Bank account is deleted with Success!');
					});
					return;
				}
			}
			msg.reply('Sorry, you don\'t have a `'+args[0]+'` Bank account :cold_sweat:');
		});
	});
});
// CITOYEN
new Command('get-money', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Bank Name
	var f = function(money) {
		msg.reply('You have `'+money+'` Money left in your `'+args[0]+'` Bank account!');
	};
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Bank doesn\'t exist :cold_sweat:');
			return;
		}
		query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(msg.member.user.id+'')+'\'',function(err,rows){
			if (rows.length==0) {
				msg.reply('Sorry, you don\'t have a `'+args[0]+'` Bank account yet!\nPlease create a bank account with the command:\n        `+bank_create_account '+args[0]+'`');
				return;
			} else {
				var obj = JSON.parse(rows[0].data);
				obj.bank = obj.bank || {};
				var money = 0.0;
				try {
					if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined') {
						money = parseFloat(obj.bank[escape_mysql(args[0])]) || 0.0;
					} else {
						msg.reply('Sorry, you don\'t have a `'+args[0]+'` Bank account yet!\nPlease create a bank account with the command:\n        `+bank_create_account '+args[0]+'`');
						return;
					}
				} catch (e) {}
				f(money);
			}
		});
	});
});
// CITOYEN
new Command('bank-list', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	query('SELECT * FROM bank',function(err,rows){
		if (rows.length==0) {
			msg.reply('There are no Banks!');
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
			msg.reply('I sent you the list of Banks!');
		}
	});
});
// CITOYEN
new Command('bank-deposit', function(msg,args) {
	
});
// CITOYEN
new Command('bank-withdraw', function(msg,args) {
	
});



// Item
// ADMIN
new Command('item-create', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Item Name
	//    - Price
	//    - Shops
	//    - Type
	//    - Image
	//    - Description
	query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows1){
		if (rows1.length>0) {
			msg.reply('Sorry, `'+args[0]+'` Item is already created :cold_sweat:');
			return;
		}
		var data = {};
		data.price = (args.length >= 2) ? (parseFloat(args[1]) || 0.0) : 0.0;
		data.shops = (args.length >= 3) ? args[2].split(' ') : [];
		data.type = (args.length >= 4) ? args[3].split(' ') : [];
		data.image = (args.length >= 5) ? args[4] : '';
		data.description = (args.length >= 6) ? args[5] : 'No Description';
		query('INSERT INTO items(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
			msg.reply('`'+args[0]+'` Item created with success!');
		});
	});
});
// ADMIN
new Command('item-update-price', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Price
	query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.price = (parseFloat(args[1]) || 0.0);
		query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Item updated with success!');
		});
	});
});
// ADMIN
new Command('item-update-shops', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Shops
	query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.shops = args[1].split(' ');
		query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Item updated with success!');
		});
	});
});
// ADMIN
new Command('item-update-type', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Type
	query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.type = args[1].split(' ');
		query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Item updated with success!');
		});
	});
});
// ADMIN
new Command('item-update-image', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Image
	query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.image = args[1];
		query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Item updated with success!');
		});
	});
});
// ADMIN
new Command('item-update-desciption', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - Description
	query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.description = args[1];
		query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Item updated with success!');
		});
	});
});
// ADMIN
new Command('item-delete', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Item Name
	query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
			return;
		}
		query('DELETE FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Item deleted with success!');
		});
	});
});
// ADMIN
new Command('item-give', function(msg,args,t) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - User id
	//    - Optional: Quantity
	var id = args[1].match(/<@!?(\d+)>/);
	if (id==null) {
		msg.reply('Sorry, User '+args[1]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id = id[1];
	var f = function() {
		msg.reply(((args.length >= 2) ? (parseInt(args[2]) || 1) > 1 ? args[2]+' Items ' : 'Item ' : 'Item ')+'`'+args[0]+'` successfully given to '+args[1]+'!');
	};
	query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
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
					if (data.inventory.itemstype[dataitem.type[i]] < 0) {
						data.inventory.itemstype[dataitem.type[i]] = null;
						delete data.inventory.itemstype[dataitem.type[i]];
					}
				}
				if (data.inventory.items[escape_mysql(args[0])] < 0) {
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
				if (data.inventory.items[escape_mysql(args[0])] < 0) {
					data.inventory.items[escape_mysql(args[0])] = null;
					delete data.inventory.items[escape_mysql(args[0])];
				}
				for (var i = 0; i < dataitem.type.length; i++) {
					if (typeof data.inventory.itemstype[dataitem.type[i]] !== 'undefined') {
						data.inventory.itemstype[dataitem.type[i]] = (parseInt(data.inventory.itemstype[dataitem.type[i]]) || 0) + g;
					} else {
						data.inventory.itemstype[dataitem.type[i]] = g;
					}
					if (data.inventory.itemstype[dataitem.type[i]] < 0) {
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
// ADMIN
new Command('item-remove', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - User id
	//    - Optional: Quantity
	Command.List['item-give']._fn(msg,args,true);
});
// ADMIN
new Command('item-reset-all', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	query('DELETE FROM items',function(err,rows1){
		msg.reply('Item System is reset!');
	});
});

// ADMIN/CITOYEN
new Command('inventory-item-clear', function(msg,args) {
	var id = msg.member.user.id+'';
	var current = true;
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (Command.checkPermission(msg,'ADMIN') && args.length >= 1) {
		id = args[0].match(/<@!?(\d+)>/);
		if (id==null) {
			msg.reply('Sorry, User '+args[0]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
			return;
		}
		id = id[1];
		var current = false;
		if (!msg.guild.members.cache.find(r => r.id == id)) {
			msg.reply('Sorry, User '+args[0]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
			return;
		}
	}
	var f = function() {
		if (current) {
			msg.reply('Your Inventory Items has been cleared!');
		} else {
			msg.reply('User '+args[0]+'\'s Inventory Items has been cleared!');
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
// ADMIN/CITOYEN
new Command('inventory-item-view', function(msg,args) {
	var page = 1;
	var id = msg.member.user.id+'';
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (!Command.checkPermission(msg,'ADMIN')) {
		page = (args.length >= 1) ? (parseInt(args[0]) || 1) : 1;
	} else {
		if (args.length >= 1) {
			if (args[0].trim().substring(0,1)=='<') {
				id = args[0].match(/<@!?(\d+)>/);
				if (id==null) {
					msg.reply('Sorry, User '+args[0]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
					return;
				}
				id = id[1];
				page = (args.length >= 2) ? (parseInt(args[1]) || 1) : 1;
			} else {
				page = (args.length >= 1) ? (parseInt(args[0]) || 1) : 1;
			}
		}
	}
	// ARGS :
	//    - Optional: User id
	//    - Optional: page number
	
	if (!msg.guild.members.cache.find(r => r.id == id)) {
		msg.reply('Sorry, User '+args[0]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	
	var user = msg.guild.members.cache.find(r => r.id == id).user;
	var name = user.username + '#' + user.discriminator;
	
	var Max_Item = 10;
	if (page < 1) {
		page = 1;
	}
	
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

// CITOYEN
new Command('item-list', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	// ARGS :
	//    - Optional: Shop Name
	if (args.length==0) {
		query('SELECT name FROM items',function(err,rows) {
			if (rows.length==0) {
				msg.reply('There are no Items!');
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
				msg.reply('I sent you the list of Items!');
			}
		});
	} else {
		query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.reply('Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
				return;
			}
			query('SELECT * FROM items',function(err,rows) {
				if (rows.length==0) {
					msg.reply('There are no Items!');
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
					msg.reply('I sent you the list of Items!');
				}
			});
		});
	}
});
// CITOYEN
new Command('item-view', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Item Name
	query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Item doesn\'t exist :cold_sweat:');
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
// CITOYEN
new Command('item-pay', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//     - Shop Name
	//     - Item ID
	//     - Optional: Bank Name
	var id = msg.member.user.id+'';
	var f = function(){
		msg.reply('You buy the `'+args[1]+'` Item in the `'+args[0]+'` Shop with Success!');
	};
	var chan = '<#'+msg.channel.id+'>';
	query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
			return;
		}
		var tempdata = JSON.parse(rows[0].data);
		tempdata.web = typeof tempdata.web !== 'undefined' ? tempdata.web : true;
		if (tempdata.salons.length==0) {
			if (tempdata.web) {
				msg.reply('Sorry, `'+args[0]+'` Shop is only accessible through the web :cold_sweat:\nLink to the online shop: https://accountsupervisorwebinterface.herokuapp.com/guild/'+msg.guild.id+'/shop/'+encodeURIComponent(args[0]));
			} else {
				msg.reply('Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
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
				msg.reply('Sorry, `'+args[0]+'` Shop is only accessible on this salons: '+tempdata.salons.join(', '));
				if (tempdata.web) {
					msg.channel.send('However, `'+args[0]+'` Shop is accessible through the web\nLink to the online shop: https://accountsupervisorwebinterface.herokuapp.com/guild/'+msg.guild.id+'/shop/'+encodeURIComponent(args[0]));
				}
				return;
			}
		}
		query('SELECT * FROM items WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[1])+'\'',function(err,rows){
			if (rows.length==0) {
				msg.reply('Sorry, `'+args[1]+'` Item doesn\'t exist :cold_sweat:');
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
						msg.reply('Sorry, you haven\'t enought money :cold_sweat:');
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
						msg.reply('You must have one of this Items: '+tempdata.need.join(', '));
						return;
					}
					if (!cantype) {
						msg.reply('You must have one of this Type Items: '+tempdata.needType.join(', '));
						return;
					}
					if (args.length >= 2) {
						query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[2])+'\'',function(err,rows){
							if (rows.length==0) {
								msg.reply('Sorry, Bank `'+args[0]+'` doesn\'t exist :cold_sweat:');
								return;
							}
							userdata.bank = userdata.bank || {};
							if (typeof userdata.bank[escape_mysql(args[2])] === 'undefined') {
								msg.reply('Sorry, you don\'t have a `'+args[2]+'` Bank account!');
							} else {
								if ((parseFloat(userdata.bank[escape_mysql(args[2])]) || 0.0) < Math.abs(parseFloat(data.price) || 0.0)) {
									msg.reply('Sorry, you haven\'t enought money :cold_sweat:');
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
							msg.reply('Sorry, you haven\'t enought money :cold_sweat:');
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
				msg.reply('Sorry, `'+args[1]+'` Item isn\'t in the `'+args[0]+'` Shop :cold_sweat:');
			}
		});
	});
});
// CITOYEN
new Command('item-eat', function(msg,args) {
	
});



// SHOP

// ADMIN
new Command('shop-create', function(msg,args) {
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
	query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length > 0) {
			msg.reply('Sorry, `'+args[0]+'` Shop is already created :cold_sweat:');
			return;
		}
		var data = {
			salons: (args.length >= 2) ? (args[1].trim()!="") ? args[1].split(' ') : [] : [],
			need: (args.length >= 3) ? (args[2].trim()!="") ? args[2].split(' ') : [] : [],
			needType: (args.length >= 4) ? (args[3].trim()!="") ? args[3].split(' ') : [] : [],
			needWeb: (args.length >= 5) ? (args[4].trim()!="") ? args[4].split(' ') : [] : [],
			needWebType: (args.length >= 6) ? (args[5].trim()!="") ? args[5].split(' ') : [] : [],
			web: (args.length >= 7) ? (args[6].trim()!="") ? args[6].toLowerCase()=="true" : false : true,
		};
		if (!Command.checkSalons(msg,data.salons)) return false;
		Command.checkItems(msg,data.need,function(){
			query('INSERT INTO shop(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
				msg.reply('`'+args[0]+'` Shop created with success!');
			});
		});
	});
});
// ADMIN
new Command('shop-delete', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//     - Shop Name
	query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
			return;
		}
		query('DELETE FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Shop deleted with success!');
		});
	});
});
// ADMIN
new Command('shop-update-salons', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Shop Name
	//    - Salons Available
	query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.salons = (args[1].trim()!="") ? args[1].split(' ') : [];
		if (!Command.checkSalons(msg,data.salons)) return false;
		query('UPDATE shop SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Shop updated with success!');
		});
	});
});
// ADMIN
new Command('shop-update-need', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Shop Name
	//    - Salons Available
	query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.need = (args[1].trim()!="") ? args[1].split(' ') : [];
		Command.checkItems(msg,data.need,function(){
			query('UPDATE shop SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.reply('`'+args[0]+'` Shop updated with success!');
			});
		});
	});
});
// ADMIN
new Command('shop-update-web', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Shop Name
	//    - Web
	query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.web = (args[1].trim()!="") ? args[1].toLowerCase()=="true" : false;
		Command.checkItems(msg,data.need,function(){
			query('UPDATE shop SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
				msg.reply('`'+args[0]+'` Shop updated with success!');
			});
		});
	});
});
// ADMIN
new Command('shop-delete-all-items-associed-with', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Shop Name
	var f = function() {
		msg.reply('All Items in `'+args[0]+'` Shop deleted!');
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
// ADMIN
new Command('shop-reset-all', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	query('DELETE FROM shop',function(err,rows1){
		msg.reply('Shop System is reset!');
	});
});

// CITOYEN
new Command('shop-list', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	query('SELECT * FROM shop',function(err,rows){
		if (rows.length==0) {
			msg.reply('There are no Shops!');
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
			msg.reply('I sent you the list of Shops!');
		}
	});
});
// CITOYEN
new Command('shop-get-website', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Shop Name
	query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		data.web = typeof data.web !== 'undefined' ? data.web : true;
		if (data.web) {
			msg.reply('`'+args[0]+'` Shop has an associated website:\n    - https://accountsupervisorwebinterface.herokuapp.com/guild/'+msg.guild.id+'/shop/'+encodeURIComponent(args[0]));
		} else {
			msg.reply('`'+args[0]+'` Shop has no website');
		}
	});
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

new Command('list_command', function(msg,args) {
	msg.channel.send(Object.keys(Command.List).join(', '));
});

//////////////////////////////////////
//           DISCORD BOT            //
//////////////////////////////////////
bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
	try {
		console.log(msg.channel.id, msg.content);
		var role_admin = false;
		var role_citoyen = false;
		msg.guild.roles.cache.forEach(role => {
			if (role.name=='AccountSupervisorAdmin') role_admin = true;
			if (role.name=='AccountSupervisorCitoyen') role_citoyen = true;
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
					name: 'AccountSupervisorCitoyen',
					color: 'BLUE',
				},
				reason: '',
			});
		}
	} catch(e) {}
	if (msg.content.substring(0,PREFIX.length)==PREFIX) {
		var data = new ParserCommand(msg.content);
		if (Command.isExist(data.name)) {
			Command.execute(msg,data);
		}
	}
});

bot.login(TOKEN);