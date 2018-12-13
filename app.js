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

displayLoot();

function connectToDB() {
    connection.connect(function(err) {
        if (err) throw err;
		console.log("connected as id " + connection.threadId);
    });
}

function disconnectFromDB() {
	connection.end();
	console.log('Goodbye!');
}

function displayLoot() {
	connectToDB();
	console.log('*.*.*.* Welcome to Gilmore\'s Glorious Goods! *.*.*.*');
    connection.query('SELECT * FROM trove', function(err, res, fields) {  
        if (err) throw err;
		else if (res.length > 0) {
			res.forEach((loot) => troveArray.push(loot) );
			console.log('got products...');
			var lootTable = new Table;
			troveArray.forEach( (product) => {
				lootTable.cell('Id', product.id, Table.number(0));
                lootTable.cell('Description', product.product_name);
                lootTable.cell('Department', product.department_name);
                lootTable.cell('Price - in Gold', product.price, Table.number(3));
                lootTable.cell('Stock', product.stock_ea, Table.number(4));
				lootTable.newRow();
			});
			console.log(lootTable.toString());
			buyProduct();
		}
        else console.log('Sold out of all items! Please come back soon.');
	});
	
}

function buyProduct() {
	let idToPurchase, itemToPurchase, maxQuantity, price, quantity;
	inquirer.prompt([{
		name: 'id',
		type: 'input',
		message: 'Which product would you like to buy?',
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
			message: 'How many would you like to buy',
			validate: (quantity) => {
				return (!isNaN(quantity) && quantity > 0 && quantity <= maxQuantity);
			}
		}]).then( (purchase) => {
			const salesTotal = parseInt(purchase.quantity) * price;
			quantity = purchase.quantity;
			console.log(`Ok, purchasing ${quantity} of ${itemToPurchase} for $ ${salesTotal}.`);
			purchaseItem(idToPurchase, quantity);
		});
	});
}

function purchaseItem(productId, purchaseQuantity) {
	let query = connection.query(
		"UPDATE trove SET ? WHERE ?",
		[{ stock_ea: purchaseQuantity }, { id: productId }],
		function(err, res) {
			console.log(res.affectedRows + " products updated!\n");
		});
	console.log(query.sql);
	disconnectFromDB();
}
