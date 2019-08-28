module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('register-meetup', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                unique: true,
            },
            meetup_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
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
        return queryInterface.dropTable('register-meetup');
    },
};
