const db= require('../models')
const board_count= require('../core/boardCount')
module.exports = {
    addBoard: async(req, res)=>{
        const t= await db.sequelize.transaction();
        try{
            if(!req.body.title || !req.body.content) throw new Error('KEYERROR_BOARD_TITLE_AND_CONTENT')

            const board= await db.Board.create({
                title: req.body.title,
                content: req.body.content,
                user_id: req.user
            },
            {transaction: t})
                .catch(()=>{
                throw new Error('NOT_CREATED_BOARD')
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
                        throw new Error('NOT_CREATED_BOARDTAG')
                    })
            }
            t.commit().then(()=>{
                return res.status(201).json({message: 'SUCCESS'})
            });
            
        }
        catch(e){
            await t.rollback()
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
    getBoard: async(req, res)=>{
        try{
            if(!req.params.id||
               !req.query.ip) throw new Error('KEYERROR')
            
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
                throw new Error('BOARD_DB_ERROR')
            })
            

        }catch(e){
            return res.status(400).json({message: e.message})
        }
    }
}