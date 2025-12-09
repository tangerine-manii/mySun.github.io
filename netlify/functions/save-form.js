const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);

    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const collection = client.db("mydb").collection("form_data");

    await collection.insertOne({
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
