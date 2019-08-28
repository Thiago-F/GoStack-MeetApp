import { isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import RegisterMeetup from '../models/RegisterMeetup';

class RegisterMeetupController {
    async store(req, res) {
        // criação de registro
        const { meetup_id } = req.body;

        const meetup = await Meetup.findByPk(meetup_id);

        // verificar se o meetup já aconteceu
        if (isBefore(meetup.date, new Date())) {
            // se entrar aqui a data do meetup já passou
            return res.status(400).json({ error: 'Meetup is not available' });
        }

        // verificando se o usuario já não tem outro meetup no mesmo horario

        /* *
         * filtrando os meetups que o usuario participa e
         * verificando se algum tem data igual ao meetup que o usuario quer se inscrever
         * */
        const meetupList = await RegisterMeetup.findAll({
            where: { user_id: req.userId },
        });

        meetupList.filter(mt => {
            return mt.date === meetup.date;
        });

        if (meetupList) {
            return res.status(400).json({
                error: 'Register failed: You must have a meetup on this hour',
            });
        }

        /**
         * Verificando se ele já está registrado no meetup
         */

        const meetupExists = await RegisterMeetup.findOne({
            where: { meetup_id },
        });

        if (meetupExists) {
            return res
                .status(400)
                .json({ error: 'You must registrated on this meetup' });
        }

        /**
         * - Ele não pode se inscrever em meetups que já passaram
         * - Ele não pode se inscrever em 2 meetups no mesmo horario
         * - Ele não pode se inscrever 2 vezes no mesmo meetup
         */

        await RegisterMeetup.create({ meetup_id, user_id: req.userId });

        // enviar email ao organizador nesse momento

        return res.json({ success: 'Register successfully created' });
    }
}

export default new RegisterMeetupController();
