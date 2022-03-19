const db = require('../models');

const ipExist = async(board_id, ip)=>{
    let count = await db.redis.get(`${board_id}`)
    if(!count){
        return false
    }
    count = await JSON.parse(count);

    return count[`${ip}`]? true:false;
}

const addIP = async(board_id, ip)=>{
    let count = await db.redis.get(`${board_id}`)
    if(!count){
        count = {}
        count[`${ip}`] = true
    }
    else{
        count = JSON.parse(count)
        count[`${ip}`] = true
    }

    count = JSON.stringify(count)
    await db.redis.set(`${board_id}`, count)
        .then(()=>{ return })
        .catch(()=>{ throw new Error("REDIS_SAVE_ERROR") })
}

module.exports = { ipExist, addIP }
