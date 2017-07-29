<?php

require_once('connect.php');

class katalog {

  // property declaration
  public $id;
  public $title;
  public $valuta;
  public $amount;
  public $records;
  public $expanded = false;
  public $expandable;
  public $iconCls = "x-fa fa-book";

  //public $children = array();

  function __construct($id, $name, $valuta, $amount, $records, $expandable) {
    $this->id = $id;
    $this->title = $name;
    $this->valuta = $valuta;
    $this->amount = $amount;
    $this->records = $records;
    $this->expandable = is_bool($expandable) ? $expandable : true;
  }

}

class country {

  // property declaration
  public $id;
  public $title;
  public $amount;
  public $records;
  public $iconCls = "x-fa fa-globe";
  public $expandable = true;

  function __construct($id, $title, $amount, $records) {
    $this->id = $id;
    $this->title = $title;
    $this->amount = $amount;
    $this->records = $records;
  }

}

class type {

  // property declaration
  public $id;
  public $title;
  public $amount;
  public $records;
  public $leaf = true;
  public $iconCls = "x-fa fa-stack-exchange";

  function __construct($id, $title, $amount, $records) {
    $this->id = $id;
    $this->title = $title;
    $this->amount = $amount;
    $this->records = $records;
  }

}

$id = filter_input(INPUT_GET, 'node', FILTER_SANITIZE_STRING);
//First call reads all catalogs
if ($id === "root") {
  $total_sum = 0;
  $total_records = 0;
  $root = new stdClass();
  $root->text = '.';
  $query_types = "SELECT k.`Kat#`, k.`Katalog`,(SELECT v.`Land` FROM valuta v WHERE v.`Nr`=k.`Valuta`) as valuta,(SELECT v.`Kurs` FROM valuta v WHERE v.`Nr`=k.`Valuta`) as `Kurs` FROM katalog k ORDER BY k.`Katalog`;";
  $get_types = $Stamps->query($query_types);
  while ($type = $get_types->fetch_assoc()) {
    $query_sum = utf8_decode(sprintf("SELECT sum(s.`Katalogvalue`) as `Sum`, count(s.`id`) as `records` FROM stamps s WHERE s.`Nr` IN (SELECT l.`Nr` FROM landtype l WHERE l.`L#` IN (SELECT c.`L#` FROM country c WHERE c.`Kat#`=%s));", $type['Kat#']));
    $sum = $Stamps->query($query_sum)->fetch_assoc();
    $root->children[] = new katalog('cat_' . $type['Kat#'], utf8_encode($type['Katalog']), $type['valuta'], $sum['Sum'] * $type['Kurs'], $sum['records'], true);
    $total_sum += $sum['Sum'] * $type['Kurs'];
    $total_records += $sum['records'];
  }
  $root->children[] = new katalog('summary', 'Hele samlingen', '', $total_sum, $total_records, false);
  echo json_encode($root);
}
//If id start with cat_xx find all country in catalog with id xx.
if (substr($id, 0, 3) === "cat") {
  $children = [];
  $split = explode("_", $id);
  //Find exchange rate for catalog
  $query_exch = sprintf("SELECT v.`Kurs` FROM valuta v WHERE v.`Nr`=(SELECT k.`Valuta` FROM katalog k WHERE k.`Kat#`=%s);", $split[1]);
  $exch = $Stamps->query($query_exch)->fetch_assoc();
  $query_countries = sprintf("SELECT c.`L#`, c.`Land` FROM country c WHERE c.`Kat#`=%s ORDER BY c.`Land`;", $split[1]);
  $get_countries = $Stamps->query($query_countries);
  while ($path = $get_countries->fetch_assoc()) {
    $query_sum = utf8_decode(sprintf("SELECT sum(s.`Katalogvalue`) as `Sum`, count(s.`id`) as `number` FROM stamps s WHERE s.`Nr` IN (SELECT l.`Nr` FROM landtype l WHERE l.`L#`=%s);", $path['L#']));
    $sum = $Stamps->query($query_sum)->fetch_assoc();
    $children[] = new country('cou_' . $path['L#'], utf8_encode($path['Land']), $sum['Sum'] * $exch['Kurs'], $sum['number']);
  }
  echo json_encode($children);
}
//If id start with cou_xx find all catagories in country with id xx.
if (substr($id, 0, 3) === "cou") {
  $children = [];
  $split = explode("_", $id);
  //Find exchange rate for catalog
  $query_exch = sprintf("SELECT v.`Kurs` FROM valuta v WHERE v.`Nr`=(SELECT k.`Valuta` FROM katalog k WHERE k.`Kat#`=(SELECT c.`Kat#` FROM country c WHERE c.`L#`=%s));", $split[1]);
  $exch = $Stamps->query($query_exch)->fetch_assoc();
  $query_categories = sprintf("SELECT l.`Nr`,(SELECT t.`Kategori` FROM `type` t WHERE t.`Kategori#`=l.`K#`) as `type` FROM landtype l WHERE l.`L#`=%s ORDER BY `type`;", $split[1]);
  $get_categories = $Stamps->query($query_categories);
  while ($category = $get_categories->fetch_assoc()) {
    $query_sum = utf8_decode(sprintf("SELECT sum(s.`Katalogvalue`) as `Sum`, count(s.`id`) as `number` FROM stamps s WHERE s.`Nr` =%s;", $category['Nr']));
    $sum = $Stamps->query($query_sum)->fetch_assoc();
    $children[] = new type('typ_' . $category['Nr'], utf8_encode($category['type']), $sum['Sum'] * $exch['Kurs'], $sum['number']);
  }
  echo json_encode($children);
}
?>