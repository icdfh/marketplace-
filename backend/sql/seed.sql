INSERT INTO users (email, password_hash, username, first_name, last_name, user_type)
VALUES
  ('admin@example.com', '$2a$10$nE8T6Qro4f9jI4W2KIiMzOmCQXDpUe1koRaSPo6e7iT730cdpShUM', 'admin', 'Main', 'Admin', 'admin'),
  ('seller1@example.com', '$2a$10$nE8T6Qro4f9jI4W2KIiMzOmCQXDpUe1koRaSPo6e7iT730cdpShUM', 'seller_one', 'Aliya', 'Seller', 'seller'),
  ('buyer1@example.com', '$2a$10$nE8T6Qro4f9jI4W2KIiMzOmCQXDpUe1koRaSPo6e7iT730cdpShUM', 'buyer_one', 'Arman', 'Buyer', 'buyer')
ON CONFLICT (email) DO NOTHING;

INSERT INTO rubrics (name, slug, description)
VALUES
  ('Electronics', 'electronics', 'Phones, tablets, gadgets'),
  ('Fashion', 'fashion', 'Clothes and accessories'),
  ('Home', 'home', 'Furniture and home goods')
ON CONFLICT (slug) DO NOTHING;

WITH seller AS (
  SELECT id FROM users WHERE email = 'seller1@example.com'
), rubric AS (
  SELECT id FROM rubrics WHERE slug = 'electronics'
)
INSERT INTO items (seller_id, rubric_id, title, description, price, images, status)
SELECT seller.id, rubric.id, 'iPhone 13', 'Used, good condition, 128GB', 299999.00, '["https://placehold.co/600x400?text=iPhone+13"]'::jsonb, 'active'
FROM seller, rubric
WHERE NOT EXISTS (SELECT 1 FROM items WHERE title = 'iPhone 13');
