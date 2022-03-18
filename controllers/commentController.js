const db= require('../models')

module.exports= {
    addComment: async(req, res)=>{
        try {
            if(!req.body.content || !req.body.board_id) throw new Error('KEYERROR')

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
                throw new Error("NOT_CREATED")
            })
        }
        catch(e){
            return res.status(400).json({message: e.message})
        }
    },
    getComment: async(req, res)=>{
        try{
            if(!req.params.id) throw new Error('KEYERROR_id')
            
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
                throw new Error('COMMENT_FIND_ERROR')
            })
        }
        catch(e){
            return res.status(400).json({message: e.message})
        }
    }
}