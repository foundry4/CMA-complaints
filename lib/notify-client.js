const NC = require('notifications-node-client').NotifyClient;

class NotifyConfigError extends Error {}
class NotifySendError extends Error {}

class NotifyClient {

    
    constructor() {

        try {
            this.apiKey = process.env['NOTIFY_API_KEY'];
            this.templateId = process.env['NOTIFY_API_TEMPLATE_ID']
            
            if (!this.templateId || !this.apiKey)
                throw new NotifyConfigError('GovNotify client requires NOTIFY_API_KEY and NOTIFY_API_TEMPLATE_ID to be set')

            this.NC = new NC(this.apiKey)
        } catch (error) {
            throw error
        }
    }

    async sendEmail(email, reference, personalisation) {
        try {
            //const sendRequest = await this.NC.sendEmail(this.templateId, email, { personalisation: { 'first_name': personalisation, 'ref_number': reference}, reference: reference });
            const sendRequest = await this.NC.sendEmail(this.templateId, email);

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