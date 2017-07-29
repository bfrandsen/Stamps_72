INSERT INTO `skanold` (SELECT c.`Land`,k.`Katalog`,sum(a.`Sum`) as sum FROM `country` c,`landtype` l,`katalog` k,(SELECT sum(s.`Katalogvalue`) as `Sum`, s.`Nr` FROM stamps s WHERE s.`Nr` IN (SELECT `Nr` FROM landtype WHERE `L#`IN (SELECT `L#` FROM country WHERE `Kat#`=3 ORDER BY `Land`)) GROUP BY s.`Nr`) as a WHERE l.`Nr`=a.`Nr` AND c.`L#`=l.`L#` AND c.`Kat#`=k.`Kat#` GROUP BY `Land`)