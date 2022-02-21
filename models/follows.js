const Sequelize = require('sequelize');

module.exports = class Follow extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                autoIncrement: true,
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            followee_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            }, 
            follower_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
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
            tableName: 'follows',
            underscored: true,
            timestamps: false,
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            indexes: [
                {
                    unique: true,
                    fields: ['follower_id', 'followee_id']
                }
            ]
        }
        )
    }
    static associate(db){
        this.belongsTo(db.User, {foreignKey: "follower_id", onDelete: 'cascade', targetKey: 'id'})
        this.belongsTo(db.User, {foreignKey: "followee_id", onDelete: 'cascade', targetKey: 'id'})
    }
}