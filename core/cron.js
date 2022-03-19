const cron = require('node-cron')
const db = require('../models')

 module.exports ={
     boardCountInit : () => {
            console.log('스케줄러 시작')
            cron.schedule('0 0 0 1-31 * *', async () => {
                await db.redis.flushAll().then(()=>{
                    console.log('레디스 데이터 삭제')
                    return
                })
                
         })
     }
 }