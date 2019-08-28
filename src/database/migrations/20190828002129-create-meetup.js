module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('meetups', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                unique: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            desc: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            locate: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            date: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: queryInterface => {
        return queryInterface.dropTable('meetups');
    },
};
