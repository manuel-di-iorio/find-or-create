/** MONGOOSE FIND OR CREATE (WITH OPTIONAL UPSERT) SCHEMA PLUGIN
 *
 * @author: Manuel Di Iorio
 * @license: MIT
 **/

/**
 * @param Object query: The mongoose query to execute on the model
 * @param Object doc: The document to create/update
 * @param {optional} Object options: Contextual options object. Please see README.md for further details
 * @param {Optional} Function callback
 *
 * @return: a Promise when a callback is not found. You can also use the .exec(cb) method like any mongoose query.
 */

module.exports = function(query, doc, options, callback) {
    const self = this;

    if (!callback && options instanceof Function) {
        callback = options;
        options = undefined;
    }

    // When upsert is specified, atomically find and upsert the doc
    const fn = (next) => {
        if (options && options.upsert) {
            // Merge the custom options with the default settings
            options = Object.assign({
                new: true,
                setDefaultsOnInsert: true
            }, options);

            options.passRawResult = true;

            // Execute the atomic query
            self.findOneAndUpdate(query, doc, options, (err, record, raw) => {
                next(err, {
                    doc: record,
                    isNew: !raw.lastErrorObject.updatedExisting
                });
            });

        } else {
            let mongooseQuery;

            // Else, find or create the doc (non-atomically operation)
            if (!options || (options && !options.query)) {
                mongooseQuery = self.findOne(query);
                if (options && options.fields) mongooseQuery.select(options.fields);
             } else {
                mongooseQuery = options.query;
            }

            mongooseQuery.exec((err, current) => {
                if (err) return next(err);

                if (current) {
                    return next(null, {
                        doc: current,
                        isNew: false
                    });
                }

                return self.create(doc, (err, record) => {
                    next(err, {
                        doc: record,
                        isNew: true
                    });
                });
            });
        }
    };

    // Execute the query and call the callback, eventually returning a promise
    if (callback) return fn(callback);

    const promise = new Promise((resolve, reject) => {
        fn((err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });

    promise.exec = fn;

    return promise;
};
