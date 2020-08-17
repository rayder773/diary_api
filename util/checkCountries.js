const axios = require('axios');
const {getRemoteAddress} = require('../util/common');
const {other} = require('../configs');
const models = require('../db/models');
const {REGEX, ERRORS, URL} = require('./constants')

module.exports = async (req, res, next) => {
  const remoteAddress = getRemoteAddress(req);

  if (remoteAddress === '::1') {
    return next();
  }

  const splitAddress = remoteAddress.split(':');
  const ip = splitAddress[splitAddress.length - 1];

  let country = '';

  try {
    const response = await axios.get(`https://ipapi.co/${ip}/country`);
    country = response.data || response;
  } catch (err) {
    // console.error(err);
    // return res.json(ERRORS.GEO_ERROR);
  }

  if ((typeof country !== 'string') || (country.length !== 2) || other.allowedCountries.includes(country.toUpperCase())) {
    return next();
  }

  let urls = [];

  try {
    urls = await models.linksForRedirects.findAll({
      raw: true
    });
  } catch (err) {
    console.error(err);
    // return res.json(ERRORS.LINK_FOR_REDIRECT_ERROR);
  }

  if(!Array.isArray(urls) || !urls.length) {
    return res.redirect(URL.MAIN);
  }

  let randomUrl = urls[Math.floor(Math.random() * urls.length)].name;

  if (!REGEX.HTTP_REGEX.test(randomUrl)) {
    randomUrl = 'http://' + randomUrl;
  }

  return res.redirect(randomUrl);
};
