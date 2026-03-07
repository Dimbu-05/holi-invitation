require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 5000;

const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

/* ---------------- DATABASE SETUP ---------------- */

const dbPath = path.resolve(__dirname, "rsvp.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database");

        db.run(
            `CREATE TABLE IF NOT EXISTS rsvps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        guests INTEGER NOT NULL,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
        );
    }
});

/* ---------------- RSVP API ---------------- */

app.post("/api/rsvp", async (req, res) => {
  const { name, email, guests, message } = req.body;

  if (!name || !email || !guests) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "INSERT INTO rsvps (name, email, guests, message) VALUES (?, ?, ?, ?)";

  db.run(sql, [name, email, guests, message], async function (err) {
    if (err) {
      console.error("Database insert error:", err.message);
      return res.status(500).json({ error: "Failed to save RSVP" });
    }

    try {
      // Email to guest
      await resend.emails.send({
        from: "Holi Invitation <onboarding@resend.dev>",
        to: email,
        subject: "Happy Holi – Invitation Confirmation",
        text: `Dear ${name},

Thank you for confirming your presence at our Holi Celebration.
We are delighted to have you join us along with ${guests} guest(s).

${message ? `Important Message: "${message}"\n\n` : ""}

Event Details:
Date: March 14, 2026
Time: 10:00 AM onwards
Venue: Festivity Grounds, Hyderabad

Wishing you a colorful, joyful, and memorable Holi! 🎨

Best Regards,
Holi Celebration Team`,
      });

      // Email to host
      await resend.emails.send({
        from: "Holi Invitation <onboarding@resend.dev>",
        to: process.env.EMAIL_USER,
        subject: "New RSVP Received 🎉",
        text: `New RSVP Received:

Name: ${name}
Email: ${email}
Guests: ${guests}
Message: ${message || "No message"}

Submitted at: ${new Date().toLocaleString()}`,
      });

      console.log("Emails sent successfully");

      res.status(200).json({
        message: "RSVP saved successfully",
        id: this.lastID,
      });

    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        error: "RSVP saved but email failed",
      });
    }
  });
});

/* ---------------- SERVER ---------------- */

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
