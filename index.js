const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42yqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("iaDB").collection("users");
    const contactsCollection = client.db("iaDB").collection("contacts");
    const erasmusExchangesCollection = client.db("iaDB").collection("erasmusExchanges");
    const programsAndExchangesCollection = client.db("iaDB").collection("programsAndExchanges");

    // GET ALL USERS
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // REGISTER A NEW USER
    app.post("/users", async (req, res) => {
      const { name, email, role, phone } = req.body;

      // check if the user exist or not
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.send({ message: "User Already exists", insertedId: null });
      }

      // insert new user
      const newUser = { name, email };
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // GET ALL CONTACTS
    app.get("/contacts", async (req, res) => {
      const result = await contactsCollection.find().toArray();
      res.send(result);
    });

    // GET ALL ERASMUS EXCHANGES
    // app.get("/erasmus-exchanges", async (req, res) => {
    //   const result = await erasmusExchangesCollection.find().toArray();
    //   res.send(result);
    // });

    // GET ALL PROGRAMS AND EXCHANGES EXCHANGES
    app.get("/programs-exchanges", async (req, res) => {
      const result = await programsAndExchangesCollection.find().toArray();
      res.send(result);
    });

    // GET SINGLE ERASMUS EXCHANGE BY ID
    // app.get("/erasmus-exchanges/:id", async (req, res) => {
    //   const id = req.params.id;
    //   try {
    //     const query = { _id: new ObjectId(id) };
    //     const result = await erasmusExchangesCollection.findOne(query);
    //     if (result) {
    //       res.send(result);
    //     } else {
    //       res.status(404).send({ message: "Erasmus exchange not found" });
    //     }
    //   } catch (error) {
    //     res.status(500).send({ message: "Error fetching data", error });
    //   }
    // });

    // GET SPECIFIC TYPE PROGRAMS
    app.get("/programs-exchanges/:programType", async (req, res) => {
      const programType = req.params.programType;
      try {
        const result = await programsAndExchangesCollection
          .find({ programType })
          .toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server error", error });
      }
    });

    // GET SINGLE PROGRAM AND EXCHANGE BY ID
    app.get("/programs-exchanges/:programType/:id", async (req, res) => {
      const { programType, id } = req.params;
      try {
        const query = {
          _id: new ObjectId(id),
          programType: programType,
        };
        const result = await programsAndExchangesCollection.findOne(query);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Program not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Error fetching data", error });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("International Affairs is Waiting");
});

app.listen(port, () => {
  console.log(`IA is Waiting on port ${port}`);
});
