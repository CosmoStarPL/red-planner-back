const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user/user.controller');
const DescriptionController = require('../controllers/description/desc.controller');

router.get('/user', UserController.getUsers);
router.post('/user/create', UserController.createUser);
router.post('/user/login', UserController.login);
router.get('/user/get', UserController.getOneUser);
router.put('/user', UserController.updateUser);
router.delete('/user/delete', UserController.deleteUser);
router.get('/user/check/auth', UserController.checkToken);
router.get("/logout", UserController.logout);
router.post("/user/desc/create", DescriptionController.createDesc);
router.get("/user/desc", DescriptionController.getDesc);

module.exports = router;
