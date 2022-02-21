const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                autoIncrement: true,
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            nickname: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            username: {
                type: Sequelize.STRING(200),
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING(250),
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            refresh_token: {
                type: Sequelize.STRING(250),
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
            tableName: 'users',
            underscored: true,
            timestamps: false,
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        }
        )
    }
    static associate(db){
        this.hasMany(db.Board, {foreignKey: "user_id", onDelete: 'cascade', sourceKey: 'id'})
        this.hasMany(db.Like, {foreignKey: "user_id", onDelete: 'cascade', sourceKey: 'id'})
        this.hasMany(db.Follow, {foreignKey: "follower_id", onDelete: 'cascade', sourceKey: 'id'})
        this.hasMany(db.Follow, {foreignKey: "followee_id", onDelete: 'cascade', sourceKey: 'id'})
        this.hasMany(db.Comment, {foreignKey: "user_id", onDelete: 'cascade', sourceKey: 'id'})
    }
}