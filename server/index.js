require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection Helper
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};

// Middleware to ensure DB connection for API routes
app.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) {
        try {
            await connectDB();
            next();
        } catch (err) {
            return res.status(503).json({
                msg: "Database not connected. Please check your MONGODB_URI and Atlas IP allowlist.",
                error: "DB_CONNECTION_FAILED",
                details: err.message
            });
        }
    } else {
        next();
    }
});

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Expense Tracker API is running" });
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
