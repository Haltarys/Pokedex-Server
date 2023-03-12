exports.default = async (
  /** @type {import('mongodb').Db} */
  db,
) => {
  console.debug(db.databaseName);
  await db.collection('users').find().toArray().then(console.debug);
};
