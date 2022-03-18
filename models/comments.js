const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                autoIncrement: true,
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            board_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },  
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            parent_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },
            create_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            update_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        },{
            sequelize,
            tableName: 'comments',
            underscored: true,
            timestamps: false,
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        }
        )
    }
    static associate(db){
        this.belongsTo(db.Board, {foreignKey: "board_id", onDelete: 'cascade', targetKey: 'id'})
        this.belongsTo(db.User, {foreignKey: "user_id", onDelete: 'cascade', targetKey: 'id'})
        this.belongsTo(db.Comment, {foreignKey: "parent_id", targetKey: 'id'})
        this.hasMany(db.Comment, {foreignKey: "parent_id", onDelete: 'cascade', sourceKey: 'id'})


    }
}