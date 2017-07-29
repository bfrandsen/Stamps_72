<?php

require_once('connect.php');
$rs = $Stamps->query("SELECT k.`Kval#` as `id`, k.`Beskrivelse` as `text` FROM kvalitet k ORDER BY k.`Beskrivelse`;");
$total = $Stamps->query("SELECT FOUND_ROWS();")->fetch_array(MYSQLI_NUM);
$arr = array();
while ($obj = $rs->fetch_object()) {
  foreach ($obj as $key => $value) {
    $obj->$key = utf8_encode($value);
  }
  $arr[] = $obj;
}
// return response to client
echo '{"total":"' . $total[0] . '","data":' . json_encode($arr) . '}';
$rs->free_result();
?>