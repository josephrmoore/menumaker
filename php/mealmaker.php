<?php
            require "mysql.php";
            
            $con = mysql_connect($mysql_host, $mysql_user, $mysql_pw);
            $dbs = mysql_select_db($mysql_db, $con);
            
            function getPlan($plan_id){
                $plans_rows = mysql_query("SELECT * FROM plans WHERE plan_id = '" . $plan_id . "'");
                $weeks_rows = mysql_query("SELECT * FROM weeks WHERE plan_id = '" . $plan_id . "'");
                $days_rows = mysql_query("SELECT * FROM days");
                $meals_rows = mysql_query("SELECT * FROM meals");
                $ingredients_rows = mysql_query("SELECT * FROM ingredients");
                $tags_rows = mysql_query("SELECT * FROM tags");
                $plans = array();
                $weeks = array();
                $days = array();
                $meals = array();
                $ingredients = array();
                $tags = array();
                
                while ($plan = @mysql_fetch_array($plans_rows, MYSQL_ASSOC)) {
                    array_push($plans, $plan);
                }
                while ($week = mysql_fetch_array($weeks_rows, MYSQL_ASSOC)) {
                    array_push($weeks, $week);
                }
                while ($day = mysql_fetch_array($days_rows, MYSQL_ASSOC)) {
                    array_push($days, $day);
                }
                while ($meal = mysql_fetch_array($meals_rows, MYSQL_ASSOC)) {
                    array_push($meals, $meal); 
                }
                while ($ingredient = mysql_fetch_array($ingredients_rows, MYSQL_ASSOC)) {
                    array_push($ingredients, $ingredient); 
                }
                while ($tag = mysql_fetch_array($tags_rows, MYSQL_ASSOC)) {
                    array_push($tags, $tag); 
                } 

                $json_weeks = array();
                foreach($weeks as $week){
                    $json_week = array();
                    foreach($week as $day_of_week=>$day_id){                      
                        foreach($days as $day){
                            if($day_of_week != "id" && $day_of_week != "plan_id" && $day["id"] == $day_id){
                                $json_day = array();
                                foreach($day as $meal_type=>$meal_id){
                                    foreach($meals as $meal){
                                        if($meal_type != "id" && $meal["id"] == $meal_id){
                                            $json_meal = array();
                                            $meal_tags = array();
                                            $meal_ingredients = array();
                                            foreach($tags as $tag){
                                                if($tag["meal_id"] == $meal["id"]){
                                                    array_push($meal_tags, $tag);
                                                }
                                            }
                                            foreach($ingredients as $ingredient){
                                                if($ingredient["meal_id"] == $meal["id"]){
                                                    array_push($meal_ingredients, $ingredient);
                                                }
                                            }
                                            // Start building JSON response
                                            $json_meal["meal"] = array();
                                            $json_meal["meal"]["id"] = $meal["id"];
                                            $json_meal["meal"]["name"] = $meal["name"];
                                            $json_meal["ingredients"] = $meal_ingredients;
                                            $json_meal["tags"] = $meal_tags;
                                            $json_day[$meal_type] = $json_meal;
                                        }
                                    }
                                }
                                $json_week[$day_of_week] = $json_day;
                            }
                        }
                    }
                    array_push($json_weeks, $json_week);
                }
                print_r(json_encode($json_weeks));
            }
            
            function getMeal($meal_id){
                $meals_rows = mysql_query("SELECT * FROM meals");
                $ingredients_rows = mysql_query("SELECT * FROM ingredients");
                $tags_rows = mysql_query("SELECT * FROM tags");
                $meals = array();
                $ingredients = array();
                $tags = array();
                
                while ($meal = mysql_fetch_array($meals_rows, MYSQL_ASSOC)) {
                    array_push($meals, $meal); 
                }
                while ($ingredient = mysql_fetch_array($ingredients_rows, MYSQL_ASSOC)) {
                    array_push($ingredients, $ingredient); 
                }
                while ($tag = mysql_fetch_array($tags_rows, MYSQL_ASSOC)) {
                    array_push($tags, $tag); 
                } 
                foreach($meals as $meal){
                    if($meal["id"] == $meal_id){
                        $json_meal = array();
                        $meal_tags = array();
                        $meal_ingredients = array();
                        foreach($tags as $tag){
                            if($tag["meal_id"] == $meal["id"]){
                                array_push($meal_tags, $tag);
                            }
                        }
                        foreach($ingredients as $ingredient){
                            if($ingredient["meal_id"] == $meal["id"]){
                                array_push($meal_ingredients, $ingredient);
                            }
                        }
                        // Start building JSON response
                        $json_meal["meal"] = array();
                        $json_meal["meal"]["id"] = $meal["id"];
                        $json_meal["meal"]["name"] = $meal["name"];
                        $json_meal["ingredients"] = $meal_ingredients;
                        $json_meal["tags"] = $meal_tags;
                        print_r(json_encode($json_meal));
                    }
                }
            }
            
            function createMeal($name){
                mysql_query("INSERT INTO meals (name) VALUES ($name)");
            }
            
            function createIngredient($name, $meal_id){
                mysql_query("INSERT INTO ingredients (name, meal_id) VALUES ($name, $meal_id)");
            }
            
            function createTag($name, $meal_id){
               mysql_query("INSERT INTO tags (name, meal_id) VALUES ($name, $meal_id)"); 
            }
            
            function add_week($plan_id){
                mysql_query("INSERT INTO weeks (plan_id) VALUES ($plan_id)"); 
            }

            function edit($table, $id, $key, $value){
                mysql_query("UPDATE $table SET $key=$value WHERE id='$id'");
            }
            
            function remove($table, $id){
               mysql_query("DELETE FROM $table WHERE id = '$id'");
            }
            
            

?>