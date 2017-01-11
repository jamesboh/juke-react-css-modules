function log(pieces, ...cooked) {
  console.log(interp(pieces, cooked))
}

log.hush = ()=>void 0

log.debug = log.hush
log.error = function(pieces, ...cooked) {
  console.error(interp(pieces, cooked))
}

function interp(pieces, cooked) {
  return pieces.map((p, i) => `${p}${i < cooked.length? cooked[i] : ''}`).join('')
}

module.exports = log
