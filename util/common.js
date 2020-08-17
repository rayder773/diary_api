exports.getLink = (data) => {
  const {
    domain,
    offer,
    email,
    description = '',
  } = data;

  const editedEmail = email.replace('@', '$').replace('.', '!');
  const editedDescription = description ? description.replace(' ', '_') : '';

  return `http://www.${domain}/set/$${offer}/${editedEmail}/${editedDescription}`;
};

exports.getRemoteAddress = (req) => {
  return (req.socket && req.socket.remoteAddress)
    || (req.connection.socket && req.connection.socket.remoteAddress)
    || req.connection.remoteAddress
    || '';
}
