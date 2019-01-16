module.exports = function debug(...args) {
  const debugMode = process.env.CREPE_DEBUG;

  if (debugMode) {
    console.debug(...args);
  }
};