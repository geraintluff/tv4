<?php
	header("Content-Type: text/javascript");

	define("BASE_DIR", "source/");
	define("TARGET_FILE", "tv4.js");

	$files = array(
		'_header.js',
		'validate.js',
		'basic.js',
		'numeric.js',
		'string.js',
		'array.js',
		'object.js',
		'combinations.js',
		'resolve-uri.js',
		'normalise-schema.js',
		'api.js',
		'_footer.js',
	);

	$outputString = "/**\n";
	$outputString .= file_get_contents("LICENSE.txt");
	$outputString .= "**/\n\n";

	foreach ($files as $filename) {
		$outputString .= file_get_contents(BASE_DIR.$filename)."\n";
	}
	echo($outputString);
	file_put_contents(TARGET_FILE, $outputString);
?>
