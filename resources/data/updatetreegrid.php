<?php

require_once('connect.php');
$json = filter_input(INPUT_POST, 'data');
$data = json_decode($json, true);
$id = explode("_", $data['id']);
if (isset($data['parentId'])) {
  $catalog = explode("_", $data['parentId'])[1];
  $rs = $Stamps->query("UPDATE country SET `Kat#`=$catalog WHERE `L#`=$id[1]");
}
if (isset($data['title'])) {
  $data['title'] = utf8_decode($data['title']);
  error_log($id[0]);
  switch ($id[0]) {
    case 'cou':
      $rs = $Stamps->query("UPDATE country SET `Land`='" . $data['title'] . "' WHERE `L#`=$id[1]");
      break;
    case 'cat':
      $rs = $Stamps->query("UPDATE katalog SET `Katalog`='" . $data['title'] . "' WHERE `Kat#`=$id[1]");
      break;
    case 'typ':
      $nr = $Stamps->query("SELECT `K#` as nr FROM `landtype` WHERE `Nr`=$id[1]")->fetch_object()->nr;
      $rs = $Stamps->query("UPDATE type SET `Kategori`='" . $data['title'] . "' WHERE `Kategori#`=$nr");
  }
}
$arr['result'] = $rs;
echo json_encode($arr);
?>