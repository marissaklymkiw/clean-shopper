-- Add item_type to cart_items to distinguish saved (wishlist) from cart items.
-- Existing rows default to 'saved' to preserve current data.
alter table cart_items
  add column item_type text not null default 'saved'
    check (item_type in ('saved', 'cart'));
