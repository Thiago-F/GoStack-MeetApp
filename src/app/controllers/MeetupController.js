import * as Yup from 'yup';
import {
    startOfHour,
    parseISO,
    isBefore,
    startOfDay,
    endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import Subscription from '../models/Subscription';

class MeetupController {

    async index(req, res) {

        const meetups = await Subscription.findAll({
            where: {
                user_id: req.userId,
                // date: {
                //     [Op.startsWith]: new Date()
                // }
            },
            include: [{
                model: Meetup,
                attributes: ['id', 'title', 'date'],
                where: {
                    date: {
                    }
                }
            }]
        })

        return res.json(meetups)
    }

    // criar listagem de meetups por data
    async list(req, res) {
        const date = parseISO(req.query.date);
        const { page } = req.query;

        const meetups = await Meetup.findAll({
            where: {
                date: {
                    [Op.between]: [startOfDay(date), endOfDay(date)],
                }
            },
            limit: 10,
            offset: (page - 1) * 10,
            attributes: ['id', 'title', 'desc', 'locate', 'date'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: File,
                    as: 'banner',
                    attributes: ['path', 'url']
                },
            ]
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

        const findMeetup = await Meetup.findAll({
            where: { date: hourStart, user_id: req.userId }
        });
        console.log(findMeetup)
        if (findMeetup.length != 0) {
            return res.status(400).json({ error: 'You must have a meetup on this date' })
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

        const meetup = await Meetup.findByPk(req.body.id);
        if (meetup.user_id !== req.userId) {
            return res.status(401).json({
                error: 'You don´t have permissions to delete this meetup, only owners can do'
            })
        }

        await Meetup.destroy({ where: { id: req.body.id, user_id: req.userId } });

        const meetups = await Meetup.findAll({
            where: { user_id: req.userId },
        });

        return res.json(meetups);
    }
}

export default new MeetupController();
