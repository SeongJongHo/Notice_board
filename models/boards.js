const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                autoIncrement: true,
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            count: {
                type: Sequelize.BIGINT,
                allowNull: false,
                defaultValue: 0
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false
            }, 
            title: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true
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
            tableName: 'boards',
            underscored: true,
            timestamps: false,
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        }
        )
    }
    static associate(db){
        this.belongsTo(db.User, {foreignKey: "user_id", onDelete: 'cascade', targetKey: 'id'})
        this.hasMany(db.BoardTag, {foreignKey: "board_id", onDelete: 'cascade', sourceKey: 'id'})
        this.hasMany(db.Comment, {foreignKey: "board_id", onDelete: 'cascade', sourceKey: 'id'})
    }
}