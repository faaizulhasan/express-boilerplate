
module.exports = (sequelize, Sequelize) => {
  const Setting = sequelize.define("settings", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  return Setting;
};
