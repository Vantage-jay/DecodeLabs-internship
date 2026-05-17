const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory database
let users = [
    { id: 1, name: "Vantage", email: "vantage@gmail.com" },
    { id: 2, name: "DecodeLabs", email: "decodelabs@gmail.com" }
];

// GET all users
app.get("/users", function(req, res) {
    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        count: users.length,
        data: users
    });
});

// GET single user
app.get("/users/:id", function(req, res) {
    const user = users.find(function(u) {
        return u.id === parseInt(req.params.id);
    });

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

    const newUser = {
        id: users.length + 1,
        name: name,
        email: email
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser
    });
});

// PUT update user
app.put("/users/:id", function(req, res) {
    const user = users.find(function(u) {
        return u.id === parseInt(req.params.id);
    });

    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const { name, email } = req.body;
    if(name) user.name = name;
    if(email) user.email = email;

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});

// DELETE user
app.delete("/users/:id", function(req, res) {
    const index = users.findIndex(function(u) {
        return u.id === parseInt(req.params.id);
    });

    if(index === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    users.splice(index, 1);

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
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
    console.log("Test it at: http://localhost:" + PORT + "/users");
});