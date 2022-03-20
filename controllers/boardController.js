const db= require('../models')
const board_count= require('../core/redis')
module.exports = {
    addBoard: async(req, res)=>{
        const t= await db.sequelize.transaction();
        try{
            if(!req.body.title || !req.body.content) throw ({message: 'KEYERROR_BOARD_TITLE_AND_CONTENT', status: 400 })

            const board= await db.Board.create({
                title: req.body.title,
                content: req.body.content,
                user_id: req.user
            },
            {transaction: t})
                .catch(()=>{
                throw({message: 'NOT_CREATED_BOARD', status: 400 })
            })

            if(req.body.tag[0]){
                const tagList= []
                for (i=0;i<req.body.tag.length;i++){
                    await db.Tag.findOrCreate({ 
                        where: {name: req.body.tag[i]},
                        defaults: {name: req.body.tag[i]},
                        transaction: t
                    }).then(([result, created])=>{                        
                        tagList.push(result.id)
                    })
                }
                
                const boardTag= tagList.map(result=>(
                    {
                        board_id: board.id,
                        tag_id: result,
                    }
                ))
                await db.BoardTag.bulkCreate(boardTag,{transaction:t})
                    .catch(()=>{
                        throw({message: 'NOT_CREATED_BOARDTAG', status: 400 })
                    })
            }
            t.commit().then(()=>{
                return res.status(201).json({message: 'SUCCESS'})
            });
            
        }
        catch(e){
            await t.rollback()
            return res.status(e.status || 400).json({message: e.message})
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
    getBoard: async(req, res)=>{
        try{
            if(!req.params.id||
               !req.query.ip) throw({message: 'KEYERROR', status: 400})
            
            const ipcheck = await board_count.ipExist(req.params.id, req.query.ip)   
            await db.Board.findOne({
                where:{id: req.params.id},
                attributes: ['id','title', 'content','count'],
                include: {
                    model: db.User,
                    attributes: ['nickname', 'username']
                }
            }).then(async board=>{
                if(ipcheck==false){
                     board.count += 1;
                     await board.save();
                     await board_count.addIP(req.params.id, req.query.ip)
               }
               return res.status(200).json({message: 'SUCCESS', result: board})
            }).catch(()=>{
                throw({message: 'BOARD_DB_ERROR', status: 400 })
            })
            

        }catch(e){
            return res.status(e.status || 400).json({message: e.message})
        }
    }
}