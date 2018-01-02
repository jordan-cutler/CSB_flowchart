$( document ).ready(function() {

	var masterCourseList = new Array();
	var masterAPList = new Array();

	/* Uses AJAX. if you want to edit the code, FYI run on firefox or edge because chrome doesn't allow AJAX to run locally. */
	$.ajax({
		type: "GET", url: 'data.json', dataType:'json'}).done(function (data) {
		$.each( data.courses, function(i, course) {
			masterCourseList.push(new Course(course));
		});
		$.each( data.apInformation, function(i, apInfo) {
			masterAPList.push(new Placement(apInfo));
		});
		init();
	});
	
	/* Creates course objects. */
	function Course(course){
			this.id = course.course.id;
			this.depts = course.course.depts;
			this.courseNo = course.course.course;
			this.name = course.course.name;
			this.x = course.course.x;
			this.y = course.course.y;
			this.prereqs = course.course.prereqs;
			this.link = course.course.link;
			this.title = course.course.title;
			this.credits = course.course.credits;
			this.desc = course.course.desc;
			this.tags = course.course.tags;
			this.tags = this.tags[0] + " " + this.tags[1];
			this.threshold = course.course.threshold;
		if (course.course.view == true) { /* Boxes only actually appear if view is set to true in the database. */
			$("#course-container").append("<x-course id =" + this.id + ">" + this.depts + " " + this.courseNo + "</x-course>");
			$("#" + this.id).attr("name", this.depts + "<br/>" + this.courseNo);
			$("#" + this.id).attr("nameR", this.name);
			$("#" + this.id).attr("x", this.x);
			$("#" + this.id).attr("y", this.y);
			$("#" + this.id).attr("prereqs", this.prereqs);
			$("#" + this.id).attr("title", this.title);
			$("#" + this.id).attr("link", this.link);
			$("#" + this.id).attr("credits", this.credits);
			$("#" + this.id).attr("des", this.desc);
			$("#" + this.id).attr("class", this.tags);
			$("#" + this.id).css("left", this.x + "%");
			$("#" + this.id).css("top", this.y + "%");
		}	
	}

	/* Creates an AP object. */
	function Placement(apInfo){
			this.id = apInfo.apInfo.id;
			this.type = apInfo.apInfotype;
			this.name = apInfo.apInfo.name;
			this.options = apInfo.apInfo.options;
			this.placementCourses = apInfo.apInfo.placementCourses;
			this.value = apInfo.apInfo.value;
			this.desc = apInfo.apInfo.desc;
	}
	
	function init(){
		
		/* This is needed for startup, no idea what it actually does but don't touch it probably. */
		$.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
		};

		/* The merge sort  and merge functios are used for alphabetically sorting the class listings. I modified some code I got off
		   of this one blog for this one so all credit to http://www.stoimen.com/blog/2010/07/02/friday-algorithms-javascript-merge-sort/
		   You just need to pass the array of courses to it and it will sort them first by department (ACCT, BUS, CSE) alphabetically
		   and then it'll sort by ascending numerical class order within that department. */
		function mergeSort(arr)
		{
		    if (arr.length < 2)
		        return arr;
		 
		    var middle = parseInt(arr.length / 2);
		    var left   = arr.slice(0, middle);
		    var right  = arr.slice(middle, arr.length);
		 
		    return merge(mergeSort(left), mergeSort(right));
		}
		 
		function merge(left, right)
		{
		    var result = [];
		 
		    while (left.length && right.length) {
		        if (left[0].depts < right[0].depts) {
		            result.push(left.shift());
		        } else if (left[0].depts == right[0].depts) {
		        	if (left[0].courseNo <= right[0].courseNo) {
		        		result.push(left.shift());
		        	} else {
		        		result.push(right.shift());
		        	}
		        } else {
		            result.push(right.shift());
		        }
		    }
		 
		    while (left.length)
		        result.push(left.shift());
		 
		    while (right.length)
		        result.push(right.shift());
		 
		    return result;
		}

		// Organizes the list
		masterCourseList = mergeSort(masterCourseList);


		/* If you complete a course, it also completes the prereqs. */
		function completeCourse (id) {
			$(id).addClass("completed");
			$(id).removeClass("unavailable");
			checkPrereqs($(""+id).attr("prereqs"));
		}
		
		
		/* This function repeatedly checks the prereqs for a given course. */
		function checkPrereqs(prereq){
			var prereqs = prereq.split(",");
			var courses = $( "x-course" ).get();
			$.each(prereqs, function(i, req){

				$.each(courses, function(j,course){
					if (course.id == req)
						completeCourse("#" + req);
				});
			});
		}
		
		/** This function highlights the prerequisites of a course when called. */
		function boldPrereqs(prereq){
			var prereqs = prereq.split(",");
			var courses = $( "x-course" ).get();
			$.each(prereqs, function(i, req) {
				$.each(courses, function(j,course){
					$("#" + req).addClass("bold-course");
					if (course.id == req){
						var prereqs = $("#" + course.id).attr("prereqs");
						boldPrereqs(prereqs);
					}
				});
			});
		}
		
		var completed = false; //For the CSE 198/140 thing

		/* Checks if the course is available. The CSE 198/140/261 thing with having OR based prereqs is really complicated
		   and tbh im not exactly sure how it works (i just tried like a 1000 things and got lucky lol) so try to stay away from the OR based thing if you can.*/
		function checkAvailable(){
			var courses = $( "x-course" ).get();
			$("x-course").removeClass("unavailable");
			for (i = 0; i < courses.length; i++){
				var prereq = courses[i].getAttribute("prereqs");
				var prereqs = prereq.split(",");
				$.each(prereqs, function(j, req){
					if (!$("#" + req).hasClass("completed") && req != "") {
						$("#" + courses[i].id).addClass("unavailable");
						$("#" + courses[i].id).removeClass("completed");
						if (courses[i].id === "cse140" && req === 'cse001cse002' && ($('#math021').hasClass('completed') && ($('#cse001').hasClass('completed') || $('#cse002').hasClass('completed')))) {
							// should be available
							$("#" + courses[i].id).removeClass("unavailable");
							if (completed && ($('#math021').hasClass('completed') && ($('#cse001').hasClass('completed') || $('#cse002').hasClass('completed')))) {
								$("#" + courses[i].id).addClass("completed");
							} else {
								$("#" + courses[i].id).removeClass("completed");
							}
						}
					}
				});
			}	
		}
		checkAvailable();
		$("x-course").disableSelection();
		$(".button").disableSelection();

		/* Seriously, avoid OR based prereqs as this made this function like 4x longer although im sure theres a better way of doing it. */
		$("x-course").click(function (e) {
			if (this.id == 'cse140') {
				if (completed) {
					completed = false;
				} else {
					completed = true;
				}
			}
			if (this.id =='cse340') {
				completed = true;
			}
			if($("#" + this.id).hasClass("completed"))
				$("#" + this.id).removeClass("completed");
			else{
				if (this.id == 'math021') {
					completed = false;
				} else if (this.id == 'cse001' || this.id == 'cse002') {
					if (!$('#cse001').hasClass('completed') && !$('#cse002').hasClass('completed')) {
						completed = false;
					}
				}
				completeCourse("#" + this.id);
			}
			checkAvailable(); 
		});	
		

		/** This function toggles the visibility of all FALL ONLY classes when
		    the user hovers over that div. */
		$("#fall").hoverIntent(function(){
			var courses = $("x-course").get();
			for (i = 0; i < courses.length; i++) {
				if ($("#" + courses[i].id).hasClass("season-fall")) {
					$("#" + courses[i].id).toggleClass("fall-season");
		    	}
		    }
		});


		/** This function toggles the visibility of all SPRING ONLY classes when
		    the user hovers over that div. */
		$("#spring").hoverIntent(function(){
			var courses = $("x-course").get();
			for (i = 0; i < courses.length; i++) {
				if ($("#" + courses[i].id).hasClass("season-spring")) {
					$("#" + courses[i].id).toggleClass("spring-season");
		    	}
		    }
		});

		/** This function toggles the visibility of all Both Semester classes when
		    the user hovers over that div. */
		$("#both").hoverIntent(function(){
			var courses = $("x-course").get();
			for (i = 0; i < courses.length; i++) {
				if ($("#" + courses[i].id).hasClass("season-both")) {
					$("#" + courses[i].id).toggleClass("both-season");
		    	}
		    }
		});
		
		/** This function clears all completed courses when the user clicks the Reset button. */
		$("#reset").click(function(){
			var classesToRemove = ["unavailable","completed","fall-season","spring-season","both-season"];
			for (var i = 0; i < classesToRemove.length; i++) {
				if ($("x-course").hasClass(classesToRemove[i])) {
					$("x-course").removeClass(classesToRemove[i]);
				}
			}
			for (var t = 0; t < masterAPList.length; t++) {
				document.getElementById(String(t)).value = 0;
			}
			checkAvailable();
		});
		
		/* Toggles between the different sidebar menus. */
		$("#courseListing").click(function(){
			var x = document.getElementById("desc-area");
        	x.style.display = "block";
			var y = document.getElementById("ap");
        	y.style.display = "none";
        	$("#courseListing").addClass("active2");
        	$("#Placement").removeClass("active2");
        	$("#courseListing").removeClass("active3");
        	$("#Placement").addClass("active3");
		});

		/* Toggles between the different sidebar menus. */
		$("#Placement").click(function(){
			var x = document.getElementById("desc-area");
        	x.style.display = "none";
			var y = document.getElementById("ap");
        	y.style.display = "block";
        	$("#courseListing").removeClass("active2");
        	$("#Placement").addClass("active2");
        	$("#courseListing").addClass("active3");
        	$("#Placement").removeClass("active3");
		});

		/* If you hover over a box. */
		$("x-course").hoverIntent(
		  function() {	
			var title = $("#" + this.id).attr("title");
			var name = $("#" + this.id).attr("nameR");
			var credits = $("#" + this.id).attr("credits");			
			var des = $("#" + this.id).attr("des");
			var link = $("#" + this.id).attr("link");
			var prereqs = $("#" + this.id).attr("prereqs");
			boldPrereqs(prereqs);
		  }, 
		  
		  function() {
			$("x-course").removeClass("bold-course");
		});

		/* This does the course description area of the sidebar. */
		$("#desc-area").html();
	    for (var y = 0; y < masterCourseList.length; y++) {
			$("#desc-area").append("<div class='accordion' id='block'>" + masterCourseList[y].name +
			                       "</div><div id='block' class='panel'><b><div id='text_format'>" + masterCourseList[y].title + "</div></b>"
			                       + "Credits: " + masterCourseList[y].credits + "<br/>"
			                       + "<a target='_blank' href='" + masterCourseList[y].link + "'>Department Link</a><br/><hr/><div id='text_format'>"
			                       + masterCourseList[y].desc + "</div>"
			                       + "<p></p></div>");
		}

		/* This does the AP section of the sidebar. */
		var s = "<div id = 'ap-scroll'>";
		$("#ap").html("<tr><td colspan='2' id='f'><div id='ap_button'>Show Courses Skipped</div></td></tr>");
	    for (var y = 0; y < masterAPList.length; y++) {
	    	s = s + "<div id='ap_style' class='ap_style'><section id='why1'>" + masterAPList[y].name + 
	    	    "</section><section id='why2' style='height:100%;'><select align='right' class='selector' id='" + y + "'>";
			for (var x = 0; x < masterAPList[y].options.length; x++) {
				s = s + "<option value='" + x + "'>" + masterAPList[y].options[x] + "</option>";
			}
			s = s + "</select></section></div>";
		}
		s = s + "</div>";
		$("#ap").append(s);

		var acc = document.getElementsByClassName("accordion");
		var i;

		/* Credit to W3 schools for the accordion. https://www.w3schools.com/howto/howto_js_accordion.asp .
		   I just modified it a little bit for toggling the color schemes. */
		for (i = 0; i < acc.length; i++) {
		  acc[i].addEventListener("click", function() {
		    this.classList.toggle("active");
		    var panel = this.nextElementSibling;
		    panel.classList.toggle("active1");
		    if (panel.style.maxHeight){
		      panel.style.maxHeight = null;
		    } else {
		      panel.style.maxHeight = panel.scrollHeight + "px";
		    }
		  });  
		}

		/* This is just an Easter Egg. Click on the title in the top right 50 times for a surprise. */
		var b = 0;
		$("#flow_title1").click(
			function () {
				b += 1;
				if (b >= 50) {
					document.getElementById("flow_title").innerHTML = "Lehigh University <br/>CS🅱 Course Flowchart";
				}
		});


		/** This function shows which courses you've placed out of depending on your inputted AP scores. */
		$("#ap_button").hoverIntent(function(){
			for (i = 0; i < masterCourseList.length; i++) {
				if (masterCourseList[i].threshold > 0) {
					var threshCount = 0;
					var selectedIndex;
					var toBeAdded;
					for (var y = 0; y < masterAPList.length; y++) {
						var s = masterCourseList[i].id;
						for (var q = 0; q <masterAPList[y].placementCourses.length; q++) {
							if (masterAPList[y].placementCourses[q] === s) {
								selectedIndex = document.getElementById(String(y)).value;
								toBeAdded = masterAPList[y].value[selectedIndex];
								threshCount += toBeAdded;
							}
						}
					}
					if (threshCount >= masterCourseList[i].threshold) {
						if ($("#" + masterCourseList[i].id).hasClass("season-both")) {
							$("#" + masterCourseList[i].id).toggleClass("both-season");
		    			} else if ($("#" + masterCourseList[i].id).hasClass("season-spring")) {
							$("#" + masterCourseList[i].id).toggleClass("spring-season");
		    			} else if ($("#" + masterCourseList[i].id).hasClass("season-fall")) {
							$("#" + masterCourseList[i].id).toggleClass("fall-season");
		    			} else if ($("#" + masterCourseList[i].id).hasClass("season-none")) {
							$("#" + masterCourseList[i].id).toggleClass("none-season");
		    			}
					}
				}
			}
		});
	}
});