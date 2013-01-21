<?php
define("TEST_START_DIR", "tests/");

$currentTest = "";;
if (isset($_REQUEST["test"])) {
    $currentTest = $_REQUEST["test"];
}
$currentDirPath = NULL;
$currentTestPath = NULL;
$currentTestName = "";

function outputDir($directory, $prefix="") {
    global $currentTest, $currentTestPath, $currentTestName, $currentDirPath;
    $list = scandir($directory);
    foreach ($list as $listItem) {
        if ($listItem[0] == ".") {
            continue;
        }
        $name = $listItem;
        $listItemPath = $directory.$listItem;
        $listItem = $prefix.$listItem;
        if (is_dir($directory."/".$listItem)) {
            $listItem .= "/";
            $listItemPath .= "/";
            $href = "?test=".urlencode($listItem);
            $hrefAll = "?all&test=".urlencode($listItem);
            if (substr($currentTest, 0, strlen($listItem)) != $listItem) {
                echo '<a href="'.$hrefAll.'" class="test-set-group-all">(all)</a>';
                echo '<a href="'.$href.'" class="test-set-group-name">' . htmlentities($name) . '</a>';
            } else {
                echo '<a href="'.$hrefAll.'" class="test-set-group-all">(all)</a>';
                echo '<span class="test-set-group-name selected">' . htmlentities($name) . '</span>';
                echo '<div class="test-set-group">';
                $currentTestName .= $name . " / ";
                $currentDirPath = $listItemPath;
                outputDir($listItemPath, $listItem);
                echo '</div>';
            }
        } elseif (substr($listItem, strlen($listItem) - 3) == ".js") {
            $name = substr($name, 0, strlen($name) - 3);
            if ($listItem == $currentTest) {
                $currentTestPath = $listItemPath;
                $currentTestName .= $name;
                echo '<span class="test-set selected">' . htmlEntities($name) . '</span>';
            } else {
                $href = "?test=".urlencode($listItem);
                echo '<a href="'.$href.'" class="test-set">' . htmlEntities($name) . '</a>';
            }
        }
    }
}

function includeFile($filename) {
	echo("\n/***** $filename *****/\n");
	echo("(function () {\n");
	readfile($filename);
	echo("\n})();\n");
}

function includeDir($directory) {
	$list = scandir($directory);
	foreach ($list as $listItem) {
		if ($listItem[0] == ".") {
			continue;
		}
		if (is_dir($directory.$listItem)) {
			includeDir($directory.$listItem."/");
		} elseif (substr($listItem, strlen($listItem) - 3) == ".js") {
			includeFile($directory.$listItem);
		}
	}
}

?>
<html>
  <head>
    <title>Testing</title>
    <link rel="stylesheet" href="page.test.css" />
  </head>
  <body>
  	<table cellspacing=0 cellpadding=0 id="main">
  		<tr>
  			<td id="test-set-cell">
    <div id="test-set-list">
    <?php
        outputDir(TEST_START_DIR);
    ?>
    </div>
    </td>
    <td rowspan=2 id="results-pane">
	<h1><?php echo $currentTestName ?></h1>
    <div id="test-container">
    </div>
    <script src="js/jquery.js"></script>
    <script src="../tv4.js.php"></script>
    <script src="js/test-set.js"></script>
    <script src="js/render.test-set.js"></script>
    <?php
        echo '<script>
                var tests = new TestSet();';
        if ($currentDirPath == NULL && $currentTest == "") {
        	$currentDirPath = TEST_START_DIR;
        }
        if ($currentTestPath !== NULL) {
        	includeFile($currentTestPath);
        } elseif ($currentDirPath !== NULL && isset($_REQUEST["all"])) {
        	includeDir($currentDirPath);
        }
        echo '
              renderTestSet(tests, $(\'#test-container\'));
              tests.run(1, true);
            </script>';
    ?>
    </td>
    </tr>
    </table>
  </body>
</html>
