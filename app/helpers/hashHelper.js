const crypto = require('crypto')

function hash(password, secret) {
  const _secret = secret || process.env.IOT_HASH_SECRET || 'TODO:SET_HASH_SECRET'
  const hash = crypto.createHmac('sha256', _secret).update(password).digest('hex')
  return hash
}
exports.hash = hash
