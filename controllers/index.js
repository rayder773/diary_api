const models = require('../db/models');
const path = require('path');
const sendMail = require('../util/mailer');
const {getLink} = require('../util/common');
const configs = require('../configs');
const {ERRORS, REGEX} = require('../util/constants');
const db = require('../db');
const {v4: uuidv4} = require('uuid');
const pathToMainHtml = path.join(__dirname, '../', '../', 'client', 'dist', 'index.html');
const checkDomainPrice = require('../util/checkDomainPrice');

exports.check = (req, res) => res.sendStatus(200);

exports.getHome = (req, res) => res.sendFile(pathToMainHtml);

exports.getSecret = (req, res) => res.sendFile(pathToMainHtml);

exports.getSecretList = async (req, res, next) => {
  let linksForRedirectRecords = null;

  try {
    linksForRedirectRecords = await models.linksForRedirects.findAll({
      raw: true,
    });
  } catch (ex) {
    console.error(25, __filename, ex);
  }

  return res.json(linksForRedirectRecords);
};

exports.addLinks = async (req, res, next) => {
  const data = req.body;

  if (!Array.isArray(data) || !data.length) {
    return next(ERRORS.LINK_FOR_REDIRECT_ERROR.INCORRECT_DATA);
  }

  const arr = data
    .map(item => {
      if (!REGEX.URL_REGEX.test(item)) return false;
      return {
        name: item,
      };
    })
    .filter(t => t);

  const t = await db.getConnection().transaction();

  try {
    await models.linksForRedirects.destroy({truncate: true, cascade: false}, {transaction: t});
    await models.linksForRedirects.bulkCreate(arr, {transaction: t});
    await t.commit();
  } catch (ex) {
    await t.rollback();
    console.error(55, __filename, ex);
    return next(ERRORS.LINK_FOR_REDIRECT_ERROR.ADD_TO_ERROR);
  }

  return res.sendStatus(200);
};

exports.sendOffer = async (req, res, next) => {
  const data = req.body;
  const {client_id: clientIdFromCookie = ''} = req.cookies;
  const {testPrice} = configs.other;
  const clientId = uuidv4();

  const {
    offer,
    description = null,
    email,
    name,
    phone = null,
    domain,
    laundryRegulation = null,
    beneficialBuyer = null,
    company = null,
  } = data;

  if (typeof offer !== 'number') {
    return res.json(ERRORS.WRONG_OFFER);
  }

  const offerRecord = await models.offers.findOne({
    where: {
      clientId: clientIdFromCookie,
    },
  });

  const dataToUpsert = {
    offer,
    name,
    email,
    phone: phone || null,
    description: description || null,
    domain,
    laundryRegulation,
    beneficialBuyer: beneficialBuyer || null,
    company: company || null,
  }

  if (!clientIdFromCookie || !offerRecord) {
    try {
      await models.offers.create({
        ...dataToUpsert,
        clientId,
      });
    } catch (ex) {
      console.error(110, __filename, ex);
      return next(ERRORS.CREATE_OFFER_ERROR);
    }
  } else {
    try {
      await models.offers.update({
        ...dataToUpsert,
        updatedAt: +new Date(),
      }, {
        where: {
          clientId: clientIdFromCookie,
        },
      });
    } catch (ex) {
      console.error(124, __filename, ex);
      return next(ERRORS.UPDATE_OFFER_ERROR);
    }
  }

  let domainRecord;

  try {
    domainRecord = await models.domains.findOne({
      where: {
        name: domain,
      },
    });
  } catch (ex) {
    console.error(138, __filename, ex);
    return next(ERRORS.FIND_DOMAIN_ERROR);
  }

  const price = (domainRecord && domainRecord.get('price')) || testPrice;

  if (domain && offer && email && laundryRegulation) {
    try {
      sendMail({
        domain,
        offer,
        link: getLink(data),
        laundryRegulation,
        beneficialBuyer,
        name,
        company,
      });
    } catch (ex) {
      console.error(156, __filename, ex);
    }
  }

  if (!clientIdFromCookie) {
    res.cookie('client_id', clientId, {maxAge: 900000, httpOnly: true});
  }

  return res.json({
    isGoodOffer: offer >= price,
    dbPrice: price
  });
};

exports.checkOffer = async (req, res, next) => {
  const {
    offer,
    domain,
  } = req.body;

  if (typeof offer !== 'number') {
    return next(ERRORS.WRONG_OFFER);
  }

  let result = null;

  try {
    result = await checkDomainPrice(domain, offer);
  } catch (ex) {
    console.error(175, __filename, ex);
    return next(ERRORS.INTERNAL_SERVER_ERROR);
  }

  if (!result) {
    console.error(180, __filename, `Error: Offer wasn't checked`);
    return next(ERRORS.INTERNAL_SERVER_ERROR)
  }

  return res.json(result);
};
