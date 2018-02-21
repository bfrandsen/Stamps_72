<?php

require_once('connect.php');
$Nr = filter_input(INPUT_GET, 'Nr', FILTER_VALIDATE_INT, ['options' => ['default' => 0, 'min_range' => 0]]);
$start = filter_input(INPUT_GET, 'start', FILTER_VALIDATE_INT, ['options' => ['default' => 0, 'min_range' => 0]]);
$limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT, ['options' => ['default' => 26, 'min_range' => 1]]);
$jsonfilters = filter_input(INPUT_GET, 'filter');
$jsonsort = filter_input(INPUT_GET, 'sort');
// initialize variables
$where = sprintf(" s.`Nr`=%s ", $Nr);
$qs = '';
$qsrt = '';
// loop through filters sent by client
$filters = json_decode($jsonfilters, true);
if (is_array($filters)) {
  foreach ($filters as $value) {
    $qs .= " AND s.`" . $value['property'] . "` ";
    switch ($value['operator']) {
      case 'like':
        $qs .= $value['operator'] . " '%%" . $value['value'] . "%%'";
        break;
      case 'in':
        $qs .= $value['operator'] . " (";
        foreach ($value['value'] as $val) {
          $qs .= $val . ",";
        }
        $qs = removeComma($qs).")";
        break;
      case 'lt':
        $qs .= " <" . $value['value'];
        break;
      case 'gt':
        $qs .= " >" . $value['value'];
        break;
      case 'eq':
        $qs .= " =" . $value['value'];
        break;
    }
  }
  $where .= $qs;
}

// loop through sorts sent by client
$sort = json_decode($jsonsort, true);
if (is_array($sort)) {
  foreach ($sort as $value) {
    $qsrt .= " " . $value['property'] . " " . $value['direction'] . ",";
  }
  $qsrt = removeComma($qsrt);
} else {
  $qsrt .= ' s.`sortorder`,s.`Katalognummer`';
}
if ($Nr > 0) {
  $query_valuta = sprintf("SELECT v.`Land`, v.`Kurs` FROM valuta v WHERE v.`Nr`=(SELECT k.`Valuta` FROM katalog k WHERE k.`Kat#`=(SELECT c.`Kat#` FROM country c WHERE c.`L#`=(SELECT l.`L#` FROM landtype l WHERE l.`Nr`=%s)))", $Nr);
  $exch = $Stamps->query($query_valuta)->fetch_assoc();
  $query_path = sprintf("SELECT `stampworldpath` FROM landtype WHERE `Nr`=%s",$Nr);
  $path = $Stamps->query($query_path)->fetch_object();
  $query = sprintf("SELECT SQL_CALC_FOUND_ROWS s.`id`, s.`Nr`, s.`Katalognummer` as katalognummer, s.`Kvalitet`, s.`Katalogvalue` as katalogvalue, s.`Katalogvalue`*%s as value, s.`Imagename`, s.`sortorder` FROM stamps s WHERE" . $where . " ORDER BY" . $qsrt, $exch['Kurs'], $Nr);
  $query .= " LIMIT " . $start . "," . $limit;
  //echo $query;
  $rs = $Stamps->query($query);
  $total = $Stamps->query("SELECT FOUND_ROWS();")->fetch_array(MYSQLI_NUM);
  $arr = array();
  while ($obj = $rs->fetch_object()) {
    $obj->valuta = $exch['Land'];
    $obj->stampworldDirectory=$path->stampworldpath;
    $arr[] = $obj;
  }
  echo '{"total":"' . $total[0] . '","data":' . json_encode($arr) . '}';
} else {
  echo '{"total":"0","data":[]}';
}

function removeComma($str) {
  return substr($str, 0, strlen($str) - 1);
}

?>