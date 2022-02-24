const db= require('../models');
const jwt = require('jsonwebtoken')
const SECRET_KEY= require('../config/config.js').SECRET_KEY;
const ALGORITHM= require('../config/config.js').ALGORITHM;

module.exports= {
    login_required: async(req, res, next)=>{
        try{
            if(!req.headers.authorization) throw new Error('KEY_ERROR_AUTHORIZATION')

            const payload = {}
            jwt.verify(req.headers.authorization, SECRET_KEY, ALGORITHM,
                (err, decoded)=>{
                    if(err) throw new Error('JWT_DECODE_ERROR')

                    payload.id = decoded.id
                })
            
            await db.User.findOne({where: {id: payload.id}})
                .then(result => {
                    if(result){
                        req.user = result.id
                        next()
                    }
                    else throw new Error('INVALID_USER')
                })
            
        }
        catch(err){
            if(err.name='TokenExpiredError')return res.status(401).json({message: err.message})
            else return res.status(400).json({message: err.message})
        }
    },
    refresh_token: async(req, res)=>{
        try{
            if(!req.headers.refresh_token) throw new Error('KEY_ERROR_REFRESH_TOKEN')

            db.User.findOne({where: {refresh_token: req.headers.refresh_token}})
                .then(result=>{
                    if(result){
                        return res.status(400).json({
                            message: 'SUCCESS',
                            token: jwt.sign({id: user.id }, SECRET_KEY, {algorithm:ALGORITHM})
                        })
                    }
                    else throw new Error('LOGIN_PLEASE')
                })
                // .catch 안쓴이유 refresh_token 중복값이 있을경우는 아직 더 고민해 봐야함
        }catch(err){
            return res.status(400).json({message: err.message})
        }
    }
    
}