jQuery(document).ready(function($){
	function Plan(){
		this.weeks = 1;
	}

	function Week(){
		this.monday = null;
		this.tuesday = null;
		this.wednesday = null;
		this.thursday = null;
		this.friday = null;
		this.saturday = null;
		this.sunday = null;
	}

	function Day(){
		this.breakfast = null;
		this.lunch = null;
		this.snack = null;
		this.dinner = null;
	}

	function Meal(){
		this.name = "Untitled meal";
		this.ingredients = [];
		this.tags = [];
	}

	function makeTag(name, type){
		return {
			"type" : type,
			"name" : name
		}
	}


	function createMeal(){
		$.ajax({
			type:"POST",
			url:"php/createmeal.php",
			success:function(data){

			}
		});
	}
	function editMeal(){
		$.ajax({
			type:"POST",
			url:"php/editmeal.php",
			success:function(data){

			}
		});
	}
	function deleteMeal(){
		$.ajax({
			type:"POST",
			url:"php/deletemeal.php",
			success:function(data){

			}
		});
	}
	function editPlan(){
		$.ajax({
			type:"POST",
			url:"php/editplan.php",
			success:function(data){

			}
		});	
	}
	function getPlan(plan_id){
		$.ajax({
			type:"GET",
			url:"php/getplan.php?plan="+plan_id,
			success:function(data){
				var plan_json = JSON.parse(data);
				var html = renderPlan(plan_json);
				$('#wrapper').append(html);
			}
		});
	}
	
	function getMeals(json){
		$.ajax({
			type:"GET",
			url:"php/getmeals.php",
			success:function(data){
				var meals_json = JSON.parse(data);
				var html = renderMeals(meals_json);
				$('#wrapper').append(html);
			}
		});
	}
	
	function renderPlan(json){
		var number_weeks = json.length;
		var html = '<form id="plan" action=""><h1>Plan</h1><div class="weeks"><h2>Add weeks to plan</h2><input id="weeks__current" type="number" value="'+ number_weeks +'" /><input id="weeks__add" type="button" value="+" />';
		for(var i=0; i<number_weeks; i++){
			html += renderWeek(json[i], (i+1));
		}
		html += '</div></form>';
		return html;
	}
	
	function renderWeek(week_json, week_number){
		var html = '<ul class="weeks__preview"><li class="weeks__week_'+ week_number +'"><h2>Week <span class="weeks__week_'+ week_number +'_number">'+ week_number +'</span></h2><ul class="days">';
		for(day in week_json){
			html += renderDay(week_json[day], day);
		}
		html += '</ul></li><button class="">Remove Week</button></ul>';
		return html;
	}
	
	function blankWeek(week_number){
		var html = '<ul class="weeks__preview"><li class="weeks__week_'+ week_number +'"><h2>Week <span class="weeks__week_'+ week_number +'_number">'+ week_number +'</span></h2><ul class="days">';
		var days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
		for(var i=0; i<days.length; i++){
			html += blankDay(days[i]);
		}
		html += '</ul></li><button class="">Remove Week</button></ul>';
		return html;
		
	}
	
	function blankDay(day){
		var meals = ["breakfast", "lunch", "dinner", "snack"];
		var html = '<li class="days__'+ day +'"><h3 class="days__'+ day +'_day">'+ day.charAt(0).toUpperCase()+ day.slice(1) +'</h3><ul class="meals">';
		for(var i=0; i<meals.length; i++){
			html += blankMeal(meals[i]);
		}
		html += '</ul></li>';
		return html;
	}
	
	function blankMeal(meal){
		var name = {"meal" : {"name" : "", "tags" : [], "ingredients" : []}};
		return renderMeal(name, meal);
	}
	
	function renderDay(day_json, day){
		var html = '<li class="days__'+ day +'"><h3 class="days__'+ day +'_day">'+ day.charAt(0).toUpperCase()+ day.slice(1) +'</h3><ul class="meals">';
		for(meal in day_json){
			html += renderMeal(day_json[meal], meal);
		}
		html += '</ul></li>';
		return html;
	}
	
	function renderMeal(meal_json, meal){
		var meal_name = meal_json["meal"]["name"];
		var html = '<li class="meals__'+ meal +'"><h4 class="meals__'+ meal +'_name" contenteditable>'+ meal.charAt(0).toUpperCase()+meal.slice(1) +'</h4><h5>'+meal_name+'</h5><div class="meals__'+ meal +'_tags"><h5>Tags</h5><ul class="meals__'+ meal +'_tags_list">';
		for(var i=0; i<meal_json["tags"].length; i++){
			html += renderTag(meal_json["tags"][i], meal);
		}
		html = html+'</ul><h5>Add tag</h5><input id="meals__'+ meal +'_tags_add" type="button" value="+" /></div><div class="meals__'+ meal +'_ingredients"><h5>Ingredients</h5><ul class="meals__'+ meal +'_ingredients_list">';
		for(var i=0; i<meal_json["ingredients"].length; i++){
			html += renderIngredient(meal_json["ingredients"][i], meal);
		}
		html = html+'</ul><h5>Add ingredient</h5><input id="meals__'+ meal +'_ingredients_add" type="button" value="+" /></div><button class="meals__'+meal+'_close">Remove Meal</button></li>';
		return html;
	}
	
	function renderTag(tag_json, meal){
		return '<li class="meals__'+ meal +'_tag" contenteditable><span class="meals__'+ meal + '_tag_name">' + tag_json["name"] +'</span><button class="meals__'+ meal +'_tag_close">Delete tag</button></li>'
	}
	
	function renderIngredient(ingredient_json, meal){
		return '<li class="meals__'+ meal +'_ingredient" contenteditable><span class="meals__'+ meal + '_ingredient_name">' + ingredient_json["name"] +'</span><button class="meals__'+ meal +'_ingredient_close">Delete Ingredient</button></li>';
	}
	
	function renderMeals(json){
		// var html = '<form id="pool" action="">
		//     <h1>Meals</h1>
		// 	        <ul class="meals">
		// 	            <li class="meals__meal">
		//                     <h2 class="meals__meal_name" contenteditable></h2>
		//                     <ul class="meals__meal_tags">
		//                           <li class="meals__meal_tag" contenteditable></li>
		//                           <!--repeat for all tags  -->
		//                       </ul>
		//                       <h2>Add tag</h2>
		//                       <input id="meals__meal_tags_add" type="button" value="+" />
		// 	            </li>
		// 	            <!-- repeat for all meals -->
		// 	        </ul>
		// 	        <input id="meals__add" type="button" value="+" />
		// 	    </form>';
		// return html;
	}
	
	getPlan(1);
	
});