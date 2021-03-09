require('dotenv').config()
const Airtable = require('airtable');

/**
 * Exports a function that returns a promise
 * Function takes a massive data object
 * Batches the data 10 at a time and asynchronously inserts batches into Airtable
 * Completely universal
 */

// Create base with Airtable credentials
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.TEST_BASE_ID);

const insertRecordBatch = async (batch) => {
  return new Promise( async (resolve, reject) => {
    // output is just for console logging
    const output = [];
    await base('Nominees')
      // Inserts "batch" array of records into the database
      .create(batch, (err, records) => {
        if (err) reject(err)
        else {
          records.forEach(record => {
            output.push(record.fields.Nominee);
          });
          resolve(output);
        };
      });
  });
};

const asyncInsertRecords = async (data) => {
  return new Promise( async (resolve) => {
    // Initialize indicies for loop range
    let start=0, end=10;
    while (start < data.length) {
      // Create batch
      let batch = [];
      for (let i=start; i<end; i++) {
        if (data[i]) batch.push(data[i]);
      };
      // Insert batch into Airtable
      await insertRecordBatch(batch)
        .then(res => console.log(res))
      // Reset for next batch
      batch = [], start+=10, end+=10;
    };
    resolve('done');
  });
};

module.exports = asyncInsertRecords;

