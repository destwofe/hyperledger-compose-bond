export const getSafe = (fn) => {
  try {
    return fn()
  } catch (error) {
    return undefined
  }
}