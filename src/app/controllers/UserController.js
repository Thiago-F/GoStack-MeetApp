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
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6)
                .max(255),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        // Check if user exists
        const checkUserExists = await User.findOne({
            where: { email: req.body.email },
        });
        if (checkUserExists) {
            return res.status(401).json({ error: 'User already exists' });
        }

        // add user to database
        const { id, name, email } = await User.create(req.body);

        return res.json({ id, name, email });
    }
}

export default new UserController();
