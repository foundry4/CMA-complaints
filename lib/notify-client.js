const NC = require('notifications-node-client').NotifyClient;

class NotifyConfigError extends Error {}
class NotifySendError extends Error {}

class NotifyClient {

    constructor() {
        try {
            const apiKey = process.env['NOTIFY_API_KEY'];
            const templateId = process.env['NOTIFY_API_TEMPLATE_ID']
            
            if (!templateId || !apiKey)
                throw new NotifyConfigError('GovNotify client requires NOTIFY_API_KEY and NOTIFY_API_TEMPLATE_ID to be set')

            this.NC = new NC(apiKey)
        } catch (error) {
            throw error
        }
    }

    async sendEmail(email, reference, personalisation) {
        try {
            const sendRequest = await this.NC.sendEmail(this.templateId, email, {
                reference,
                personalisation
            });

            if (sendRequest) return sendRequest

            throw new NotifySendError('Gov Notify did not return an reference for sent email')
        } catch (error) {
            console.error(`NotifyClient could not send email`, error);
            throw error;
        }
    }

}

module.exports = {
    NotifyClient, NotifyConfigError, NotifySendError
}