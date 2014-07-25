Map
====

A simple ES6 map implimentation, hopefully performant, mainly for learning purposes.

Currently uses a linked list for storing the values, this is likely either very good or very bad performance wise.

For keys that are comparable by value (e.g. not objects), we use a dictionary to speed up lookup, the results for numbers when adding [10,000 values](http://jsperf.com/maps-and-stuff) and when addding [100 values](http://jsperf.com/maps-and-stuff/2).  In other words there is some overhead but it pays for itself.