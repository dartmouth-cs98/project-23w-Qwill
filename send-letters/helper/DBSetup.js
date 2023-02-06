import Realm from "realm";  // MongoDB realm

const RegistrationSchema = {
    name: "Registration",
    properties: {
      _id: "int",
      username: "string",
      password: "string",
    },
    primaryKey: "_id",
};
  
const realm = await Realm.open({
    path: "realm-files/myrealm",
    schema: [RegistrationSchema],
});
