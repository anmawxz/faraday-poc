const express = require('express');
const app = express();

// 1. Falha de Hardcoded Secret (Gitleaks vai pegar)
const AWS_SECRET_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE/FAKEKEY/TESTING"; 

app.get('/search', (req, res) => {
    const query = req.query.q;
    
    // 2. Falha clássica de segurança / Possível XSS ou Injeção (Semgrep vai alertar)
    res.send("<h1>Resultado da busca para: " + query + "</h1>"); 
});

app.listen(3000, () => console.log('Server running on port 3000'));
