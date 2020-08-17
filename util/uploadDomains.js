const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const {DOMAIN_STATUSES} = require('./constants');
const models = require('../db/models');

const getExistingDomainsArray = async () => {
  let queryResult = null;
  const queryOptions = {
    attributes: ['name'],
    raw: true,
  };

  try {
    queryResult = await models.domains.findAll(queryOptions);
  } catch (ex) {
    console.error(__filename, ex);
    throw ex;
  }

  if (!queryResult || !Array.isArray(queryResult)) {
    const message = 'Wrong response after fetching existing domains';
    console.error(__filename, message);
    throw message;
  }

  return queryResult
    .map(r => r.name)
    .filter(r => !!r);
};

const uploadDomains = async () => {
  const pathToCsv = path.resolve(__dirname, '..', '..', 'resources', 'domains.csv');

  if (!fs.existsSync(pathToCsv)) {
    console.error(__filename, `File "${pathToCsv}" doesn't exist`);
    return false;
  }

  let buffer = null;

  try {
    buffer = fs.readFileSync(pathToCsv);
  } catch (ex) {
    console.error(__filename, ex);
    return false;
  }

  let jsonContent = null;
  const csvStr = buffer.toString('utf-8');

  try {
    jsonContent = await csv({
      // noheader: true,
      output: 'csv',
      trim: true,
    }).fromString(csvStr);
  } catch (ex) {
    console.error(__filename, ex);
    return false;
  }

  let domainsArray = [];

  try {
    domainsArray = await getExistingDomainsArray();
  } catch (ex) {
    console.error(__filename, ex);
    return false;
  }

  const recordsToInsert = [];

  for (const idx in jsonContent) {
    const name = jsonContent[idx][0].toLowerCase().trim();
    const price = parseInt(jsonContent[idx][1].replace(/\D/gi, ''));

    if (isNaN(price) || !name) {
      console.error(__filename, 'Wrong record:', jsonContent[idx]);
      continue;
    }

    if (domainsArray.includes(name)) {
      console.info(`- "${name}" already exists in DB, so skipped`);
      continue;
    }

    recordsToInsert.push({
      name,
      price,
      status: DOMAIN_STATUSES.ACTIVE,
    });
  }

  if (recordsToInsert.length) {
    try {
      await models.domains.bulkCreate(recordsToInsert, {
        fields: Object.keys(recordsToInsert[0]),
      });
    } catch (ex) {
      console.error(__filename, ex);
      return false;
    }
  }

  console.log(`Inserted successfully: ${recordsToInsert.length} record (-s)`);

  return true;
};

uploadDomains()
  .then(result => {
    console.log('Done!');
    process.exit(!result ? 1 : 0);
  })
  .catch(ex => {
    console.error(__filename, ex);
    process.exit(1);
  });
