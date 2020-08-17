const mailgun = require('mailgun-js');
const {mailer} = require('../configs');
const {LAUNDRY_REGULATION} = require('../util/constants');
let sender = null;

if (mailer.enabled && mailer.apiKey && mailer.domain) {
  sender = mailgun({
    apiKey: mailer.apiKey,
    domain: mailer.domain,
  });
}

const sendEmail = data => new Promise((resolve, reject) => {
  if (!sender) {
    return reject(`Mailer wasn't initialized`);
  }

  sender
    .messages()
    .send(data, (err, body) => {
      if (err) {
        return reject(err);
      }

      resolve(body);
    });
});

module.exports = async (params = {}) => {
  if (!mailer.enabled) {
    return console.warn('Mailer is disabled, no Emails will be sent');
  }

  const {
    domain,
    offer,
    link,
    laundryRegulation,
    beneficialBuyer,
    name,
    company,
  } = params;

  let sendingResponse = null;
  const data = {
    from: 'Robot <info@domainster.com>',
    to: mailer.to,
    subject: `Offer on www.${domain} received - $${offer}`,
    html: `
      <div>
        <p>
          <b>Link:</b> ${link}
        </p>
        <p>
          <b>Laundry regulation:</b> ${LAUNDRY_REGULATION[laundryRegulation] || '-'}
        </p>
        <p>
          <b>Beneficial buyer:</b> ${beneficialBuyer || '-'}
        </p>
        <p>
          <b>Name:</b> ${name}
        </p>
        <p>
          <b>Company:</b> ${company || '-'}
        </p>
      </div>
    `,
  };

  try {
    sendingResponse = await sendEmail(data);
  } catch (err) {
    console.error(err);
  }

  if (!sendingResponse
    || (typeof sendingResponse !== 'object')
    || (typeof sendingResponse.id !== 'string')
    || !sendingResponse.id.length
  ) {
    console.error(__filename, 'Error occurred while sending Email');
    console.error('sendingResponse >>>');
    console.error(sendingResponse);
    console.error('<<< sendingResponse');
  }
};
