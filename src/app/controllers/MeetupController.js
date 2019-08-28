import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
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
}

export default new MeetupController();
