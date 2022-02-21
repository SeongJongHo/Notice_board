const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {
  BoardTag  : require('./board_tags'),
  Board     : require('./boards'),
  Comment   : require('./comments'),
  Follow    : require('./follows'),
  Like      : require('./likes'),
  Tag       : require('./tags'),
  User      : require('./users'),
  sequelize : sequelize,
  Sequelize : Sequelize
};

db.BoardTag.init(sequelize)
db.Board.init(sequelize)    
db.Comment.init(sequelize)  
db.Follow.init(sequelize)   
db.Like.init(sequelize)     
db.Tag.init(sequelize)      
db.User.init(sequelize)

db.BoardTag.associate(db)
db.Board.associate(db)   
db.Comment.associate(db) 
db.Follow.associate(db)  
db.Like.associate(db)    
db.Tag.associate(db)     
db.User.associate(db)    

module.exports = db;