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
                if(result) return res.status(201).json({message: 'CREATED', result: result})
            }).catch(err=>{
                return res.status(400).json({message: err.message})
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
                const refersh_token= jwt.sign({}, SECRET_KEY, {algorithm:ALGORITHM})
                user.refersh_token= refersh_token
                await user.save().then(result=>{
                    if(result){
                        return res.status(400).json({
                            message: 'SUCCESS',
                            token: jwt.sign({id: user.id }, SECRET_KEY, {algorithm:ALGORITHM}),
                            refersh_token: refersh_token
                        })
                    }
                })
            }
            else throw new Error('INVALID_PASSWORD')
            
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
    addFollow: async(req, res)=>{
        try{
            if(!req.body.username) throw new Error('KEYERROR_USERNAME')

            const follwer = await db.User.findOne({where: {username: req.body.username}})
            if(!follwer) throw new Error('INVALID_FOLLWER_USERNAME')

            const follow_status= await db.Follow.findOne({where: {followee_id: follwer.id, follower_id: req.user}})
            if(follow_status){
                follow_status.destroy().then(result=>{
                    if(result) return res.status(200).json({message: 'UNFOLLOW'})
                })
            }
            else{
                db.Follow.create({
                    followee_id: follwer.id,
                    follower_id: req.user
                }).then(result=>{
                    if(result) return res.status(200).json({message: 'FOLLOW'})
                })
            }
        }
        catch(err){
            return res.status(400).json({message: err.message})
        }
    },
    getFollow: (req, res)=>{
        db.Follow.findAll({
            attributes:['id','followee_id','follower_id'],
            include:[{
                model: db.User,
                where: {
                    id: db.Sequelize.literal('followee_id')
                },
            }],
            where: { 
                follower_id: req.user 
            },
        }).then(result=>{
            return res.status(200).json({message: 'SUCCESS', result: result})
        }).catch(err=>{
            return res.status(400).json({message: err.message})
        })
    },
    getFollower: async(req, res)=>{
        const follows= await db.Follow.findAll({
            where: { 
                followee_id: req.user 
            },
            include: {
                where: {
                    id: db.Sequelize.literal('follower_id')
                },
                model: db.User,
                required: false,
                as: 'follower',
                include: {
                    required: false,
                    model: db.Follow,
                    where:{
                        follower_id: req.user,
                        followee_id: db.Sequelize.literal('Follow.follower_id')
                    }
                }
            }
        }).catch(err=>{
            return res.status(400).json({message: err.message})
        })
        return res.status(200).json({
            message: 'SUCCESS',
            result: await follows.map(result=>{
                return {
                    id: result.id,
                    followee_id: result.followee_id,
                    follower_id: result.follower_id,
                    follower_nickname: result.follower.username,
                    follow_status: result.follower.Follows[0]? true:false
                }
            })
        })
    }
}