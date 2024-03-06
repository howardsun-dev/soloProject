// const { Router } = require('express');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.send('Hello world from express!');
});

module.exports = router;
