# Mongoose FindOrCreate()
## Extend the mongoose schemas with a findOrCreate() plugin. Essentially, if a document is not found, will be created or (if specified) atomically updated

### Install it with:

    npm i find-or-create
    or
    git clone https://github.com/manuel-di-iorio/find-or-create.git

### **Examples**:

```javascript
yourSchema.statics.findOrCreate = require("find-or-create");
YourModel = mongoose.model("yourSchema", yourSchema);

YourModel.findOrCreate({_id: myID}, {apples: 2}, (err, result) => {
    if (err) return console.error(err);
    console.log(result.doc); // the document itself
    console.log(result.isNew); // if the document has just been created
});
```

Example using the promise return:

```javascript
Model.findOrCreate({_id: myID}, {apples: 2})
.then((result) => {
    console.log(result.doc);
    console.log(result.isNew);
})
.catch((err) => {
    console.error(err);
});
```


Example upserting the document and using the .exec() method:

```javascript
// The document will be created if not exists or will be updated if already exists
Model.findOrCreate({_id: myID, apples: 2}, {apples: 5}, {upsert: true})
.exec((err, result) => {
    if (err) return console.error(err);
    console.log(result.doc);
    console.log(result.isNew);
});
```


---
## API:

```javascript
MongooseModel.findOrCreate(query, doc, [options, callback]);
```
If you don't specify a callback, it will be returned a promise.

---

**doc** is the document that will be inserted if the document based on your **query** is not found, otherwise the record will be updated with the new document (if upsert is enabled).

**options** is an optional object that will be passed to the underlying mongoose 'find/findOrCreate' method. Remember to set `{upsert: true}` if you want to update the doc when it already exists.

You can find the possible options here:
- **Default (no upsert):**

  Use the `fields` option for the query projection. (Note: this option is only used when a custom query is _not_ provided).
  Example: `{fields: "_id createdAt"}`

  You can also provide your custom query with the `query` option (for example for changing the sorting order, skipping, etc..)


- **With `{upsert: true}`:** http://mongoosejs.com/docs/api.html#query_Query-findOneAndUpdate

  Any option you pass will override the default settings, except _passRawResult_ which is always _true_.


---
## Test with

```bash
npm test
```

---
## License

MIT
