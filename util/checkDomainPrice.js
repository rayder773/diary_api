const models = require('../db/models');
const {testPrice} = require('../configs').other;

module.exports = async (domain, offer) => {
  let domainRecord;
  const findOptions = {
    where: {
      name: domain,
    },
  };

  try {
    domainRecord = await models.domains.findOne(findOptions);
  } catch (ex) {
    console.error(15, __filename, ex);
    return null;
  }

  const price = (domainRecord && domainRecord.get('price')) || testPrice;

  return {
    isGoodOffer: offer >= price,
    dbPrice: price,
  };
};
