// Wraps async functions for error handling
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
