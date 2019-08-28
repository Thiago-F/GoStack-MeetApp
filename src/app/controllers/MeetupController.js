import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
    async list(req, res) {
        const meetups = await Meetup.findAll({
            where: { user_id: req.userId },
        });

        return res.json(meetups);
    }

    async store(req, res) {
        // validation
        const schema = Yup.object().shape({
            title: Yup.string()
                .min(3)
                .max(255)
                .required(),
            desc: Yup.string()
                .min(3)
                .max(255)
                .required(),
            locate: Yup.string()
                .min(3)
                .max(255)
                .required(),
            // date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }
        // end validation
        const { title, desc, locate, date, banner_id } = req.body;

        const hourStart = startOfHour(parseISO(date));

        // past dates
        if (isBefore(hourStart, new Date())) {
            return res.status(400).json({
                error: 'Error in create Meetup: Past dates are not permitted',
            });
        }

        const meetup = await Meetup.create({
            title,
            desc,
            locate,
            date,
            banner_id,
            user_id: req.userId,
        });

        return res.json(meetup);
    }

    async update(req, res) {
        const { id, title, desc, locate, date, banner_id } = req.body;

        const meetup = await Meetup.findByPk(req.body.id);

        if (!meetup) {
            return res.status(404).json({ error: 'Meetup not found' });
        }

        if (meetup.user_id !== req.userId) {
            return res
                .status(401)
                .json({ error: 'Only owners can update an Meetup' });
        }

        const hourStart = startOfHour(parseISO(req.body.date));
        if (isBefore(hourStart, new Date())) {
            return res.status(400).json({
                error: 'Past dates are not permitted',
            });
        }

        const newMeetup = await meetup.update({
            id,
            title,
            desc,
            locate,
            date,
            banner_id,
            user_id: req.userId,
        });

        return res.json({ newMeetup });
    }

    async delete(req, res) {
        await Meetup.destroy({ where: { id: req.body.id } });

        const meetups = await Meetup.findAll({
            where: { user_id: req.userId },
        });

        return res.json(meetups);
    }
}

export default new MeetupController();
