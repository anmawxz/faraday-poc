const express = require('express');
const { exec } = require('child_process');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const app = express();

// ==========================================
// (Gitleaks & Semgrep)
// ==========================================
const AWS_SECRET_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE/FAKEKEY/TESTING998877"; 
const GENERIC_PASSWORD = "super_secret_password_12345!";
const STRIPE_API_KEY = "sk_live_51NxFj2HREmZ7X8K9V01234567890abcdef";

// ==========================================
// (Semgrep)
// ==========================================

// Command Injection (RCE)
app.get('/ping', (req, res) => {
    const ip = req.query.ip;
    // O Semgrep
    exec(`ping -c 1 ${ip}`, (err, stdout, stderr) => {
        res.send(`<pre>${stdout}</pre>`);
    });
});

// SQL Injection
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const connection = mysql.createConnection({ host: 'localhost', user: 'root', database: 'test' });
    
    
    const query = `SELECT * FROM users WHERE id = '${userId}'`;
    connection.query(query, (err, results) => {
        res.json(results);
    });
});

// Cross-Site Scripting (XSS) + Bad JWT Practice
app.get('/dashboard', (req, res) => {
    const user = req.query.user;
    
    
    const token = jwt.sign({ user: user }, 'secret_key_hardcoded', { algorithm: 'HS256' });
    
    // XSS
    res.send(`
        <h1>Bem-vindo ao Dashboard</h1>
        <p>Usuário logado: ${user}</p>
        <small>Token da sessão: ${token}</small>
    `);
});

app.listen(3000, () => console.log('Server running on port 3000'));
