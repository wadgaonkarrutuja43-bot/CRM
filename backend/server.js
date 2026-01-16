const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "System@25", 
    database: "crm_db"
});

db.connect((err) => {
    if (err) console.log("Error connecting to MySQL:", err);
    else console.log("Connected to MySQL database!");
});

// --- HELPER FUNCTION: LOG ACTIVITY ---
const logActivity = (userName, action, details) => {
    const sql = "INSERT INTO activity_logs (user_name, action, details) VALUES (?)";
    const values = [userName || "Unknown", action, details];
    db.query(sql, [values], (err) => {
        if (err) console.error("Logging failed:", err);
    });
};

// ================= AUTH ROUTES =================
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (name, email, password, phone, role) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), saltRounds, (err, hash) => {
        if (err) return res.status(500).json("Error hashing");
        const values = [req.body.name, req.body.email, hash, req.body.phone, req.body.role || 'Staff'];
        db.query(sql, [values], (err, data) => {
            if (err) return res.status(500).json("Error");
            // Log this action
            logActivity(req.body.name, "New User", `User ${req.body.email} joined.`);
            return res.json(data);
        });
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.status(500).json("Error");
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.status(500).json("Error");
                if (response) return res.json(data[0]);
                else return res.status(401).json("Fail");
            });
        } else {
            return res.status(401).json("Fail");
        }
    });
});

// --- NEW: CHANGE PASSWORD ROUTE ---
app.put('/change-password', (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    const sqlSelect = "SELECT password FROM users WHERE email = ?";

    db.query(sqlSelect, [email], (err, data) => {
        if (err || data.length === 0) return res.status(500).json("User not found");

        // 1. Verify Old Password
        bcrypt.compare(oldPassword.toString(), data[0].password, (err, response) => {
            if (err || !response) return res.status(401).json("Current password incorrect");

            // 2. Hash New Password
            bcrypt.hash(newPassword.toString(), saltRounds, (err, hash) => {
                if (err) return res.status(500).json("Error hashing new password");

                // 3. Update Database
                const sqlUpdate = "UPDATE users SET password = ? WHERE email = ?";
                db.query(sqlUpdate, [hash, email], (err, result) => {
                    if (err) return res.status(500).json("Database error");
                    
                    // Log the activity
                    logActivity(email, "Security", "User changed their password");
                    
                    return res.json("Password updated successfully");
                });
            });
        });
    });
});

// ================= LEADS ROUTES (WITH LOGGING) =================

// 1. GET ALL LEADS
app.get('/leads', (req, res) => {
    const sql = "SELECT * FROM leads";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});

// 2. ADD LEAD (Logs Activity)
app.post('/leads', (req, res) => {
    const sql = "INSERT INTO leads (name, email, phone, company, status) VALUES (?)";
    const values = [req.body.name, req.body.email, req.body.phone, req.body.company, req.body.status || "New"];
    
    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        
        // LOG IT!
        logActivity(req.body.user_name, "Created", `Added new lead: ${req.body.name}`);
        
        return res.json("Lead added successfully");
    });
});

// 3. UPDATE LEAD (Logs Activity)
app.put('/leads/:id', (req, res) => {
    const sql = "UPDATE leads SET name = ?, email = ?, phone = ?, company = ?, status = ? WHERE id = ?";
    const values = [req.body.name, req.body.email, req.body.phone, req.body.company, req.body.status, req.params.id];
    
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);

        // LOG IT!
        logActivity(req.body.user_name, "Updated", `Updated lead: ${req.body.name} (${req.body.status})`);

        return res.json("Lead updated successfully");
    });
});

// 4. DELETE LEAD (Logs Activity)
app.delete('/leads/:id', (req, res) => {
    const sql = "DELETE FROM leads WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        
        logActivity("Admin", "Deleted", `Deleted lead ID: ${req.params.id}`);
        
        return res.json("Lead deleted successfully");
    });
});

// ================= DASHBOARD ROUTES =================

app.get('/dashboard-stats', (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS newLeads,
            SUM(CASE WHEN status = 'Converted' THEN 1 ELSE 0 END) AS converted
        FROM leads
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error fetching stats");
        return res.json(data[0]); 
    });
});

// GET ACTIVITY LOGS
app.get('/activity-logs', (req, res) => {
    const sql = "SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 5";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Listening on port 8081...");
});