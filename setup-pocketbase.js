import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import extract from 'extract-zip';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POCKETBASE_VERSION = '0.19.4';
const POCKETBASE_URL = `https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_windows_amd64.zip`;
const POCKETBASE_DIR = path.join(__dirname, 'pocketbase');
const POCKETBASE_ZIP = path.join(__dirname, 'pocketbase.zip');

// Create PocketBase directory if it doesn't exist
if (!fs.existsSync(POCKETBASE_DIR)) {
  fs.mkdirSync(POCKETBASE_DIR, { recursive: true });
}

// Download PocketBase
async function downloadPocketBase() {
  console.log(`Downloading PocketBase v${POCKETBASE_VERSION}...`);
  
  const response = await fetch(POCKETBASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to download PocketBase: ${response.statusText}`);
  }
  
  const fileStream = createWriteStream(POCKETBASE_ZIP);
  await pipeline(response.body, fileStream);
  
  console.log('Download complete. Extracting...');
  
  // Extract the zip file
  await extract(POCKETBASE_ZIP, { dir: POCKETBASE_DIR });
  
  // Remove the zip file
  fs.unlinkSync(POCKETBASE_ZIP);
  
  console.log('Extraction complete.');
}

// Create PocketBase schema
function createPocketBaseSchema() {
  const schemaPath = path.join(POCKETBASE_DIR, 'pb_schema.json');
  
  const schema = {
    "collections": [
      {
        "name": "adventurers",
        "type": "base",
        "schema": [
          {
            "name": "name",
            "type": "text",
            "required": true,
            "unique": true
          },
          {
            "name": "role",
            "type": "text",
            "required": true
          },
          {
            "name": "primary_area_score",
            "type": "number"
          },
          {
            "name": "secondary_area_score",
            "type": "number"
          },
          {
            "name": "primary_score",
            "type": "number"
          },
          {
            "name": "avatarUrl",
            "type": "text"
          },
          {
            "name": "skills",
            "type": "json"
          },
          {
            "name": "lore",
            "type": "text"
          }
        ]
      },
      {
        "name": "activity_logs",
        "type": "base",
        "schema": [
          {
            "name": "timestamp",
            "type": "date",
            "required": true
          },
          {
            "name": "action",
            "type": "text",
            "required": true
          },
          {
            "name": "user",
            "type": "text",
            "required": true
          },
          {
            "name": "ipAddress",
            "type": "text"
          }
        ]
      }
    ]
  };
  
  fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
  console.log('Schema created.');
}

// Run PocketBase
function runPocketBase() {
  console.log('Starting PocketBase...');
  
  const pbExe = path.join(POCKETBASE_DIR, 'pocketbase.exe');
  const pb = exec(`${pbExe} serve --dir=${POCKETBASE_DIR}`);
  
  pb.stdout.on('data', (data) => {
    console.log(`PocketBase: ${data}`);
  });
  
  pb.stderr.on('data', (data) => {
    console.error(`PocketBase Error: ${data}`);
  });
  
  pb.on('close', (code) => {
    console.log(`PocketBase exited with code ${code}`);
  });
}

// Main function
async function main() {
  try {
    await downloadPocketBase();
    createPocketBaseSchema();
    runPocketBase();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();