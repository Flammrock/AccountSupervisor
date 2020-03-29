const Discord = require('discord.js');
const mysql = require("mysql");
const bot = new Discord.Client();
var express = require('express');


const port = process.env.PORT || 80;


const TOKEN = 'NjkzODI1MzM0ODM1MTUwOTE4.XoC3CQ.meL6PnRHcv91pS2xnyRytJ3oiZE';
const DATABASE_URI = 'mysql://bf3a501fa9da19:d1726edb@us-cdbr-iron-east-01.cleardb.net/heroku_bc02ac5f0db76cb?reconnect=true';

const PREFIX = '+';

const DATABASE = {
	host:       'us-cdbr-iron-east-01.cleardb.net',
	user:       'bf3a501fa9da19',
	password:   'd1726edb',
	database:   'heroku_bc02ac5f0db76cb'
};


function query(SQL,fn) {
	
	var connection = mysql.createConnection(DATABASE);
	connection.connect((err) => {
		if (err) {connection.end();return;};
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

/*
connection.query(`CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});*/
/*
connection.query(`CREATE TABLE bank (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  data text,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;`, (err,rows) => {
  if(err) throw err;

  console.log('TABLE CREATED!');
});*/


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



// ADMIN
new Command('ping', function(msg,args) {
	msg.channel.send('pong');
});



// BANK

// ADMIN
new Command('bank_create', function(msg,args) {
	if (args.length < 2) return;
	// ARGS :
	//    - Bank Name
	//    - Amount Money On First Registration
	query('SELECT * FROM bank WHERE name=\''+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length > 0) {
			msg.reply('Sorry, Bank `'+args[0]+'` is already created :cold_sweat:');
			return;
		}
		query('INSERT INTO bank(name,data) VALUES (\''+escape_mysql(args[0])+'\',\''+escape_mysql(args[1])+'\')',function(err,rows){
			msg.reply('Bank `'+args[0]+'` created with success!');
		});
	});
});
// ADMIN
new Command('bank_delete', function(msg,args) {
	if (args.length < 1) return;
	// ARGS :
	//     - Bank Name
	query('SELECT * FROM bank WHERE name=\''+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, Bank `'+args[0]+'` doesn\'t exist :cold_sweat:');
			return;
		}
		query('DELETE FROM bank WHERE name=\''+escape_mysql(args[0])+'\'',function(err,rows){
			msg.reply('Bank `'+args[0]+'` deleted with success!');
		});
	});
});
// ADMIN
new Command('bank_add_user', function(msg,args) {
	if (args.length < 2) return;
	// ARGS :
	//     - Bank Name
	//     - User ID
	var id = args[1].match(/<@(\d+)>/);
	if (id==null) {
		msg.reply('Sorry, User `'+args[1]+'` doesn\'t exist :cold_sweat:\nPlease use the `@` to select a user :smile:');
		return;
	}
	id = id[1];
	query('SELECT * FROM bank WHERE name=\''+escape_mysql(args[0])+'\'',function(err,rows1){
		if (rows1.length==0) {
			msg.reply('Sorry, Bank `'+args[0]+'` doesn\'t exist :cold_sweat:');
			return;
		}
		query('SELECT FROM users WHERE name=\''+escape_mysql(id)+'\'',function(err,rows){
			if (rows.length==0) {
				var obj = {
					bank: {}
				};
				try {
					obj.bank[escape_mysql(args[0])] = parseFloat(JSON.parse(rows1[0].data).moneyOnStart) || 0.0;
				} catch (e) {
					obj.bank[escape_mysql(args[0])] = 0.0;
				}
				query('INSERT INTO user(name,data) VALUES (\''+escape_mysql(id)+'\',\''+escape_mysql(JSON.stringify(obj))+'\')',function(err,rows){
					msg.reply('User `'+args[1]+'` added in `'+args[0]+'` Bank with Success!');
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
				query('UPDATE table_name SET data = \''+escape_mysql(JSON.stringify(obj))+'\' WHERE name=\''+escape_mysql(id)+'\'',function(err,rows){
					msg.reply('User `'+args[1]+'` added in `'+args[0]+'` Bank with Success!');
				});
			}
		});
	});
});
// ADMIN
new Command('bank_remove_user', function(msg,args) {
	// ARGS :
	//     - Bank Name
	//     - User ID
});
// ADMIN
new Command('bank_give_money_user', function(msg,args) {
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
});
// ADMIN
new Command('bank_remove_money_user', function(msg,args) {
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
});
// ADMIN
new Command('bank_set_money_user', function(msg,args) {
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
});
// ADMIN
new Command('bank_get_money_user', function(msg,args) {
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
});

// CITOYEN
new Command('give_money', function(msg,args) {
	// ARGS :
	//     - Bank Name
	//     - User ID
	//     - Amount Money
});
// CITOYEN
new Command('bank_create_account', function(msg,args) {
	// ARGS :
	//     - Bank Name
});
// CITOYEN
new Command('bank_delete_account', function(msg,args) {
	// ARGS :
	//     - Bank Name
});
// CITOYEN
new Command('get_money', function(msg,args) {
	if (args.length < 1) return;
	// ARGS :
	//     - Bank Name
	var f = function(money) {
		msg.reply('You have `'+money+'` Money left in your account bank `'+args[0]+'`');
	}
	query('SELECT * FROM bank WHERE name=\''+escape_mysql(args[0])+'\'',function(err,rows){
		if (rows.length==0) {
			msg.reply('Sorry, Bank `'+args[0]+'` doesn\'t exist :cold_sweat:');
			return;
		}
		query('SELECT FROM users WHERE name=\''+escape_mysql(message.member.user.id+'')+'\'',function(err,rows){
			if (rows.length==0) {
				f(0);
			} else {
				var obj = JSON.parse(rows[0].data);
				obj.bank = obj.bank || {};
				var money = 0.0;
				try {
					if (typeof obj.bank[escape_mysql(args[0])] !== 'undefined') {
						money = parseFloat(obj.bank[escape_mysql(args[0])]) || 0.0;
					}
					obj.bank[escape_mysql(args[0])] = parseFloat(JSON.parse(rows1[0].data).moneyOnStart) || 0.0;
				} catch (e) {}
				f(money);
			}
		});
	});
});



// SHOP

// ADMIN
new Command('shop_create', function(msg,args) {
	// ARGS :
	//    - Shop Name
	//    - Salons Available
	//    - File HTML
});
// ADMIN
new Command('shop_delete', function(msg,args) {
	// ARGS :
	//     - Shop Name
});
// ADMIN
new Command('shop_update_salons', function(msg,args) {
	// ARGS :
	//    - Shop Name
	//    - Salons Available
});
// ADMIN
new Command('shop_update_file', function(msg,args) {
	// ARGS :
	//    - Shop Name
	//    - File HTML
});

// CITOYEN
new Command('item_pay', function(msg,args) {
	// ARGS :
	//     - Shop Name
	//     - Item ID
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
  if (msg.content.substring(0,PREFIX.length)==PREFIX) {
    var data = new ParserCommand(msg.content);
	if (Command.isExist(data.name)) {
		Command.execute(msg,data);
	}
  }
});

bot.login(TOKEN);

//////////////////////////////////////
//          INTERFACE WEB           //
//////////////////////////////////////
var app = express();

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})



