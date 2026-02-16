require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const router = require('./components/routes');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

router(app);

app.listen(3003, () => {
	console.log('running on port 3003');
});
