/*global window:false */
/*global YAHOO:false */

// Finds classes that are available now that a given
// course has been taken.
function highlightAvailable() {
	var i, p, j, course, available;
	for (i in window.courses) {
		if (window.courses.hasOwnProperty(i)) {
			course = window.courses[i];
			p = course.prereqs;
			available = true;
			for (j = 0; j < p.length; j += 1) {
				if (p[j].length > 0 && !window.courses[p[j]].taken) {
					available = false;
				}
			}
			if (available) {
				YAHOO.util.Dom.addClass(i, "available");
			} else {
				YAHOO.util.Dom.removeClass(i, "available");
			}
		}
	}
}

// Recursively adds the "taken" tag to the given
// course's prereqs.
function boxPrereqHighlight(course) {
	var p, i;
	course.taken = true;
	if (course.prereqs.length > 0) {
		p = course.prereqs;
		for (i = 0; i < p.length; i += 1) {
			YAHOO.util.Dom.addClass(p[i], "taken");
			boxPrereqHighlight(window.courses[p[i]]);
		}
	}
}
YAHOO.util.Event.onDOMReady(function () {
	var flowchart, callbacks;
	function boxClick(e, course) {
	  if (YAHOO.util.Dom.hasClass(course.id, "taken")) {
			YAHOO.util.Dom.removeClass(course.id, "taken");
		} else {
			YAHOO.util.Dom.addClass(course.id, "taken");
			boxPrereqHighlight(course);
		}
		highlightAvailable();
	}

	function boxMouseOver(e, div, course) {
		var midX, midY, divX, divY, flowchartRegion;
		flowchartRegion = YAHOO.util.Dom.getRegion("flowchart");
		midX = (flowchartRegion.left + flowchartRegion.right)/2;
		midY = flowchartRegion.top * 2 / 5 + flowchartRegion.bottom * 3 / 5;

		YAHOO.util.Dom.setAttribute("tooltip-a", "href", course.link);
		document.getElementById("tooltip-title").innerHTML = course.title;
		document.getElementById("tooltip-desc").innerHTML = course.desc;
		YAHOO.util.Dom.removeClass("tooltip", "hidden");

		divX = YAHOO.util.Dom.getX(div);
		divY = YAHOO.util.Dom.getY(div);
		
		if(divX < midX)
			YAHOO.util.Dom.setX("tooltip", divX + 61 + 10);
		else
			YAHOO.util.Dom.setX("tooltip", divX - 300 - 10);

		if(divY < midY)
			YAHOO.util.Dom.setY("tooltip", YAHOO.util.Dom.getY(div));
		else {
			var tooltipRegion = YAHOO.util.Dom.getRegion("tooltip");
			var tooltipHeight = tooltipRegion.top - tooltipRegion.bottom;
			YAHOO.util.Dom.setY("tooltip", YAHOO.util.Dom.getY(div) + tooltipHeight);
		}
	}

	function boxMouseOut(e, course) {
		YAHOO.util.Dom.addClass("tooltip", "hidden");
	}
			
	flowchart = document.getElementById("flowchart");

	callbacks = {
		success: function (o) {
			var courses, course, box, i;
			try {
				courses = YAHOO.lang.JSON.parse(o.responseText);
			} catch (x) {
				alert("Error loading data, JSON parse failed");
				return;
			}
			window.courses = courses;
			
			for (course in courses) {
				if (courses.hasOwnProperty(course)) {
					box = document.createElement("div");
					box.className = "course " + courses[course].tags.join(" ");
					box.innerHTML = courses[course].name;
					box.style.left = flowchart.offsetLeft + 15 + courses[course].x * 62.6 + "px";
					box.style.top = flowchart.offsetTop + 638 - courses[course].y * 62.6 + "px";
					box.id = courses[course].id;
					window.courses[box.id].taken = false;
					flowchart.appendChild(box);
					YAHOO.util.Event.addListener(box, "click", boxClick, courses[course]);
					YAHOO.util.Event.addListener(box, "mouseenter", boxMouseOver, courses[course]);
					YAHOO.util.Event.addListener(box, "mouseleave", boxMouseOut, courses[course]);
				}
			}
			highlightAvailable();
		}
	};

	YAHOO.util.Connect.asyncRequest('GET', 'data.json', callbacks);
	highlightAvailable();

	var seasonButtonGroup = new YAHOO.widget.ButtonGroup("season-button-group", {"value": "any"});
	seasonButtonGroup.addListener("checkedButtonChange", function (e) {
	  var newC = "season-" + e.newValue.get("value");
	  var oldC = "season-" + e.prevValue.get("value");
		YAHOO.util.Dom.replaceClass("flowchart", oldC, newC);
	});
	YAHOO.util.Dom.addClass("flowchart", "season-any");

	/*YAHOO.util.Event.addListener("postit", "click", function() { 
			YAHOO.util.Dom.addClass("postit", "hidden");
	});*/
});
