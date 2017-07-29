<?php

require_once('connect.php');
$data = isset($_REQUEST['data']) ? json_decode($_REQUEST['data'], true) : '';
$query_valuta = sprintf("SELECT v.`Land`, v.`Kurs` FROM valuta v WHERE v.`Nr`=(SELECT k.`Valuta` FROM katalog k WHERE k.`Kat#`=(SELECT c.`Kat#` FROM country c WHERE c.`L#`=(SELECT l.`L#` FROM landtype l WHERE l.`Nr`=(SELECT s.`Nr` FROM stamps s WHERE s.`id`=%s))))", $data['id']);
$exch = $Stamps->query($query_valuta)->fetch_assoc();
if (array_key_exists('katalogvalue', $data)) {
  $update = "UPDATE stamps SET Katalogvalue='" . $data['katalogvalue'] . "' WHERE id=" . $data['id'];
  $data['value']=$data['katalogvalue']*$exch['Kurs'];
}
if (array_key_exists('Kvalitet', $data)) {
  $update = "UPDATE stamps SET `Kvalitet`='" . $data['Kvalitet'] . "' WHERE id=" . $data['id'];
}
if (array_key_exists('katalognummer', $data)) {
  $split = preg_split("/\D/", $data['katalognummer'], -1, PREG_SPLIT_NO_EMPTY);
  $update = "UPDATE stamps SET Katalognummer='" . $data['katalognummer'] . "', sortorder='" . $split[0] . "' WHERE id=" . $data['id'];
}
if (array_key_exists('Imagename', $data)) {
  $update = "UPDATE stamps SET `Imagename`='" . $data['Imagename'] . "' WHERE id=" . $data['id'];
}
$rs = $Stamps->query($update);
$arr['success'] = $rs;
$arr['valuta'] = ' '.$exch['Land'];
$arr['data'] = $data;
echo json_encode($arr);
?>