<!--Users Table-->
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL CHECK(role IN ('customer','cook','admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<!--Cooks Table-->
CREATE TABLE cooks (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    service_area VARCHAR(100),
    delivery_timings VARCHAR(100),
    approved BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2,1) DEFAULT 0,
    earnings DECIMAL(10,2) DEFAULT 0
);

<!--Menus Table-->
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    cook_id INT REFERENCES cooks(id) ON DELETE CASCADE,
    dish_name VARCHAR(100) NOT NULL,
    meal_type VARCHAR(20) CHECK(meal_type IN ('Veg','Non-Veg')),
    cuisine VARCHAR(50),
    price DECIMAL(10,2),
    availability BOOLEAN DEFAULT TRUE
);

<!--Subscriptions Table-->
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    cook_id INT REFERENCES cooks(id) ON DELETE CASCADE,

    plan_type VARCHAR(20)
    CHECK(plan_type IN ('Daily','Weekly','Monthly')),

    start_date DATE NOT NULL,

    status VARCHAR(20)
    DEFAULT 'Pending'
    CHECK(status IN ('Pending','Accepted','Rejected','Active','Expired')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<!--Orders Table-->
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    cook_id INT REFERENCES cooks(id) ON DELETE CASCADE,

    menu_id INT REFERENCES menus(id) ON DELETE CASCADE,

    quantity INT DEFAULT 1,

    total_price DECIMAL(10,2),

    order_status VARCHAR(20)
    DEFAULT 'Pending'
    CHECK(order_status IN
    ('Pending','Accepted','Preparing','Delivered','Cancelled')),

    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<!--Reviews Table-->
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    cook_id INT REFERENCES cooks(id) ON DELETE CASCADE,

    rating INT CHECK(rating BETWEEN 1 AND 5),

    comment TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<!--Complaints Table-->
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    order_id INT REFERENCES orders(id) ON DELETE CASCADE,

    description TEXT NOT NULL,

    status VARCHAR(20)
    DEFAULT 'Open'
    CHECK(status IN ('Open','In Progress','Resolved')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);