const express = require('express');
const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
    res.json({ status: "ok", message: "Smoke test SE Track passed!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});