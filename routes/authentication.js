const User = require('../models/user');


module.exports = (router) =>{

    router.post('/register',(req, res) => {

        if(!req.body.email){
            res.json({ success: false, message: 'You must provide an e-mail'})
        } else{
            if(!req.body.username){
                res.json({ success: false, message: 'You must provide an Username'})
            }
            else{
                if(!req.body.password){
                    res.json({ success: false, message: 'You must provide a Password'})
                } else{
                    let user = new User({
                        email:  req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    user.save((err) =>{
                        if(err) {
                            if(err.code === 11000)
                                res.json({ success: false, message: 'Username or e-mail already exists'});
                            else{
                                if(err.errors){
                                    if(err.errors.email){    //email錯誤
                                        res.json({ success: false, message: err.errors.email.message });
                                    } else{
                                        if (err.errors.username) {  //帳號錯誤
                                            res.json({ success: false, message: err.errors.username.message }); // Return error
                                        } else{
                                            if (err.errors.password) {
                                                res.json({ success: false, message: err.errors.password.message }); // Return error
                                            } else{
                                                res.json({ success: false, message: err }); // Return any other error not already covered
                                            }
                                        }
                                    }                                        
                                } else{
                                    res.json({ success: false, message: 'Could not save user. Error: ',err });
                                }
                            }
                        } else{
                            res.json({ success: true, message: 'Account registered'});
                        }
                    });
                }
            }
            
        }
    });
    return router;
}