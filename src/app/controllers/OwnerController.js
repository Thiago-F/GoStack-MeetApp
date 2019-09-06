import Meetup from '../models/Meetup'

class OwnerController {
    async index(req, res) {
        // retorna todos os meetups de um usuario
        const meetups = await Meetup.findAll({
            where: { user_id: req.userId }
        });

        return res.json(meetups);
    }
}

export default new OwnerController();