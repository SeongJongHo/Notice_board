const db= require('../models')

module.exports= {
    addComment: async(req, res)=>{
        try {
            if(!req.body.content || !req.body.board_id) throw({message: 'KEYERROR', status: 400 })

            await db.Comment.create({
                board_id: req.body.board_id,
                user_id: req.user,
                parent_id: req.body.parent_id? req.body.parent_id:null,
                content: req.body.content
            }).then(result=>{
                if(result) return res.status(201).json({
                    message: 'SUCCESS',
                    result: result    
                })
            }).catch(()=>{
                throw({message: 'NOT_CREATED', status: 400 })
            })
        }
        catch(e){
            return res.status(e.status || 400).json({message: e.message})
        }
    },
    getComment: async(req, res)=>{
        try{
            if(!req.params.id) throw({message: 'KEYERROR_id', status: 400 })
            
            await db.Comment.findAndCountAll({
                order: [['create_at','desc']],
                limit: req.query.limit? req.query.limit:100,
                offset: req.query.offset? req.query.offset:0,
            }).then(result=>{
                return res.status(200).json({
                    message: 'SUCCESS',
                    result: result
                })
            }).catch(err=>{
                throw({message: 'COMMENT_FIND_ERROR', status: 400 })
            })
        }
        catch(e){
            return res.status(e.status || 400).json({message: e.message})
        }
    }
}