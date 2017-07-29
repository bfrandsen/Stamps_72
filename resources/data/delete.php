<?php

require_once('connect.php'); //Defines $Stamps for query
$recid = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_STRING);
$records = filter_input(INPUT_POST, 'records', FILTER_VALIDATE_INT, ['options' => ['max_range' => 0]]);
if ($records === 0) {
  $recArr = explode("_", $recid, 2);
  $delete = sprintf("DELETE FROM `katalog` WHERE `Kat#`=%s", $recArr[1]);
  $arr['success'] = $Stamps->query($delete);
  $arr['status'] = "Katalog slettet";
} else {
  $arr['status'] = $records;
  $arr['status'] = "Katalog i brug kan ikke slettes";
}
echo json_encode($arr);
?>