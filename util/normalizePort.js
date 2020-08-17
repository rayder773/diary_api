/**
 * Parse a port value to the correct integer value
 *
 * @param {any} val
 * @returns {number|boolean} **false** if **val** parameter contains wrong value, otherwise - **<number>**
 */
module.exports = val => {
  const port = parseInt(val, 10);

  if (!isNaN(port) && (port >= 80) && (port <= 65535)) {
    return port;
  }

  return false;
};
