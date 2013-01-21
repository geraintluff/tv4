  function renderTestSet(testSet, resultsContainer) {
    var resultsTable = $('<table class="test-results-table" cellspacing=10 cellpadding=0></table>').appendTo(resultsContainer);
    for (var i = 0; i < testSet.tests.length; i++) {
      (function(test) {
        var testRow = $('<tr class="test-running"><td class="test-name">' + test.name + '</td></tr>').appendTo(resultsTable);
        var resultCell = $('<td class="test-result"></td>').appendTo(testRow);
        var detailCell = $('<td class="test-detail"></td>').appendTo(testRow);
        test.onRun(function() {
          resultCell.text("Running...");
        }).onPass(function() {
          resultCell.text("Passed");
          detailCell.text(test.durationMillis + "ms");

          testRow.removeClass("test-running");
          testRow.addClass("test-passed");
        }).onFail(function(reason) {
          resultCell.text("Failed");
          detailCell.text(reason);
          resultCell.click(function() {
            alert(JSON.stringify(reason, null, 4));
          });
          testRow.removeClass("test-running");
          testRow.addClass("test-failed");
        });
      })(testSet.tests[i]);
    }
  }

