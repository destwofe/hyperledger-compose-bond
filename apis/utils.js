module.exports.getSafe = (fn) => {
  try {
    return fn()
  } catch (error) {
    return undefined
  }
}
