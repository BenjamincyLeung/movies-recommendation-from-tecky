import { Client } from "pg";
import dotenv from "dotenv";

import XLSX from "xlsx";

// dotenv.config({ path: "./.env" });
dotenv.config();

export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
const workbook = XLSX.readFile("Excel_movie_image.xlsx");
const imdbWorkBook = workbook.Sheets["imdb_image"];

async function main() {
  await client.connect();
  const imagesSet: any = XLSX.utils.sheet_to_json(imdbWorkBook);
  for (let column of imagesSet) {
    await client.query(`UPDATE films SET image=${column.image}`);
  }
  await client.end();
}
main();
