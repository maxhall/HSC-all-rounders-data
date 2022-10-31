import fs from "fs";
import { parse } from "csv-parse";
import Database from "better-sqlite3";

if (fs.existsSync("./data.db"))
  throw new Error(
    `A database already exists at './data.db' - Remove it please.`
  );

const db = new Database("./data.db");

db.prepare(
  `
    CREATE TABLE student (
        year INTEGER NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        gender TEXT NOT NULL,
        school TEXT NOT NULL
     );
`
).run();

const insertStudent = db.prepare(`
    INSERT INTO student (year, first_name, last_name, gender, school)
    VALUES ($year, $firstName, $lastName, $gender, $school)
`);

const csvFilenames = fs.readdirSync("./labelled_csv");

csvFilenames.forEach((filename) => {
  loadStudentData(`./labelled_csv/${filename}`, filename.split(".")[0]);
});

function loadStudentData(path, year) {
  console.log(`Loading data for ${year}`);
  const data = [];

  fs.createReadStream(path)
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })
    )
    .on("data", function (row) {
      data.push(row);
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      console.log("Parsed csv data.");

      data.forEach((row, i, arr) => {
        // TODO: Wrap this in a transaction to make it fast
        console.log(`${year}: Inserting student ${i + 1} of ${arr.length}`);

        insertStudent.run({
          year,
          firstName: row["First name/s"],
          lastName: row["Family name"],
          gender: row["Gender"],
          school: row["School Name"],
        });
      });
    });
}
