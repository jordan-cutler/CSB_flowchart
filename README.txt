January 1st, 2018 (new year, new flowchart woohoo)

Welcome to the CSB Flowchart read me!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

Ok, so there should be a couple files in the directory, and i'll just give a brief synopsis of what they all do
and whenever this needs to be changed in the future, it should be easier.

First things first here are the changes from the old flowchart:
	- Put ECO 045 instead of ECO 045/MATH 231 as it makes the flowchart way easier and visually appealing
		also, did some research and polled 33 CSB students and 32 of them had taken ECO 045 over 231, so i just
		made a note at the bottom and explained the differences in the sidebar
	- Put 241 instead of 241/341, but have a note at the bottom and explain the difference on the sidebar
	- New color scheme, blue is new
		I'd like to thank Jordan Cutler on the color scheme and design choices, the colors i picked while i was making this originally were pretty bad
	- New flowchart layout, tried to make things easier to read
		Added new course names where applicable and new course rules
	- Added sidebar for showing stuff
	- Updated some links, some were outdated
	- Added the AP/SAT/ACT section in the hopes of showing incoming first years how to plan their schedules a little better
	- Added info on substitute courses, and notes on a couple courses

index.html is the file that directly controls the webpage, all data and stuff flows through it
	Very little hardcode apart from the buttons and the legend in the bottom right
	Mostly just setting up tables and registering divs
	Should be pretty self explanatory

style.css makes everything look pretty
	FYI sorry about how messy that code is, but it should be pretty self explanatory if you go into 
	inspect element on the browser

courseController.js
	Ok so this is where the actual interactivity and reading of databases of the flowchart comes into play
	I tried to comment every function, so check the comments for a better understanding of stuff
	It's now object-oriented FYI
	Also please avoid optional prereqs like the CSE001/002 198 thing if you can

background.png is the image with all the black arrows connecting all the courses
	Would need to change if there is a course prereq change and stuff

data.json
	It's the data. In a JSON. who'd've guessed
	Course data
		ID: used for html purposes, just follow the 'math021' type format
		Name: thing you want on the sidebar
		depts: department, ie MATH or CSE
		course: number of the course, ie 101, 201, etc
		x: x position of the floating box, higher it is, more right it is
		y: y position of the floating box, higher it is, more down it is
		prereqs: a list of all the direct prerequisites for a class, so do it like this
			["course1id","course2id","course3id"] or [] if it has no prereqs
		link: just a link to the department's page on the course catalog
		credits: the. number. of. credits.
		desc: a description of the course, sometimes with my own additional comments for CSB specific things, 
			like Lehigh in Prague for 252
		tags: this is a remnant of the old flowchart, but still use it in the same format
			["dept-(INSERT DEPTS HERE)", "season-(FALL, SPRING, BOTH, OR NONE)"]
		view: boolean if you want the thing to be seen on the course part and not just on the right side accordion
		threshold: this int value is used for purposes of placing out of classes, most of the time, you should just need
			-1 if you can't place out of a class or 1 if you can. Gets more complicated for something like ENGL 002 or ECO 001
	AP data
		id: it's an id, don't remember if i actually use this at any point
		type: act, sat, or ap most likely unless there's something else in the future
		desc: currently not doing anything, just if you want to add something with it go fo it
		options: the options in the dropdown of the AP section on the right
		value: the amount each respective option adds to the threshold of placing out of a course
			in general, 0 if it doesn't help or 1 if it does
		placementCourses: the course the AP counts towards

hoverIntent.js
	NO TOUCH
	from MIT i think, it was here before i edited it and it does this cool hover effect thing

jquery.js
	NO TOUCH
	this is the jquery initialization. if you plan on doing a lot of work with jquery, bless you for you are better than i

README.txt
	META