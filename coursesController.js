$( document ).ready(function() {

	//document.registerElement('x-course');
	var masterCourseList = new Array();
	var masterAPList = new Array();
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
		if (course.course.view == true) {
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

	function getId () {
		return this.id;
	}

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
		
		$.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
		};

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

		masterCourseList = mergeSort(masterCourseList);


		function completeCourse (id) {
			$(id).addClass("completed");
			$(id).removeClass("unavailable");
			checkPrereqs($(""+id).attr("prereqs"));
		}
		
		
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
		
		var q = 0;
		var t;
		var completed = false;

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
							console.log("gets here");
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
		$("x-course").click(function (e) {
			var t = false;

			if (this.id == 'cse140') {
				q += 1;
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

		
		$("x-course").hoverIntent(
		  function() {	
			console.log($("#" + this.id).attr("prereqs"));
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

		var b = 0;
		$("#flow_title1").click(
			function () {
				b += 1;
				if (b >= 50) {
					document.getElementById("flow_title").innerHTML = "Lehigh University <br/>CS🅱 Course Flowchart";
				}
		});

		$("#desc-area").html();
	    for (var y = 0; y < masterCourseList.length; y++) {
			$("#desc-area").append("<div class='accordion' id='block'>" + masterCourseList[y].name +
			                       "</div><div id='block' class='panel'><b><div id='text_format'>" + masterCourseList[y].title + "</div></b>"
			                       + "Credits: " + masterCourseList[y].credits + "<br/>"
			                       + "<a target='_blank' href='" + masterCourseList[y].link + "'>Department Link</a><br/><hr/><div id='text_format'>"
			                       + masterCourseList[y].desc + "</div>"
			                       + "<p></p></div>");
		}

		var s = "<div id = 'ap-scroll'>";
		$("#ap").html("<tr><td colspan='2'><div id='ap_button'>Show Courses Skipped</div></td></tr>");
	    for (var y = 0; y < masterAPList.length; y++) {
	    	s = s + "<div id='ap_style' class='ap_style'><table class='ap_style_table'><tr><th id='p'>" + masterAPList[y].name + 
	    	    "</td><th id='q'><select class='selector' id='" + y + "' align='right'>";
			for (var x = 0; x < masterAPList[y].options.length; x++) {
				s = s + "<option value='" + x + "'>" + masterAPList[y].options[x] + "</option>";
			}
			s = s + "</select></td></tr></table></div>";
		}
		s = s + "</div>";
		$("#ap").append(s);

		var acc = document.getElementsByClassName("accordion");
		var i;

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
								console.log(threshCount);
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