# Higher School Certificate all rounders data

In the Australian state of New South Wales, final year school students study for their Higher School Certificate (HSC). The examining body publishes an annual "all-round achievers list" of high-achieving students.

For the sake of teaching an introduction to SQL and using JSON APIs, this repository compiles public information about 23991 students who made the lists between 2001 and 2021 in a single SQLite database with these fields:

* Year
* First name
* Last name
* Gender (Only "M" and "F" values are present here, which is frustrating.)
* School

Data is sourced from:

* 2021-2018 — [HSC All-round Achievers](https://educationstandards.nsw.edu.au/wps/portal/nesa/about/events/merit-lists/all-round-achievers)
* 2017-2001 — [HSC All Rounders Lists](https://www.boardofstudies.nsw.edu.au/bos_stats/hsc-allrounders.html)

## Process

Install Node, [Datasette](https://github.com/simonw/datasette) and [Datasette publish Vercel](https://github.com/simonw/datasette-publish-vercel) to follow this process.

1. Download CSV files from source links into `original_csv` folder
2. Copy those files into `labelled_csv` folder and manually standard the filenames to have only the year
3. The first line of the CSV which contains column names omits the school name heading for most years before 2010. Manually fix, by updating the first row of the CSV to `First name/s,Family name,Gender,School Name` for files where values are note quoted and `"First name/s","Family name","Gender","School Name"` for files where they are
4. Run `node createDb`. This creates `data.db`, an SQLite database with a single `student` table

I used Datasette to preview and share the data, raising the default returned row limit of 1000 to 4000 for convenience.

To preview locally, run:

```sh
datasette data.db --setting max_returned_rows 4000
```

To deploy to Vercel and share, run:

```sh
datasette publish vercel data.db --project=YOUR_PROJECT_NAME --setting max_returned_rows 4000
```

## Sample SQL queries

Count by year:

```sql
SELECT year, count(*) FROM student
GROUP BY year
ORDER BY year;
```

School totals per year:

```sql
SELECT school, count(school) AS total FROM student
WHERE year = 2012
GROUP BY school
ORDER BY total DESC;
```

All time school totals:

```sql
SELECT school, count(*) AS total FROM student
GROUP BY school
ORDER BY total DESC;
```

Gender by year:

```sql
SELECT year, gender, count(*) FROM student
GROUP BY gender, year;
```