const passport = require('passport');
const pool = require('../services/database');
const helpers = require('./helpers');
const { validationResult } = require('express-validator');


exports.get_all_users = async  (req, res, next) => {
    try{
        const {page,count}=req.query;
        const offset = (page -1) * count
        const data = await pool.query('SELECT * FROM users limit ? offset ?',[+count,+offset])
        const [totalPageData] = await pool.query('SELECT count(*) as count from users ')
        const totalPage= Math.ceil(+totalPageData[0]?.count)
        res.json({
            data:data,
            pagination:{
                page: +page,
                count: +count,
                totalPage:totalPage
            }
        })
    }catch(error){
        console.log(error)

    }
  };

  
  exports.show_user = async  (req, res, next) => {
    const { id } = req.params;
    let users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return res.status(200).json({ users: users[0] });
  };



exports.user_update = async  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('message', errors.errors[0].msg);
        res.redirect('/profile');
    }else{
        const { id } = req.params;
        const  user  = req.body;
        const userFields = {
            username:user.username,
            first_name:user.firstName,
            last_name:user.lastName,
        };
        // VALIDANDO QUE LA CONTRASEÑA NO ESTE VACIA
        if (user.password !=="") { 
            userFields.password = await helpers.encryptPassword(user.password);
        }
        await pool.query('UPDATE users set ? WHERE id = ?', [userFields, id]);
        req.flash('success', 'Usuario actualizado exitosamente');
        res.redirect('/users'); 
    }

   
   
  };


  exports.user_update_api = async  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ error: errors.errors[0].msg});
    }else{
        const { id } = req.params;
        const  user  = req.body;
        const userFields = {
            username:user.username,
            first_name:user.firstName,
            last_name:user.lastName,
            email:user.email,
        };
        console.log(user.password)
        // VALIDANDO QUE LA CONTRASEÑA NO ESTE VACIA
        if (user.password !==undefined) { 
            userFields.password = await helpers.encryptPassword(user.password);
        }
        await pool.query('UPDATE users set ? WHERE id = ?', [userFields, id]);
        return res.status(200).json({ message: "Usuario actualizado exitosamente" });
    }
   
  };


  exports.user_delete_api = async  (req, res, next) => {
    const { id } = req.params;
    if (!id)   return res.status(500).json({ error: 'Debe indicar el ID del usuario'});
    let sql = "DELETE FROM users WHERE id = ?";
    await pool.query(sql, [id]);
    return res.status(200).json({ message: "Usuario eliminado" });
  };

