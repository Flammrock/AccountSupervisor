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
	  console.log('Mysql: Connected!');
	});
	if (SQL) {
		connection.query(SQL,(err,rows) => {
			if (err) {connection.end();return;};
			fn(err,rows);
		});
	}
	connection.end();
	connection.on('error', function() {connection.end();});
	
}
query();

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



// ADMIN
new Command('ping', function(msg,args) {
	msg.channel.send('pong');
});



// BANK

// ADMIN
new Command('bank_create', function(msg,args) {
	// ARGS :
	//    - Bank Name
	//    - Amount Money On First Registration
});
// ADMIN
new Command('bank_delete', function(msg,args) {
	// ARGS :
	//     - Bank Name
});
// ADMIN
new Command('bank_add_user', function(msg,args) {
	// ARGS :
	//     - Bank Name
	//     - User ID
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



