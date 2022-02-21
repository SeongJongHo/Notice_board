const Sequelize = require('sequelize');

module.exports = class Like extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                autoIncrement: true,
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            create_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            board_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            }, 
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            }, 
            update_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        },{
            sequelize,
            tableName: 'likes',
            underscored: true,
            timestamps: false,
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            indexes: [
                {
                    unique: true,
                    fields: ['user_id', 'board_id']
                }
            ]
        }
        )
    }
    static associate(db){
        this.belongsTo(db.Board, {foreignKey: "board_id", onDelete: 'cascade', targetKey: 'id'})
        this.belongsTo(db.User, {foreignKey: "user_id", onDelete: 'cascade', targetKey: 'id'})
    }
}