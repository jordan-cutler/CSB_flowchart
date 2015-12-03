$( document ).ready(function() {

	//document.registerElement('x-course');

	$.ajax({
		type: "GET",
		url: 'data.json',
		dataType:'json',    
		}).done(function ( data ) {
		$.each( data.courses, function(i, course) {
			addCourse(course);
		});	
		init();
	});
	
	function addCourse(course){
		var id = course.course.id;
		var name = course.course.name;
		var x = course.course.x;
		var y = course.course.y;
		var prereqs = course.course.prereqs;
		var link = course.course.link;
		var title = course.course.title;
		var credits = course.course.credits;
		var desc = course.course.desc;
		var tags = course.course.tags;
		tags = tags[0] + " " + tags[1];
		
		$("#course-container").append("<x-course id =" + id + ">" + course.course.name + "</x-course>");
		$("#" + id).attr("name", name);
		$("#" + id).attr("x", x);
		$("#" + id).attr("y", y);
		$("#" + id).attr("prereqs", prereqs);
		$("#" + id).attr("title", title);
		$("#" + id).attr("link", link);
		$("#" + id).attr("credits", credits);
		$("#" + id).attr("des", desc);
		$("#" + id).attr("class", tags);
		$("#" + id).css("left", x + "%");
		$("#" + id).css("top", y + "%");
		
	}
	
	function init(){
		
		$.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
		};
		
		function completeCourse(id){
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
		
		function boldPrereqs(prereq){
			var prereqs = prereq.split(",");
			var courses = $( "x-course" ).get();
			$.each(prereqs, function(i, req){

				$.each(courses, function(j,course){
					$("#" + req).addClass("bold-course");
					if (course.id == req){
						var prereqs = $("#" + course.id).attr("prereqs");
						boldPrereqs(prereqs);
					}
				});
			});
		}
		
		function checkAvailable(){
			var courses = $( "x-course" ).get();
			$("x-course").removeClass("unavailable");
			for (i = 0; i < courses.length; i++){
				var prereq = courses[i].getAttribute("prereqs");
				var prereqs = prereq.split(",");
				$.each(prereqs, function(j, req){
					if(!$("#" + req).hasClass("completed") && req != ""){
						$("#" + courses[i].id).addClass("unavailable");
						$("#" + courses[i].id).removeClass("completed");
						
					}
				});
			}	
		
	}
		checkAvailable();
		$("x-course").disableSelection();
		$(".button").disableSelection();
		$("x-course").click(function (e) {
		
			if($("#" + this.id).hasClass("completed"))
				$("#" + this.id).removeClass("completed");
			else{
				completeCourse("#" + this.id);
			}
			checkAvailable();
		});	
		
		$("#spring-button").click(function(e){
			var courses = $( "x-course" ).get();
			$( "x-course" ).removeClass("wrong-season");
			for (i = 0; i < courses.length; i++){
				if ($("#" + courses[i].id).hasClass("season-fall"))
					$("#" + courses[i].id).addClass("wrong-season");
			}
		});
		
		$("#fall-button").click(function(e){
			var courses = $( "x-course" ).get();
			$( "x-course" ).removeClass("wrong-season");
			for (i = 0; i < courses.length; i++){
				if ($("#" + courses[i].id).hasClass("season-spring"))
					$("#" + courses[i].id).addClass("wrong-season");
			}
		});
		$("#both-button").click(function(e){
			$( "x-course" ).removeClass("wrong-season");
		});
		
		$("#reset-button").click(function(e){
			$("x-course").removeClass("unavailable");
			$("x-course").removeClass("completed");
			$("x-course").removeClass("wrong-season");
			checkAvailable();
		});
		
		
		$( "x-course" ).hoverIntent(
		  function() {	
			console.log($("#" + this.id).attr("prereqs"));
			var title = $("#" + this.id).attr("title");
			$("#info-title").html("<h2>" + title + "</h2>");
			
			var des = $("#" + this.id).attr("des");
			var link = $("#" + this.id).attr("link");
			var prereqs = $("#" + this.id).attr("prereqs");
			var credits = $("#" + this.id).attr("credits");
			$("#desc-area").html("<p>" + des + "</p>");
			$("#desc-area").append("<a href =" + link + ">Course Link </a>");
			$("#desc-area").append("<p><b>Credits: </b>" + credits + "</p>");
			
			boldPrereqs(prereqs);
			
			$;
		  }, function() {
			$("x-course").removeClass("bold-course");
		  });
		
	}
});
