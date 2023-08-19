---
date: 2020-03-26
tags: awk,unix,data-processing
title: Using AWK To Process Huge CSV Files
abstract: AWK is a tool, which, when told so, works as a lightweight CSV processor.
---

## Problem

I had 38 separate `.csv` files each consisted of at least 40K lines of data. Overall there were ≥ 2.6 million rows of information. The problem was that the data was not in the ideal form.

Each file had 5 columns. One of the columns was called _birthday_. It had a conventional(at least for the most of the world) format: `DD/MM/YYYY`. However I was going to put this data in a DB(more on that later!) and I needed to have 3 separate properties(i.e. `{ day: DD, month: MM, year: YYYY }`). Also there were some columns that were not useful so I had to get rid of them. In addition, I also wanted to reduce the number of files to one.

## Approach

I know some python and from a couple of data science courses I was introduced to [Pandas](https://pandas.pydata.org/), a well-known tool for data analysis built on top of python. It had a straightforward way of reading, manipulating, and writing csv files. I was going to use that, but didn't really want to download this tool to use only one of the features and never use it again. So I choose something that comes with nearly all modern unix-like systems. [AWK](https://en.wikipedia.org/wiki/AWK) is _designed_ for text processing and much like other programs in the unix-like world it does one thing well and produces fascinating results in regards to simplicity and performance when composed with other unix tools.

## Solution

Now we need to make AWK process `.csv` files.
AWK uses _field separators_ to split an input into fields. It may either be a character or a RegExp.
So all we need to do to make AWK become a `.csv` processor is to set FS(field separator) to be `","`.

We can achieve this using AWK's [Startup and Cleanup Actions](https://www.gnu.org/software/gawk/manual/html_node/Using-BEGIN_002fEND.html#Using-BEGIN_002fEND).

```awk
# clean_csv.awk

BEGIN {
  FS = ","
}
{
  print $1
}
END {
}
```

Then if we pass an input such as `one, two, three` to the script, it will print `one`:

```sh
$ echo "one, two, three" | awk -f csv.awk

one
```

Now that we have this, we can finally solve our problems: splitting `DD/MM/YYYY` column into three separate columns and removing the useless column.
AWK has a `split` function that takes a field, a new variable, and a separator and puts the separated values into the new variable.

The birthday column was #3 so to create the separate fields we need to make the following modifications:

```awk
# clean_csv.awk


BEGIN {
  FS = ","
}
{
  # split DD/MM/YYY into an array of values
  split($4, dob, "/")

  # turn these values into separate columns
  total = dob[1] "," dob[2] "," dob[3]

  # finalize the row, omitting the useless #4 column.
  row = $1 "," $2 "," total "," $5

  print row
}
END {
}
```

This mainly solves most of our problems, except for the first row of the input. `.csv` files have headers as a set of labels on the first row, thus we need to skip every first line of every `.csv` file.

In AWK `NR` and `FNR` represent the record number. The latter shows the record number of the current file, while the first holds the total count. Since we are going to use this script on more then one file, we'll stick with `FNR`.

So the final script looks like so:

```awk
# clean_csv.awk

BEGIN {
  FS = ","

  # create a new header with correct labels
  print "last_name,first_name,birth_day,birth_month,birth_year,country"
}
{
  if (FNR > 1) { # omit every first line
    # split DD/MM/YYY into an array of values
    split($4, dob, "/")

    # turn these values into separate columns
    total = dob[1] "," dob[2] "," dob[3]

    # finalize the row, omitting the useless #4 column.
    row = $1 "," $2 "," total "," $5

    print row
  }
}
END {
}
```

At last, to execute this on our 38 `.csv` files we need to run this command:

```sh
awk -f clean_csv *.csv > clean.csv
```

## Conclusion

We read and manipulated over 30 `.csv` files with more than 2.6 million rows of data combined and reduced them into a single clean file without installing any software. So if you're faced with a problem, you may not need to install a bloated software to solve it when the solution comes pre-installed with your system.
