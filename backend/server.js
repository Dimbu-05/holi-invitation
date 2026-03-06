require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.resolve(__dirname, "rsvp.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to database", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.run(`CREATE TABLE IF NOT EXISTS rsvps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            guests INTEGER NOT NULL,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error("Error creating table", err.message);
            }
        });
    }
});

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // The app password goes in .env
    }
});

// RSVP Endpoint
app.post("/api/rsvp", (req, res) => {
    const { name, email, guests, message } = req.body;

    if (!name || !email || !guests) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const sql = `INSERT INTO rsvps (name, email, guests, message) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email, guests, message], function (err) {
        if (err) {
            console.error("Database insert error:", err.message);
            return res.status(500).json({ error: "Failed to save RSVP." });
        }

        // Send confirmation email
        const mailOptions = {
            from: "exampleone919@gmail.com",
            to: email,
            subject: "Happy Holi – Invitation Confirmation",
            text: `Dear ${name},

                Thank you for confirming your presence at our Holi Celebration. We are delighted to have you join us along with ${guests} guest(s).

                ${message ? `Important Message: "${message}"

            ` : ''}We look forward to celebrating the vibrant festival of colors with you. Your presence will surely make the event even more joyful and memorable.

                Event Details:
                Date: March 14, 2026
                Time: 10:00 AM onwards
                Venue: Festivity Grounds, Hyderabad

                Wishing you a colorful, joyful, and memorable Holi! 🎨

                Best Regards,  
                Holi Celebration Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                // We don't fail the request since RSVP was saved, but we log the error
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res.status(200).json({ id: this.lastID, message: "RSVP successful. Confirmation email sent!" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
