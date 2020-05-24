<?php

require_once('connect.php');
$Land = filter_input(INPUT_POST, 'Land', FILTER_SANITIZE_STRING);
$Kurs = filter_input(INPUT_POST, 'Kurs', FILTER_VALIDATE_FLOAT, ['options' => ['max_range' => 0.0]]);
$update = sprintf("Update `valuta` SET `Kurs` = %s WHERE `Land`='%s'", $Kurs, $Land);
$arr['success'] = $Stamps->query($update);
$arr['status'] = $update;
echo json_encode($arr);
?>