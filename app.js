let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('easy-table');
let chalk = require('chalk');
let keys = require('./keys');
console.log(keys);
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys,
    database: "bamazon"
});
let troveArray = [];

function connectToDB() {
    connection.connect(function(err) {
        if (err) throw err;
		console.log("connected as id " + connection.threadId);
    });
}

function disconnectFromDB() {
	connection.end();
	console.log('Fare thee well!');
}


function displayLoot() {
	connectToDB();
	console.log(chalk.yellowBright.bgCyan.bold('*.*.*.* Welcome to Gilmore\'s Glorious Goods! *.*.*.*'));
    connection.query('SELECT * FROM trove', function(err, res, fields) {  
        if (err) throw err;
		else if (res.length > 0) {
			res.forEach((loot) => troveArray.push(loot) );
			console.log('got items...');
			var lootTable = new Table;
			troveArray.forEach( (product) => {
				lootTable.cell(chalk.cyanBright.bgYellow('Id'), product.id, Table.number(0));
                lootTable.cell(chalk.cyanBright.bgYellow('Description'), chalk.inverse(product.product_name));
                lootTable.cell(chalk.cyanBright.bgYellow('Department'), chalk.bgBlackBright(product.department_name));
                lootTable.cell(chalk.cyanBright.bgYellow('Price - in Gold'), product.price, Table.number(3));
                lootTable.cell(chalk.cyanBright.bgYellow('Stock'), product.stock_ea, Table.number(4));
				lootTable.newRow();
			});
			console.log(lootTable.toString());
			buyProduct();
		}
        else console.log('Oh no!  We\'ve been cleaned out!  Come back again soon.');
	});
	
}

function buyProduct() {
	let idToPurchase, itemToPurchase, maxQuantity, price, quantity;
	inquirer.prompt([{
		name: 'id',
		type: 'input',
		message: chalk.yellow.bgCyan('Please enter the ID of the item you\'d like to procure'),
		validate: (itemId) => {
			return (!isNaN(itemId) && itemId > 0 && itemId <= troveArray.length);
		}
	}]).then( (purchase) => {
		idToPurchase = purchase.id;
		itemToPurchase = troveArray[purchase.id - 1].product_name;
		maxQuantity = parseInt(troveArray[purchase.id - 1].stock_ea);
		price = parseFloat(troveArray[purchase.id - 1].price).toFixed(2);
		inquirer.prompt([{
			name: 'quantity',
			type: 'input',
			message: chalk.cyan.bgYellow('How many would you like? - Available Sotck:', troveArray[purchase.id -1].stock_ea),
			validate: (quantity) => {
				return (!isNaN(quantity) && quantity > 0 && quantity <= maxQuantity);
			}
		}]).then( (purchase) => {
			const salesTotal = parseInt(purchase.quantity) * price;
			quantity = purchase.quantity;
			console.log(`Ok, buying ${quantity} of ${itemToPurchase} for ${salesTotal}.`);
			purchaseItem(idToPurchase, quantity);
		});
	});
}

function purchaseItem(productId, purchaseQuantity) {
	let query = connection.query(
		"UPDATE trove SET ? WHERE ?",
		[{ stock_ea: purchaseQuantity }, { id: productId }],
		function(err, res) {
			console.log(res.affectedRows + " items updated!\n");
		});
	console.log(query.sql);
	disconnectFromDB();
}


displayLoot();
