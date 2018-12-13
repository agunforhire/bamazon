DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
USE bamazon;

CREATE TABLE trove (
 id INT AUTO_INCREMENT NOT NULL,
 product_name VARCHAR(75) NOT NULL,
 department_name VARCHAR(30) NOT NULL,
 price DECIMAL(10,2) NOT NULL,
 stock_ea INT(10) NOT NULL,
 PRIMARY KEY (id)
);

INSERT INTO trove (product_name,department_name,price,stock_ea)
VALUES ("Vorpal Blade","Weapons",999.99,3),
       ("Ars Goetia: First Edition","Books", 1499.99,10),
       ("A hut on hens legs", "Transportation", 4999.99, 2),
       ("Bootleg Ice Cream", "Food & Drink", 99.99, 199),
       ("Abandoned Clown Shoe", "Clothing", 24.99, 99),
       ("Snips, Snails, and Puppydog Tails", "Sundries", 0.99, 999),
       ("Sugar, Spice, and Everything Nice", "Sundries", 0.99, 999),
       ("The Lesser Key of Solomon", "Books", 199.99, 20),
       ("A Flying Carpet", "Transportation", 1999.99, 5),
       ("A Black Lotus", "Sundries", 49999, 1),
       ("A Living Gingerbread Man", "Food & Drink", 29.99, 499),
       ("The Spice Melange", "Food & Drink", 9999.99, 15 ),
       ("The BFG 9000", "Weapons", 4999.99, 10);

    
SELECT * FROM bamazon.trove;