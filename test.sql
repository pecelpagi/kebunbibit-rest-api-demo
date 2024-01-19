ALTER TABLE ShippingAddresses
ADD COLUMN created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE ShippingAddresses
ADD COLUMN updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE Orders
ADD CONSTRAINT order_number_unique UNIQUE (order_number);

DROP TABLE PostalCodes;

ALTER TABLE Orders
    ADD CONSTRAINT fk_orders_customers
        FOREIGN KEY (customer_id) REFERENCES Customers (id);

ALTER TABLE Wishlists
    ADD CONSTRAINT fk_wishlists_products
        FOREIGN KEY (product_id) REFERENCES Products (id);

ALTER TABLE Wishlists DROP FOREIGN KEY fk_wishlist_customers;
ALTER TABLE Wishlists DROP FOREIGN KEY fk_wishlists_customers;
ALTER TABLE Wishlists DROP FOREIGN KEY fk_wishlists_products;

ALTER TABLE Wishlists DROP CONSTRAINT `fk_wishlist_customers` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`id`);

INSERT INTO Wishlists (customer_id, product_id)
VALUES (1, 472);

ALTER TABLE Wishlists ADD PRIMARY KEY (customer_id, product_id)

ALTER TABLE Wishlists DROP FOREIGN KEY fk_wishlists_products;
ALTER TABLE Wishlists DROP UNIQUE KEY unique_wishlist;

SELECT f.*, p.id AS product_id FROM Files f LEFT JOIN Products p ON p.id = f.id_reference WHERE tablename = 'Products' HAVING product_id IS NULL LIMIT 5;

ALTER TABLE Carts
ADD CONSTRAINT fk_carts_products
FOREIGN KEY (product_id) REFERENCES Products (id);

ALTER TABLE Carts
ADD CONSTRAINT fk_carts_customers
FOREIGN KEY (customer_id) REFERENCES Customers (id);

ALTER TABLE Products
MODIFY COLUMN created_at datetime DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE Products
MODIFY COLUMN updated_at datetime DEFAULT CURRENT_TIMESTAMP;

INSERT INTO Customers (fullname, email, passwd, phone, is_active)
VALUES ('John Doe', 'john@getnada.com', '$2b$10$CG4qfIGf4FiPZrQedqxi4uUhvsIavqXj20bE9kGG1K.Rn0.X0ja4q', '085645123111', 1);

INSERT INTO Products (id_category, name, slug, price, description, is_active)
VALUES (270, 'Test Produk Saja 123', 'test-produk-saja-123', 13500, 'ini deskripsi', 1);

DELETE FROM products WHERE id_category = 270;
DELETE FROM Categories WHERE id = 270;

SELECT * FROM Products ORDER BY created_at DESC LIMIT 3;

ALTER TABLE Products
ADD CONSTRAINT fk_products_categories
FOREIGN KEY (id_category) REFERENCES Categories (id);

ALTER TABLE Customers
ADD CONSTRAINT email_unique UNIQUE (email);

ALTER TABLE Products
ADD CONSTRAINT slug_unique UNIQUE (slug);

SELECT * FROM Products WHERE slug = 'anggur-maroo-sidles';

UPDATE Products SET slug = 'pandanus-2' WHERE id = '5457';

UPDATE Products SET slug = 'anggur-maroo-sidles-2' WHERE id = '12608';

SELECT id, slug FROM Products 
WHERE slug IN (
    SELECT * FROM 
    (
        SELECT p.slug FROM Products p GROUP BY p.slug HAVING COUNT(p.slug) > 1
    ) AS subquery
) ORDER BY slug;

UPDATE Products SET slug = 'dendrobium-sylvanum-2' WHERE id = '8673';
UPDATE Products SET slug = 'dusty-miller-2' WHERE id = '1247';
UPDATE Products SET slug = 'false-ficus-2' WHERE id = '9880';
UPDATE Products SET slug = 'palem-kuning-2' WHERE id = '9922';
UPDATE Products SET slug = 'phalaenopsis-tetraspis-2' WHERE id = '1720';
UPDATE Products SET slug = 'tradescantia-red-2' WHERE id = '9855';

INSERT INTO Categories (name, slug, is_active)
VALUES ('Test Kategori Saja 123', 'test-kategori-saja-123', 1);
