<?php

require_once('connect.php'); //Defines $Stamps for query
$title = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
$parent = filter_input(INPUT_POST, 'parent', FILTER_SANITIZE_STRING);
$valuta = filter_input(INPUT_POST, 'valuta', FILTER_SANITIZE_STRING);
$parentArr = explode("_", $parent, 2);
if (count($parentArr) == 1) {//root means new catalog
  $query_exist = sprintf("SELECT `Kat#`  FROM `katalog` WHERE `Katalog` LIKE '%s'", utf8_decode($title));
  if ($Stamps->query($query_exist)->num_rows > 0) {
    $arr['success'] = false;
    $arr['status'] = "Kataloget " . $title . " findes allerede";
  } else {
    //Find next free kat#
    $query_valuta = sprintf("SELECT Nr FROM `valuta` WHERE `Land` LIKE '%s'", utf8_decode($valuta));
    $valutakey = $Stamps->query($query_valuta)->fetch_object()->Nr;
    $katid = $Stamps->query("SELECT t1.`Kat#`+1 AS Missing FROM katalog AS t1 LEFT JOIN katalog AS t2 ON t1.`Kat#`+1 = t2.`Kat#` WHERE t2.`Kat#` IS NULL ORDER BY t1.`Kat#` LIMIT 1")->fetch_object()->Missing;
    $insquery = sprintf("INSERT INTO `katalog`(`Kat#`, `Katalog`, `Valuta`) VALUES (%s,'%s',%s)", $katid, utf8_decode($title), $valutakey);
    $arr['success'] = $Stamps->query($insquery);
    if ($arr['success']) {
      $arr['status'] = "Kataloget " . $title . " er oprettet med valuta " . $valuta . " på id " . $katid;
    } else {
      $arr['status'] = "Kataloget " . $title . " blev ikke oprettet!";
    }
  }
}
echo json_encode($arr);
?>