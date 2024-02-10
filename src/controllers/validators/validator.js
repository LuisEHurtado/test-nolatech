const { body } = require("express-validator");
const signinValidator = [
    body('username', 'Debe indicar su usuario').not().isEmpty(),
    body('password', 'Debe indicar su contraseña').not().isEmpty(),
    body('password', 'La longitud mínima de la contraseña es de 6 caracteres.').isLength({min: 6}),
  ];
  
const signupValidator = [
    body('username', 'Debe indicar su usuario').not().isEmpty(),
    body('firstName', 'Debe indicar su primer nombre').not().isEmpty(),
    body('lastName', 'Debe indicar su primer apellido').not().isEmpty(),
    body('email', 'Debe indicar su email').isEmail(),
    body('password', 'Debe indicar la contraseña').not().isEmpty(),
    body('password','La contraseña debe tener al menos 6 digitos').isLength({min: 6}),
    body ('passwordRepeat').trim().custom((value, {req}) => {
      if (value !== req.body.password) {
          throw new Error('Las contraseñanas no coinciden')
      }
      return true; 
  }),

]

const updateUserValidator = [
  body('username', 'Debe indicar su usuario').not().isEmpty(),
  body('firstName', 'Debe indicar su primer nombre').not().isEmpty(),
  body('lastName', 'Debe indicar su primer apellido').not().isEmpty(),
  body('email', 'Debe indicar su email').isEmail(),
]
    
  


module.exports = { signinValidator,signupValidator,updateUserValidator };
