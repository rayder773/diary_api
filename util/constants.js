const generateError = (status, message) => {
  const error = {
    status,
    message,
  };
  return error;
};

module.exports = {
  ERRORS: {
    CREATE_OFFER_ERROR: generateError(500, 'Offer was not created'),
    UPDATE_OFFER_ERROR: generateError(500, 'Offer was not updated'),
    FIND_DOMAIN_ERROR: generateError(400, 'Domain with this name was not found'),
    WRONG_OFFER: generateError(400, 'Wrong offer format'),
    EMAIL_ERROR: generateError(400, 'Email was not sent'),
    SPECIAL_LINK_ERROR: generateError(400, 'Special link was not generated'),
    LINK_FOR_REDIRECT_ERROR: {
      INCORRECT_DATA: generateError(400, 'Incorrect array of links'),
      ADD_TO_ERROR: generateError(400, 'links was not added'),
    },
    GEO_ERROR: generateError(500, 'Cannot get country'),
    INTERNAL_SERVER_ERROR: generateError(500, 'Internal server error'),
  },
  MAILER: {
    ENABLED: {
      NO: false,
      YES: true,
    },
  },
  DB: {
    SYNC_FORCE: {
      NO: false,
      YES: true,
    },
    AUTH: {
      NO: false,
      YES: true,
    },
  },
  DOMAIN_STATUSES: {
    ACTIVE: 0,
    SOLD: 1,
    DISABLED: 2,
  },
  REGEX: {
    URL_REGEX: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    IP_REGEX: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/,
    HTTP_REGEX: /^https?:\/\//,
  },
  URL: {
    MAIN: 'https://www.chinesepod.com/',
  },
  ALLOWED_COUNTRIES: [
    'AT',
    'AU',
    'BE',
    'CH',
    'DE',
    'DK',
    'EE',
    'ES',
    'FR',
    'IT',
    'NZ',
    'RU',
    'UA',
    'UK',
    'US',
    'ZA',
    'TW',
    'PH',
    'SG',
  ],
  LAUNDRY_REGULATION: {
    'acting-account': 'I am acting for my own account',
    'acting-beneficial-buyer': 'I am acting for the following beneficial buyer',
    'acting-buyer-at-point': 'I am acting for a buyer that does not want to be identified at this point',
  },
};
