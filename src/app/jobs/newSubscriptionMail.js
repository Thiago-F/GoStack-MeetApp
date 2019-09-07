import Mail from '../../lib/Mail';

class newSubscriptionMail {
    get key() {
        // chave unica
        return 'newSubscriptionMail';
    }

    async handle({ data }) {
        const { user, meetup } = data;

        console.log('a fila executou')

        await Mail.sendMail({
            to: `${meetup.user.name} <${meetup.user.email}>`,
            subject: `Nova inscrição no evento: `,
            template: 'cancellation', // template esperado
            context: {
                // variaveis esperadas nos templates
                name: meetup.user.name, // nome do dono do evento
                meetup: meetup.title,
                user: user.name,
                email: user.email,
            },
        });
    }
}

export default new newSubscriptionMail();
