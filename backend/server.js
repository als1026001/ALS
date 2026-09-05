const express = require('express');
const cors = require('cors');

require('dotenv').config();

const menuRoutes = require('./routes/menu.routes');

const app = express();

app.use(cors());
app.use(express.json());

// API menu
app.use('/api/menus', menuRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend đang chạy tại http://localhost:${PORT}`);
});
