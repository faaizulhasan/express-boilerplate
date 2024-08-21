
module.exports = (sequelize, Sequelize) => {

    const LookupData = sequelize.define("lookup_data", {
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
        lookup_slug: {
            type: Sequelize.STRING(100),
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            references: {
                model: require("./Lookup")(sequelize, Sequelize),
                key: 'slug'
            }
        },
        title: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        onDelete: 'cascade',
    });

    return LookupData;
}