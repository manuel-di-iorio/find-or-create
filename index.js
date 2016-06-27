/** MONGOOSE FIND OR CREATE SCHEMA PLUGIN 
 * 
 * @version: 0.1.0
 * @author: Manuel Di Iorio
 * @license: MIT
 **/

var findOrCreate;

findOrCreate = function(query, doc, options, callback) {
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
        setDefaultsOnInsert: true
      };

      self.findOneAndUpdate(query, doc, options, next);
      return;
    }

    return self.findOne(query, function(err, current) {
      if (err) return next(err);
      if (current) return next(null, current);
      return self.create(doc, next);
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
