
//both time variables are in seconds. We need to multiply by 1000 as JS uses milliseconds

var timeToAnswer = 15;

var timeBeforeNextQ = 6000;

var timeInterval;

var questionsAndAnswers = [

	{
		question: "How many medals has Michael Phelps won in total?",
		answers: ["17","28", "23","&#8734"],
		answerCodes: ["one","two","three", "four"], //a code makes it easier to change the correct answer (no need to write all the answer)
		correctAnswer: "two",
		correctAnswerPath: function(){return questionsAndAnswers[0].answers[1]},
		gif: "question1.gif"
	},

	{
		question: "What has been the highest speed reached by Usain Bolt in a race?",
		answers: ["27.49 miles/hour","40.37 miles/hour", "53.42 miles/hour", "25.56 miles/hour"],
		answerCodes: ["one","two","three", "four"], //a code makes it easier to change the correct answer (no need to write all the answer)
		correctAnswer: "one",
		correctAnswerPath: function(){return questionsAndAnswers[1].answers[0]},
		gif: "question2.gif"
	},	

	{
		question: "What country sent the smallest delegation to Rio 2016?",
		answers: ["Nauru","swaziland", "Chad", "Tuvalu"],
		answerCodes: ["one","two","three", "four"], //a code makes it easier to change the correct answer (no need to write all the answer)
		correctAnswer: "four",
		correctAnswerPath: function(){return questionsAndAnswers[2].answers[3]},
		gif: "question3.jpg"
	},

	{
		question: "How much money does the U.S. Olympic Comitee pay an athlete for getting a gold medal?",
		answers: ["$1,000","$1,000,000", "$25,000", "$50,000"],
		answerCodes: ["one","two","three", "four"], //a code makes it easier to change the correct answer (no need to write all the answer)
		correctAnswer: "three",
		correctAnswerPath: function(){return questionsAndAnswers[3].answers[2]},
		gif: "question4.gif"
	},


];

var rightAnswers = 0;

var wrongAnswers = 0;

var unAnswered = 0;

var counter = 0;

var node = questionsAndAnswers[counter];

//function to update the progress bar

var updateProgress = function(){
	$(".progress-bar").attr("aria-valuenow",((counter)/(questionsAndAnswers.length))*100);
	$(".progress-bar").css("width",$(".progress-bar").attr("aria-valuenow") + "%");
	$(".sr-only").html($(".progress-bar").attr("aria-valuenow") + "% Complete");
}

//what to do in case the answer is correct/incorrect/unanswered

var thatIsCorrect = function(that){
	if($(that).attr("code") === node.correctAnswer){
		rightAnswers++;
		$(".top").html("Correct!");
		$(".middle").html("<img src='assets/images/" + node.gif + "'class='image'>");
	}
	}

var thatIsIncorrect = function(that){
	if($(that).attr("code") !== node.correctAnswer){
		wrongAnswers++;
		$(".top").html("Incorrect!");
		$(".middle").html("the answer is <strong>" + node.correctAnswerPath() + "</strong>");
	}
}

var thatIsUnanswered = function(){
		$(".top").html("You ran out of time!");
		$(".middle").html("the answer is <strong>" + node.correctAnswerPath() + "</strong>");
}

//the next few functions make the timer

var getTimeRemaining = function(deadline){

	//time remaining in milliseconds between now and the end (substract time now from time in future)
	var t = Date.parse(deadline) - Date.parse(new Date());

	//convert milliseconds remaining to seconds
	var secondsLeft = Math.floor(t/1000);

	//make a reusable object that gives us easy access to the values of total time and seconds at any point in time
	//can get value at any time using getTimeRemaining(deadline).total, etc
	return {

		"total": t,

		"seconds": secondsLeft
	}

}

//The startTimer function takes an HTML tag id and a deadline date (in this case, the current time plus some seconds to wait)

var startTimer = function(id,deadline){


	//make a function to print the time remaining to the screen (using the id for the html tag where we want the clock to be placed)

	function updateClock(){

		//create a variable to hold the getTimeRemaining function so it is easier to write and call

		var time = getTimeRemaining(deadline);

		$(id).html("Time remaining: " + time.seconds + " seconds!");

		//what happens when timer gets to 0.
		//once the user selects an option, the timer resets, so if it runs out it means it was unanswered

		if(time.total <= 0){
			clearInterval(timeInterval);
			thatIsUnanswered();
			unAnswered++
			if(counter === (questionsAndAnswers.length-1)){
				endOfQuiz();

			}

			else{
				counter++;
				node = questionsAndAnswers[counter];
				setTimeout(createQA,timeBeforeNextQ);
			}
		}

	}

	//call updateClock() once first before starting the interval to avoid 1 sec delay at the beginning

	updateClock();
	
	//in order to stop the timer, we give it a variable name so we can enter it as an argument in clearInterval
	timeInterval = setInterval(updateClock,1000);
}

// create an array of objects, where each object has information for each question
// the array will be useful because we will be able to retrieve information using for loops


var createQA = function(){

	// clearInterval(timeInterval);

	//need to empty the middle section div before we append the text for the next question/answers
	//this is necessary after the first question has been answered
	$(".middle").empty();

	//giving no arguments to the Date() constructor, it creates a Date object for the current time

	var currentTime = Date.parse(new Date());

	// the endtime is the current time plus the time in seconds we want the timer to go 

	var deadlineToAnswer = new Date(currentTime + timeToAnswer*1000);

	$(".top").html(questionsAndAnswers[counter].question);

	for(var y = 0; y < questionsAndAnswers[counter].answers.length; y++){

		//create a div for every possible answer
		var possibleAnswer = $("<a href='#'>");
		possibleAnswer.addClass("answerChoice");
		possibleAnswer.addClass("btn");
		possibleAnswer.attr("role","button");
		possibleAnswer.attr("code",node.answerCodes[y]);
		//fill each div with its corresponding text
		possibleAnswer.html(node.answers[y]);
		//append the newly created div to the middle section of the static html
		$(".middle").append(possibleAnswer);
	}
	updateProgress();
	startTimer("#timer", deadlineToAnswer);
}

var showResults = function(){
	//create divs to show results, create a restart button
	var numberOfCorrect = $("<div class='btn'>");
	var numberOfInorrect = $("<div class='btn'>");
	var numberOfUnanswered = $("<div class='btn'>");
	numberOfCorrect.html("Correct Answers: <span class='badge'>" + rightAnswers + "</span>");
	numberOfInorrect.html("Incorrect Answers: <span class='badge'>" + wrongAnswers) + "</span>";
	numberOfUnanswered.html("Unanswered Questions: <span class='badge'>" + unAnswered + "</span>")

	$(".progress-bar").attr("aria-valuenow","100");
	$(".progress-bar").css("width","100%");
	$(".sr-only").html($(".progress-bar").attr("aria-valuenow"));

	$(".top").html("That is all! your results are displayed below");
	$("#timer").empty();
	$(".middle").empty();
	$(".middle").append(numberOfCorrect);
	$(".middle").append(numberOfInorrect);
	$(".middle").append(numberOfUnanswered);
	var restart = $("<button class='restartQuiz'>Restart</button>");
	$(".bottom").append(restart);
}

var endOfQuiz = function(){
	clearInterval(timeInterval);

	setTimeout(showResults, timeBeforeNextQ);
}

var restart = function(){

	counter = 0;
	rightAnswers = 0;
	wrongAnswers = 0;
	unAnswered = 0;
	node = questionsAndAnswers[counter];
	$(".bottom").empty();
	createQA();

}


$(document).ready(function(){

	$("#start").on("click",function(){

		createQA();
		$("#start").hide();

	});

	//when clicking on one of the answer options
	//use event delegation to be able to click on a dynamically created class
	$(document).on("click",".answerChoice",function(){

		thatIsCorrect(this);
		thatIsIncorrect(this);
		//the counter will stop increasing when we go through all the questions
		if(counter === (questionsAndAnswers.length-1)){

			endOfQuiz();

		}

		else{
			clearInterval(timeInterval);
			counter++;
			node = questionsAndAnswers[counter];
			setTimeout(createQA,timeBeforeNextQ);
		}


	})

	$(document).on("click",".restartQuiz", function(){

		restart();

	});

});

