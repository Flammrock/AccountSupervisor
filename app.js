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
				} catch (e) {connection.end();return;}
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
		if (itemsList.length==0) callback();
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
		this.name = "";
		this.args = [];
		var i1 = this.rawdata.indexOf(' ');
		if (i1 > 0) {
			this.name = this.rawdata.substring(1,i1);
			this.args = [];
			this.rawdata.substring(i1+1).replace(/"[^"]*"|[^ ]+/g,function(m){
				this.args.push(m.match(/^"?([^"]*)"?/)[1]);
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



// BANK

// ADMIN
new Command('bank_create', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Bank Name
	//    - Amount Money On First Registration
	query('SELECT * FROM bank WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length > 0) {
			msg.reply('Sorry, `'+args[0]+'` Bank is already created :cold_sweat:');
			return;
		}
		query('INSERT INTO bank(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(args[1])+'\')',function(err,rows){
			msg.reply('`'+args[0]+'` Bank created with success!');
		});
	});
});
// ADMIN
new Command('bank_delete', function(msg,args) {
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
new Command('bank_add_user', function(msg,args) {
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
new Command('bank_remove_user', function(msg,args) {
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
new Command('bank_give_money_user', function(msg,args,t) {
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
new Command('bank_remove_money_user', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 3) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
	args[2] = (parseFloat(args[2]) || 0.0)*-1;
	Command.List['bank_give_money_user']._fn(msg,args);
});
// ADMIN
new Command('bank_set_money_user', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 3) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
	Command.List['bank_give_money_user']._fn(msg,args,true);
});
// ADMIN
new Command('bank_get_money_user', function(msg,args) {
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

// CITOYEN
new Command('give_money', function(msg,args) {
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
new Command('bank_create_account', function(msg,args) {
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
new Command('bank_delete_account', function(msg,args) {
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
new Command('get_money', function(msg,args) {
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


// Item
// ADMIN
new Command('item_create', function(msg,args) {
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
		data.type = (args.length >= 4) ? args[3] : '';
		data.image = (args.length >= 5) ? args[4] : '';
		data.description = (args.length >= 6) ? args[5] : 'No Description';
		query('INSERT INTO items(name,data) VALUES (\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\',\''+escape_mysql(JSON.stringify(data))+'\')',function(err,rows){
			msg.reply('`'+args[0]+'` Item created with success!');
		});
	});
});
// ADMIN
new Command('item_update_price', function(msg,args) {
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
new Command('item_update_shops', function(msg,args) {
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
new Command('item_update_type', function(msg,args) {
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
		data.type = args[1];
		query('UPDATE items SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('`'+args[0]+'` Item updated with success!');
		});
	});
});
// ADMIN
new Command('item_update_image', function(msg,args) {
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
new Command('item_update_desciption', function(msg,args) {
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
new Command('item_delete', function(msg,args) {
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
new Command('item_give', function(msg,args,t) {
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
		var g = (typeof t !== 'undefined') ? (args.length >= 2) ? (parseInt(args[2])*-1 || -1) : -1 : (args.length >= 2) ? (parseInt(args[2]) || 1) : 1;
		query('SELECT * FROM users WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
			if (rows.length==0) {
				var data = {
					inventory: {
						items: {}
					}
				};
				data.inventory.items[escape_mysql(args[0])] = g;
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
				if (typeof data.inventory.items[escape_mysql(args[0])] !== 'undefined') {
					data.inventory.items[escape_mysql(args[0])] = (parseInt(data.inventory.items[escape_mysql(args[0])]) || 0) + g;
				} else {
					data.inventory.items[escape_mysql(args[0])] = g;
				}
				if (data.inventory.items[escape_mysql(args[0])] < 0) {
					data.inventory.items[escape_mysql(args[0])] = null;
					delete data.inventory.items[escape_mysql(args[0])];
				}
				query('UPDATE users SET data = \''+escape_mysql(JSON.stringify(data))+'\' WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(id)+'\'',function(err,rows){
					f();
				});
			}
		});
	});
});
// ADMIN
new Command('item_remove', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//    - Item Name
	//    - User id
	//    - Optional: Quantity
	Command.List['item_give']._fn(msg,args,true);
});
// ADMIN
new Command('inventory_item_view', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - User id
	//    - Optional: page number
	
	var id = args[0].match(/<@!?(\d+)>/);
	if (id==null) {
		msg.reply('Sorry, User '+args[0]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id = id[1];
	
	if (!msg.guild.members.cache.find(r => r.id == id)) {
		msg.reply('Sorry, User '+args[0]+' doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	
	var user = msg.guild.members.cache.find(r => r.id == id).user;
	var name = user.username + '#' + user.discriminator;
	
	var Max_Item = 10;
	var page = (args.length >= 2) ? (parseInt(args[1]) || 1) : 1;
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
new Command('item_list', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	// ARGS :
	//    - Optional: Shop Name
	if (args.length==0) {
		query('SELECT name FROM items',function(err,rows) {
			if (rows.length==0) {
				msg.reply('There are no Items!');
			} else {
				msg.author.send('• **'+rows.join('\n• **'));
				msg.reply('I sent you the list of items!');
			}
		});
	} else {
		
	}
});
// CITOYEN
new Command('item_view', function(msg,args) {
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
			.setDescription('**PRICE**: '+data.price+'\n**SHOPS**: '+data.shop.join(', ')+'\n**TYPE**: '+data.type+'\n**Image**: '+data.image+'\n**Description**: '+data.description);
		msg.channel.send(_embed);
	});
});




// SHOP

// ADMIN
new Command('shop_create', function(msg,args) {
	if (!Command.checkPermission(msg,'ADMIN')) return false;
	if (args.length < 1) return;
	// ARGS :
	//    - Shop Name
	//    - Optional: Salons Available
	//    - Optional: Need Item Type for access
	query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length > 0) {
			msg.reply('Sorry, `'+args[0]+'` Shop is already created :cold_sweat:');
			return;
		}
		var data = {
			salons: (args.length >= 2) ? (args[1].trim()!="") ? args[1].split(' ') : [] : [],
			need: (args.length >= 3) ? (args[2].trim()!="") ? args[2].split(' ') : [] : []
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
new Command('shop_delete', function(msg,args) {
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
new Command('shop_update_salons', function(msg,args) {
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
new Command('shop_update_need', function(msg,args) {
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

// CITOYEN
new Command('item_pay', function(msg,args) {
	if (!Command.checkPermission(msg,'CITOYEN')) return false;
	if (args.length < 2) return;
	// ARGS :
	//     - Shop Name
	//     - Item ID
	query('SELECT * FROM shop WHERE name=\''+escape_mysql('name_'+msg.guild.id+'_')+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, `'+args[0]+'` Shop doesn\'t exist :cold_sweat:');
			return;
		}
		var data = JSON.parse(rows[0].data);
		
	});
});
// THIEF
new Command('item_steal', function(msg,args) {
	// ARGS :
	//     - Shop Name
	//     - Item ID
});





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