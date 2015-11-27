<?php

require "mealmaker.php";

$id = ($_GET['plan']) ? $_GET['plan'] : 1;

getPlan($id);

?>