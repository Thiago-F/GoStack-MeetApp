import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
    static init(sequelize) {
        super.init(
            {
                title: Sequelize.STRING,
                desc: Sequelize.STRING,
                locate: Sequelize.STRING,
                date: Sequelize.DATE,
            },
            {
                sequelize,
            }
        );

        // this.addHook('beforeSave');

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' });
    }
}

export default Meetup;
