const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/user', UserController.getUsers);
router.post('/user', UserController.createUser);
router.get('/user/:id', UserController.getOneUser);
router.put('/user', UserController.updateUser);
router.delete('/user/:id', UserController.deleteUser);

module.exports = router;
