<?php

require_once('connect.php'); //Defines $Stamps for query
$title = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
$recid = filter_input(INPUT_POST, 'recid', FILTER_SANITIZE_STRING);
$recArr = explode("_", $recid, 2);
switch ($recArr[0]) {
  case "cat":
    $update = sprintf("UPDATE `katalog` SET `Katalog`='%s' WHERE `Kat#`=%s", utf8_decode($title), $recArr[1]);
    break;
  case "cou":
    $update = sprintf("UPDATE `country` SET `Land`='%s' WHERE `L#`=%s", utf8_decode($title), $recArr[1]);
    break;
  case "typ":
    $query = sprintf("SELECT `K#` as katid FROM `landtype` WHERE `Nr` = %s", $recArr[1]);
    $katid = $Stamps->query($query)->fetch_object()->katid;
    $update = sprintf("UPDATE `type` SET `Kategori`='%s' WHERE `Kategori#`=%s", utf8_decode($title), $katid);
    break;
}
$arr['success'] = $Stamps->query($update);
if ($arr['success']) {
  $arr['status'] = "Opdateret til " . $title;
} else {
  $arr['status'] = "Opdateringen fejlede.";
}
$arr['title'] = $title;
echo json_encode($arr);
?>