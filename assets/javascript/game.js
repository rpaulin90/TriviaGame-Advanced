
//both time variables are in seconds. We need to multiply by 1000 as JS uses milliseconds

var timeToAnswer = 500;

var timeInterval;

var rightAnswers = 0;

var wrongAnswers = 0;

var unAnswered = 0;

var updateProgress = function(){
	$(".progress-bar").attr("aria-valuenow",((counter)/(questionsAndAnswers.length))*100);
	$(".progress-bar").css("width",$(".progress-bar").attr("aria-valuenow") + "%");
	$(".sr-only").html($(".progress-bar").attr("aria-valuenow") + "% Complete");
}

var thatIsCorrect = function(that){
	if($(that).attr("code") === node.correctAnswer){
		rightAnswers++;
		$(".top").html("Correct!");
		$(".middle").html("<img src='assets/images/question1.png' class='image'>");
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

var getTimeRemaining = function(deadline){

	//time remaining in milliseconds between now and the end (substract time now from time in future)
	var t = Date.parse(deadline) - Date.parse(new Date());

	//convert milliseconds remaining to seconds
	var secondsLeft = Math.floor(t/1000);

	//make a reusable object that give us easy access to the values of minutes and seconds at any point in time
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
				setTimeout(createQA,3000);
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

var questionsAndAnswers = [

	{
		question: "question 1",
		answers: ["answer 1","answer 2", "answer 3","answer 4"],
		answerCodes: ["one","two","three", "four"], //a code makes it easier to change the correct answer (no need to write all the answer)
		correctAnswer: "two",
		correctAnswerPath: function(){return questionsAndAnswers[0].answers[1]}
	},

	{
		question: "question 2",
		answers: ["answer 1","answer 2", "answer 3", "answer 4"],
		answerCodes: ["one","two","three", "four"], //a code makes it easier to change the correct answer (no need to write all the answer)
		correctAnswer: "one",
		correctAnswerPath: function(){return questionsAndAnswers[1].answers[0]}
	},	

	{
		question: "question 3",
		answers: ["answer 1","answer 2", "answer 3", "answer 4"],
		answerCodes: ["one","two","three", "four"], //a code makes it easier to change the correct answer (no need to write all the answer)
		correctAnswer: "four",
		correctAnswerPath: function(){return questionsAndAnswers[2].answers[3]}
	},

	{
		question: "question 4",
		answers: ["answer 1","answer 2", "answer 3", "answer 4"],
		answerCodes: ["one","two","three", "four"], //a code makes it easier to change the correct answer (no need to write all the answer)
		correctAnswer: "three",
		correctAnswerPath: function(){return questionsAndAnswers[2].answers[2]}
	},


];

var counter = 0;

var node = questionsAndAnswers[counter];

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

var endOfQuiz = function(){
	clearInterval(timeInterval);
	//create divs to show results
	setTimeout(function showResults(){
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
	}, 3000);
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
			setTimeout(createQA,3000);
		}


	})

	$(document).on("click",".restartQuiz", function(){

		counter = 0;
		rightAnswers = 0;
		wrongAnswers = 0;
		unAnswered = 0;
		node = questionsAndAnswers[counter];
		$(".bottom").empty();
		createQA();


	});



});

