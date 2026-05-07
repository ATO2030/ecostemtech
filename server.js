const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission (simulated)
app.use(express.json());
app.post('/api/contact', (req, res) => {
    console.log('Contact form submission:', req.body);
    res.json({ success: true, message: 'Message received!' });
});

app.listen(PORT, () => {
    console.log(`EcoStemTech server running at http://localhost:${PORT}`);
});
