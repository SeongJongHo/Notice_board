const db= require('../models')

module.exports = {
    addBoard: (req, res)=>{
        try{
            if(!req.body.title || !req.body.content) throw new Error('KEYERROR_BOARD_TITLE_AND_CONTENT')
            
            db.Board.create({
                title: req.body.title,
                content: req.body.content,
                user_id: req.user
            }).then(result =>{
                if(result) return res.status(201).json({message: 'SUCCESS', result: result})
            }).catch(()=>{
                return res.status(400).json({message: 'NOT_CREATED'})
            })
        }
        catch(e){
            return res.status(400).json({message: e.message})
        }
    },
    getBoards: (req, res)=>{
        
        db.Board.findAll({
            order:[ [ 'create_at', 'DESC' ] ],
            offset: req.query.offset? req.query.offset:0,
            limit: req.query.limit? req.query.limit:50
        })
            .then(result=>{
                return res.status(200).json({message: 'SUCCESS', result: result})
        })
    },
    getBoard: (req, res)=>{
        try{
            if(!req.params.id) throw new Error('KEYERROR_id')

            db.Board.findOne({
                where:{id: req.params.id},
                attributes: ['title', 'content'],
                include: {
                    model: db.User,
                    attributes: ['nickname', 'username']
                },
                include: {
                    model: db.Comment,
                    where:{
                        board_id: req.params.id,
                        order: [['create_at','desc']],
                        limit: req.query.limit? req.query.limit:50,
                        offset: req.query.offset? req.query.offset:0
                    }
                }
            }).then(result=>{
                    if(result){
                        return res.status(200).json({message: 'SUCCESS', result: result})
                    }
                    return res.status(404).json({message: 'INVALID_BOARD'})
                })
        }catch(e){
            return res.status(400).json({message: e.message})
        }
    }
}