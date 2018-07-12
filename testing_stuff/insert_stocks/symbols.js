const XLSX = require('xlsx');
const fs = require('fs');
var CsvReadableStream = require('csv-reader');

const knex = require('knex')({
  client: 'postgresql',
  connection: {
      database: "stockeeper",
      user: "nerdyckc",
      password: "password"
  }
});

// hkex_url = 'http://www.hkex.com.hk/eng/services/trading/securities/securitieslists/ListOfSecurities.xlsx';
// let hkex = XLSX.readFile('ListOfSecurities.xlsx');

/* 
const sheet_name_list = hkex.SheetNames;
console.log(sheet_name_list);
hkex_csv = XLSX.utils.sheet_to_csv(hkex.Sheets[sheet_name_list[0]]);
console.log(hkex_csv);
 */

// fs.writeFile(__dirname + '/hkex.csv', hkex_csv, (err) => {
//   if (err) throw err;
//   console.log('The file has been saved!');
// });

// https://stackoverflow.com/questions/40630606/how-to-read-only-column-a-value-from-excel-using-nodejs

/* 
var inputStream = fs.createReadStream('hkex.csv', 'utf8');
inputStream
    .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
        console.log(row);
    })
    .on('end', function (data) {
        console.log('No more rows!');
    });
 */

const csv=require('csvtojson');
const csvFilePath= (__dirname + '/hkex.csv');

(async () => {

  const jsonArray = await csv().fromFile(csvFilePath);
  console.log(jsonArray.length);
  // console.log(jsonArray);

  // await knex('assets').insert(jsonArray);

  var testsql = await knex('assets');
  console.log(testsql);

})();
