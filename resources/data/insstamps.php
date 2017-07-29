<?php

require_once('connect.php');
$Nr = isset($_REQUEST[('Nr')]) ? $_REQUEST[('Nr')] : 0;
$data = isset($_REQUEST['data']) ? json_decode($_REQUEST['data'], true) : '';
$query_valuta = sprintf("SELECT v.`Land`, v.`Kurs` FROM valuta v WHERE v.`Nr`=(SELECT k.`Valuta` FROM katalog k WHERE k.`Kat#`=(SELECT c.`Kat#` FROM country c WHERE c.`L#`=(SELECT l.`L#` FROM landtype l WHERE l.`Nr`=%s)))", $Nr);
$exch = $Stamps->query($query_valuta)->fetch_assoc();
$split = preg_split("/\D/", $data['katalognummer'], -1, PREG_SPLIT_NO_EMPTY);
$insert = "INSERT stamps (`Nr`,`Katalognummer`,`Kvalitet`,`Katalogvalue`,`sortorder`) VALUES($Nr,'".$data['katalognummer']."',".$data['Kvalitet'].",".$data['katalogvalue'].",".$split[0].")";
$rs = $Stamps->query($insert);
$data['id']=$Stamps->insert_id;
$arr['success'] = $rs;
$arr['code']=  $Stamps->error;
$arr['sql']=$insert;
$arr['valuta'] = ' ' . $exch['Land'];
$data['value']=$data['katalogvalue']*$exch['Kurs'];
$arr['data'] = $data;
echo json_encode($arr);
?>