import User from '../models/User';

class UserController {
    async store(req, res) {
        const { name, email, password } = req.body;

        // Check if user exists
        const checkUserExists = await User.findOne({ where: { email } });
        if (checkUserExists) {
            return res.status(401).json({ error: 'User already exists' });
        }

        // add user to database
        const user = await User.create({ name, email, password });

        return res.json(user);
    }
}

export default new UserController();
