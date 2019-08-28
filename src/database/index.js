// --Loader dos models-- //
import Sequelize from 'sequelize';

import configDatabase from '../config/database';

// models
import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';

const models = [User, File, Meetup];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(configDatabase);

        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
