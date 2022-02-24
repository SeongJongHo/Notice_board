const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const db= require('../models');
const SECRET_KEY= require('../config/config.js').SECRET_KEY;
const ALGORITHM= require('../config/config.js').ALGORITHM;
const { validates_email, 
        validates_password, 
        validates_username } = require('../core/validator');
module.exports = {
    signUp: async(req, res)=>{
        try{    
            if(
            !req.body.nickname     ||     
            !req.body.email        ||    
            !req.body.username     ||   
            !req.body.password     ||     
            !req.body.phone_number  
            ) { throw new Error("KEY_ERROR") }

            validates_email(req.body.email)
            validates_password(req.body.password)
            validates_username(req.body.username) 
            
            db.User.create({
                nickname: req.body.nickname,
                email: req.body.email,
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, 12),
                phone_number: req.body.phone_number
            }).then(result=>{
                if(result) res.status(201).json({message: 'CREATED', result: result})
                
            }).catch(err=>{
                if(err) throw new Error("NOT_CREATED")
            })

        }
        catch (e){
            return res.status(400).json({message: e.message})
        }
    },
    signIn: async(req, res)=>{
        try{
            if(!req.body.username || !req.body.password)
                { throw new Error("KEY_ERROR") }

            const user= await db.User.findOne({where: {username: req.body.username}})
            if(!user) throw new Error('INVALID_USERNAME')

            const hashPassword= await bcrypt.compare(req.body.password, user.password)
            if(hashPassword){
                return res.status(400).json({
                    message: 'SUCCESS',
                    token: jwt.sign({id: user.id }, SECRET_KEY, {algorithm:ALGORITHM})
                })
            }
            else{
                throw new Error('INVALID_PASSWORD')
            }
        }
        catch (e){
            return res.status(400).json({message: e.message})
        }
    },
    checkEmail: (req, res)=>{
        try{
            if(!req.body.email) throw new Error('KEYERROR_EMAIL')
            
            db.User.findOne({where: {email: req.body.email}})
                .then(result=> {
                    if(result){
                        throw new Error('EMAIL_EXIST')
                    }
                    else{
                        return res.status(200).json({message: 'EMAIL_NOT_EXIST'})
                    }
                })
                .catch(()=>{
                    return res.status(200).json({message: 'EMAIL_NOT_EXIST'})
                })
        }catch(err){
            return res.status(400).json({message: err.message})
        }
    },
    checkUsername: (req, res)=>{
        try{
            if(!req.body.username) throw new Error('KEYERROR_USERNAME')

            db.User.findOne({where: {username: req.body.username}})
                .then(result=>{
                    if(result){
                        throw new Error('USERNAME_EXIST')
                    }
                    else{
                        return res.status(200).json({message: 'USERNAME_NOT_EXIST'})
                    }
                })
                .catch(()=>{
                    return res.status(200).json({message: 'USERNAME_NOT_EXIST'})
                })
        }catch(err){
            return res.status(400).json({message: err.message})
        }
    },
}