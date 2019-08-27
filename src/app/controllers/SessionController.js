import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const validation = Yup.object().shape({
            email: Yup.email().required(),
            password: Yup.string().required(),
        });

        if (!(await validation.isValid())) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { email, password } = req.body;

        // checando se o usuario existe
        const user = User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // verificar senha
        if (!(await user.checkPassword(password))) {
            // senha incorreta
            return res.status(403).json({ error: 'Password is not invalid' });
        }

        const { id, name } = user;

        // retornando o usuario da sessão e o token gerado
        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
