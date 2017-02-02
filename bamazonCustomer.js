//connection to mysql and inquirer npms
var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
	//test connection
	//console.log("derp");
  if (err) throw err;
  displayProducts();

});

//once connected, display all data for sale
var displayProducts = function() {
  //connect to sql to grab table info
  connection.query('SELECT * from products', function(err, res) {
    //if there's an error, throw error message
    if (err) throw err;
    //once connected, show products 
  var table = new Table({
    head: ['id', 'product_name', 'price']
  });
  var len = res.length;
    for (var i = 0; i < len; i++){
      table.push(
        [(JSON.parse(JSON.stringify(res))[i]['id']),
        (JSON.parse(JSON.stringify(res))[i]['product_name']), 
        (JSON.parse(JSON.stringify(res))[i]['price'])]);
    }
    console.log("\n" + table.toString());
    chooseProduct();
  });
}


//The app should then prompt users with two messages.
//user makes selection
var chooseProduct = function() {
  inquirer.prompt([{
    name: "item", 
    type: "input", 
    message: "Enter the product id of the item you would like to order:"
  }, {
    name: "quantity",
    type: "input", 
    message: "Enter the quantity you'd like to order:", 
    //validates if the value entered is a number
    validate: function(value) {
      if  (isNaN(value) === false) {
        return true; 
      }
      return false;
    }
    //check for quantity
  }]).then(function(answer) {
    //connect to sql to check for quantity
    connection.query("SELECT stock_quantity FROM products WHERE id=?", answer.item, function(err, res) {
      console.log(res);
    } 
)
  })
};
