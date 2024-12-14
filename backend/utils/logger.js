const { Axiom } = require('@axiomhq/js');

const DATASET_NAME = process.env.AXIOM_DATASET || 'test-1';

let client;
try {
  client = new Axiom({
    token: process.env.AXIOM_TOKEN,
    orgId: process.env.AXIOM_ORG_ID
  });
} catch (error) {
  console.warn('Axiom client initialization failed:', error.message);
}

// Function to safely log data to Axiom
const safeLog = async (data) => {
  if (!client) return;
  try {
    await client.ingest(DATASET_NAME, data);
    await client.flush();
  } catch (error) {
    console.warn('Axiom logging failed:', error.message);
  }
};

module.exports = { safeLog };