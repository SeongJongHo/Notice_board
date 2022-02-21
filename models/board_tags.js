const Sequelize = require('sequelize');

module.exports = class BoardTag extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                autoIncrement: true,
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            board_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            tag_id: {
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
            tableName: 'board_tags',
            underscored: true,
            timestamps: false,
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            indexes: [
                {
                    unique: true,
                    fields: ['tag_id', 'board_id']
                }
            ]
            
        }
        )
    }
    static associate(db){
        this.belongsTo(db.Board, {foreignKey: "board_id", onDelete: 'cascade', targetKey: 'id'})
        this.belongsTo(db.Tag, {foreignKey: "tag_id", onDelete: 'cascade', targetKey: 'id'})
    }
}