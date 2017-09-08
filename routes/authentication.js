const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
module.exports = (router) =>{

    router.post('/register',(req, res) => {   //user註冊
        console.log("11111111111111111111111111111111");
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
                            console.log("成功");
                            res.json({ success: true, message: 'Account registered'});
                        }
                    });
                }
            }
            
        }
    });

    router.get('/checkEmail/:email', (req, res) => {   //檢查信箱存在
        if(!req.params.email) {
            res.json({ success: false, message: 'E-mail was not provided'});
        } else{
            User.findOne({ email: req.params.email}, (err, email) =>{
                if(err) {
                    res.json({ success: false, message: err});
                } else {
                    if(email) {
                        res.json({ success: false, message: 'E-mail is already taken' });
                    }
                    else{
                        res.json({ success:  true, message: 'E-mail is available' });
                    }
                }
            });
        }
    });
    router.get('/checkUsername/:username', (req, res) => {  //檢查帳號存在
        if(!req.params.username) {
            res.json({ success: false, message: 'Username was not provided'});
        } else{
            User.findOne({ username: req.params.username}, (err, user) =>{
                if(err) {
                    res.json({ success: false, message: err});
                } else {
                    if(user) {
                        res.json({ success: false, message: 'Username is already taken' });
                    }
                    else{
                        res.json({ success:  true, message: 'Username is available' });
                    }
                }
            });
        }
    });

    router.post('/login',( req, res) => {    //登入
        if(!req.body.username) {
            res.json({ success: false, message: 'No username was provided'});
        }
        else {
            if(!req.body.password) {
                res.json({ success: false, message: 'No password was provided'});
            } else {
                User.findOne({ username: req.body.username.toLowerCase() }, (err, user) =>{
                    if(err){
                        res.json({ success: false, message: err });
                    }
                    else {
                        if(!user) {
                            res.json({ success: false, message: 'Username not found. '});
                        }
                        else{
                            const validPassword = user.comparePassword(req.body.password);
                            console.log(validPassword)
                            if(!validPassword) {
                                res.json({ success: false, message: 'Password invalid '});
                            } else {
                                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                                console.log("token",token);
                                res.json({ success: true, message: 'Success', token: token, user: { username: user.username}});
                            }

                        }
                    }
                })
            }
        }
    })

    router.use((req, res, next) =>{
        const token = req.headers['authorization'];
        if(!token) {
            res.json({ success:false, message: 'No token provide'});
        } else {
            jwt.verify(token, config.secret, (err, decode) => {
                if (err) {
                    res.json({ success:false, message: 'Token invalid: ' + err });
                } else {
                    req.decode = decode ;
                    next();
                }
            })
        }
    });
    
    router.get('/profile',( req,res) =>{
        User.findOne({ _id: req.decode.userId }).select('username email').exec((err, user) =>{
            if(err) {
                res.json({ success: false, message: err });
            } else {
                if(!user){
                    res.json({ success: false, message: 'User not found'})
                } else {
                    res.json({ success: true, user: user });
                }
            }
        })
    })
    
    
    return router;
}