import throwDBError from "../../utils/errors/Database.error.js";

const validateSchema = async (db, collection, schema) => {
  try {
    const collections = await db
      .listCollections({ name: collection })
      .toArray();

    if (collections.length === 0) {
      await db.createCollection(collection, {
        validator: schema,
        validationAction: "error",
      });
    } else {
      await db.command({
        collMod: collection,
        validator: schema,
        validationAction: "error",
      });
    }
  } catch (error) {
    console.error(error);

    throwDBError("Something Went Wrong");
  }
};

export default validateSchema;
