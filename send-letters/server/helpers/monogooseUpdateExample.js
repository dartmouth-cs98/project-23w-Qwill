
// Note: must use await key word and import the collection
await collection.updateMany(
    {}, 
    {
        '$set': {'newField': value}
    }
);