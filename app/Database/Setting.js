
module.exports = (sequelize, Sequelize) => {
  const Setting = sequelize.define("settings", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING(200),
      allowNull: false,
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
