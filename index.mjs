import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config()
// Replace the uri string with your connection string.
const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;
const uri =
  `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const app = express();
app.use(cors())
app.use(express.json());
app.set('port', process.env.PORT || 3000);

app.post('/findOne', async (req, res) => {
  console.log("beginnign of post request")

  // dataSourceName = req.body.dataSource
  const databaseName = req.body.database
  const collectionName = req.body.collection
  const filterName = req.body.filter
  const projectionName = req.body.projection

  try {
    const database = client.db(databaseName);
    const listings = database.collection(collectionName);
    const query = filterName;
    const projection = projectionName;
    
    const options = {
      projection: projection
    }
    const genericResponse = await listings.findOne(query, options);
    // console.log(genericResponse)
    res.type('json');
    res.status(200);
    res.json(
      genericResponse
    );
  } catch (error) {
    console.log(error)
  } /* finally {
    await client.close();
  } */
});


app.use((req, res) => {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not found');
});
app.listen(app.get('port'), () => {
  console.log('Express started');
});