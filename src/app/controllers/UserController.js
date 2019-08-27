import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    async store(req, res) {
        // validação
        const validation = Yup.object().shape({
            name: Yup.string()
                .required()
                .min(6)
                .max(255),
            email: Yup.email().required(),
            password: Yup.string()
                .required()
                .min(6)
                .max(255),
        });

        if (!(await validation.isValid())) {
            return res.status(400).json({ error: 'Validation fails' });
        }

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
