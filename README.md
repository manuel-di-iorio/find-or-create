# Mongoose FindOrCreate()
Extend the mongoose schemas with a findOrCreate() plugin. Essentialy, if a document is not found, it will create or even update it (based on your settings)

###Install it with:
  
    npm i --save find-or-create
    or
    git clone https://github.com/manuel-di-iorio/find-or-create.git

### Example:

```javascript
yourSchema.statics.findOrCreate = require("find-or-create");
YourModel = mongoose.model("yourSchema", yourSchema);
YourModel.findOrCreate({_id: myID}, {apples: 2}, (err, doc, isNew) => {
    if (err) return console.error(err);
    console.log(doc);
});
```

## API:

```javascript
.findOrCreate(query, doc, options, callback);
```
**doc** is the document that will be inserted, if the document based on your **query** is not found, otherwise the document will be updated with the new document.

**options** can have right now only the 'update' property which accepts a boolean value - by default, it is **falsy**.
