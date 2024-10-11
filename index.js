const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.5ipn6sc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const InfoCollection = client.db("InvoiceDB").collection("Information");
  try {
    await client.connect();

    app.post("/information", async (req, res) => {
      const info = req.body;
      const result = await InfoCollection.insertOne(info);
      console.log(result);
      res.send(result);
    });

    //  get all information to database

    app.get("/information", async (req, res) => {
      const query = {};
      const result = await InfoCollection.find(query).toArray();
      res.send(result);
    });

    // specefic data load

    app.get("/information/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await InfoCollection.findOne(query);
      res.send(result);
    });

    // delete a info
    app.delete("/information/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await InfoCollection.deleteOne(query);
      res.send(result);
    });

    // update info

    const { ObjectId } = require("mongodb");

    // PUT request to update information based on an ID
    app.put("/information/:id", async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      try {
        const filter = { _id: new ObjectId(id) }; // Filter by the document's ID
        const options = { upsert: false }; // Create the document if it doesn't exist

        const updatedInfo = {
          $set: {
            name: updateInfo.name,
            email: updateInfo.email,
            street1: updateInfo.street1,
            street2: updateInfo.street2,
            // zip: updateInfo.zip,
            phone: updateInfo.phone,
            subject: updateInfo.subject,
            items: updateInfo.items,
            // billName: updateInfo.billName,
            // billEmail: updateInfo.billEmail,
            // billStreet: updateInfo.billStreet,
            // billCity: updateInfo.billCity,
            // billZip: updateInfo.billZip,
            // billPhone: updateInfo.billPhone,
            // billMobile: updateInfo.billMobile,
            // billNumber: updateInfo.billNumber,
            dateStart: updateInfo.dateStart,
            // dueDate: updateInfo.dueDate,
            grandTotal: updateInfo.grandTotal,
          },
        };

        // Assuming you have a MongoDB collection
        const result = await InfoCollection.updateOne(
          filter,
          updatedInfo,
          options
        );

        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Information updated successfully" });
        } else {
          res.status(404).send({ message: "No document found with this ID" });
        }
      } catch (error) {
        res.status(500).send({ message: "Error updating information", error });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("invoice is running");
});

app.listen(port, () => {
  console.log(`invoice is running ${port}`);
});
