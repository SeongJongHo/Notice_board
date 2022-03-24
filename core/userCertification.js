const db= require('../models');
const jwt = require('jsonwebtoken')
const SECRET_KEY= require('../config/config.js').SECRET_KEY;
const ALGORITHM= require('../config/config.js').ALGORITHM;

module.exports= {
    login_required: async(req, res, next)=>{
        try{
            if(!req.headers.authorization) throw ({message:'KEY_ERROR_AUTHORIZATION', status: 400})

            const payload = {}
            jwt.verify(req.headers.authorization, SECRET_KEY, ALGORITHM,
                (err, decoded)=>{
                    if(err) throw ({message:'JWT_DECODE_ERROR', status: 401})

                    payload.id = decoded.id
                })
            
            await db.User.findOne({where: {id: payload.id}})
                .then(result => {
                    if(result){
                        req.user = result.id
                        next()
                    }
                    else throw ({message:'INVALID_USER', status: 400})
                })
            
        }
        catch(err){
            if(err.name='TokenExpiredError')return res.status(401).json({message: err.message})
            else return res.status(e.status || 400).json({message: err.message})
        }
    },
    refresh_token: async(req, res)=>{
        try{
            if(!req.headers.refresh_token) throw ({message: 'KEY_ERROR_REFRESH_TOKEN', status: 400})

            db.User.findOne({where: {refresh_token: req.headers.refresh_token}})
                .then(result=>{
                    if(result){
                        return res.status(400).json({
                            message: 'SUCCESS',
                            token: jwt.sign({id: user.id }, SECRET_KEY, {algorithm:ALGORITHM})
                        })
                    }
                    else throw ({message: 'LOGIN_PLEASE', status: 400})

                })
        }catch(err){
            return res.status(e.status || 400).json({message: err.message})
        }
    }
}