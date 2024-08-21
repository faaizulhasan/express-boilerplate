
module.exports = (sequelize, Sequelize) => {

    const Lookups = sequelize.define("lookups", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        slug: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },
        title: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        key: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        onDelete: 'cascade',
    });

    return Lookups;
}