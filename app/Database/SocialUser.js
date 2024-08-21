module.exports = (sequelize, Sequelize) => {

    const SocialUser = sequelize.define("social_user", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        slug: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        platform_type: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        platform_id: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return SocialUser;
}