const express = require('express');
const router = express.Router();
const { isLoggedIn,isNotLoggedIn } = require('../middlewares/auth');
const pool = require('../services/database');

const { updateUserValidator } = require("../controllers/validators/validator");
const { validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const helpers = require('../controllers/helpers');

/** RUTAS PARAS LAS VISTAS ***/

router.get('/users', isLoggedIn, async (req, res) => {
    const users = await pool.query('SELECT * FROM users');
    res.render('users', { users });
});

router.get('/users/edit/:id', async (req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.render('users/edit', {user: users[0]});
});

router.get('/users/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE ID = ?', [id]);
    req.flash('success', 'Usuario eliminado exitosamente');
    res.redirect('/users');
});


/*** APIS ***/
//OBTENER TODOS LOS USUARIOS
router.route('/api/v1/users/').get(userController.get_all_users);
//OBTENER TODOS LOS USUARIOS
router.route('/api/v1/users/:id').get(userController.show_user);
  //ACTUALIZAR USUARIO
router.route('/api/v1/users/:id').put(updateUserValidator, userController.user_update_api);
//ACTUALIZAR USUARIO
  router.route('/update_profile/:id').post(updateUserValidator, userController.user_update);
//ELIMINAR
router.route('/api/v1/users/:id').delete(userController.user_delete_api);





module.exports = router;