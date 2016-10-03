/** MONGOOSE FIND OR CREATE SCHEMA PLUGIN 
 * 
 * @author: Manuel Di Iorio
 * @license: MIT
 **/

module.exports = function(query, doc, options, callback) {
  var fn, self;

  self = this;
  if (!callback && options && Object.prototype.toString.call(options) === "[object Function]") {
    callback = options;
    options = void 0;
  }

  fn = function(next) {
    if (options && options.update) {
      options = {
        upsert: true,
        "new": true,
        setDefaultsOnInsert: true,
        passRawResult: true
      };

      self.findOneAndUpdate(query, doc, options, function(err, record, res) {
        next(err, record, !res.lastErrorObject.updatedExisting);
      });
      return;
    }

    return self.findOne(query, function(err, current) {
      if (err) return next(err);
      if (current) return next(null, current, false);
      
      return self.create(doc, function(err, record) {
        next(err, record, true);
      });
    });
  };

  if (callback) {
    return fn(callback);
  } else {
    return {
      exec: fn
    };
  }
};
