const cron = require('node-cron')
const db = require('../models')

 module.exports ={
     boardCountInit : () => {
            cron.schedule('0 0 0 1-31 * *', async () => {
                await db.redis.flushAll().then(()=>{
                    return
                })
                
         })
     }
 }