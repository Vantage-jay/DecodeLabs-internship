const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());

// ===== USERS ENDPOINTS =====

// GET all users
app.get("/users", function(req, res) {
    const users = db.prepare("SELECT * FROM users").all();
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// GET single user
app.get("/users/:id", function(req, res) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    
    res.status(200).json({
        success: true,
        data: user
    });
});

// POST create user
app.post("/users", function(req, res) {
    const { name, email } = req.body;

    if(!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required!"
        });
    }

    if(!email.includes("@")) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email!"
        });
    }

    try {
        const result = db.prepare(
            "INSERT INTO users (name, email) VALUES (?, ?)"
        ).run(name, email);

        const newUser = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    } catch(error) {
        res.status(400).json({
            success: false,
            message: "Email already exists!"
        });
    }
});

// PUT update user
app.put("/users/:id", function(req, res) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);

    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const { name, email } = req.body;
    const newName = name || user.name;
    const newEmail = email || user.email;

    db.prepare(
        "UPDATE users SET name = ?, email = ? WHERE id = ?"
    ).run(newName, newEmail, req.params.id);

    const updatedUser = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
    });
});

// DELETE user
app.delete("/users/:id", function(req, res) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);

    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});

// ===== POSTS ENDPOINTS =====

// GET all posts
app.get("/posts", function(req, res) {
    const posts = db.prepare(`
        SELECT posts.*, users.name as author 
        FROM posts 
        JOIN users ON posts.user_id = users.id
    `).all();

    res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
    });
});

// POST create post
app.post("/posts", function(req, res) {
    const { title, content, user_id } = req.body;

    if(!title || !content || !user_id) {
        return res.status(400).json({
            success: false,
            message: "Title, content and user_id are required!"
        });
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found!"
        });
    }

    const result = db.prepare(
        "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)"
    ).run(title, content, user_id);

    const newPost = db.prepare("SELECT * FROM posts WHERE id = ?").get(result.lastInsertRowid);

    res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: newPost
    });
});

// Handle unknown routes
app.use(function(req, res) {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.listen(PORT, function() {
    console.log("Server running on port " + PORT);
    console.log("Test users at: http://localhost:" + PORT + "/users");
    console.log("Test posts at: http://localhost:" + PORT + "/posts");
});