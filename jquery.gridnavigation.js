/**
* @file jQuery collection plugin that implements the input and model for two-dimensional keyboard navigation
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.0.1
* @requires jquery
* @requires jquery-common-keydown
*/
(function($, window, document, undefined) {
    var pluginName = 'jquery-grid-navigation';

    /**
    * @method "jQuery.fn.gridNavigation"
    * @return {Object} chainable jQuery class
    */
    $.fn.gridNavigation = function gridNavigation(itemsSelector, options) {
        options = $.extend({
            clickDelegate: this,
            startCol: 0,
            startRow: 0
        }, options);

        return this.each(function onEachGridNavigationWidget() {
            var $widget = $(this);
            var currentCol = options.startCol;
            var currentRow = options.startRow;
            var $clickDelegate = $(options.clickDelegate);
            var $allItems = $widget.find(itemsSelector);
            var $rows = $allItems.first().parent().parent().children();
            var $cols = $rows.first().children();
            var numCols = $cols.length;
            var numRows = $rows.length;

            $allItems.each(function(idx, itm) {
                $.data(itm, pluginName, {index: idx});
            });

            var getCell = function(col, row) {
                return $rows.eq(row).children().eq(col).get(0);
            };

            var updateModel = function(goToCol, goToRow) {
                var currentCell = getCell(currentCol, currentRow);
                var goToCell = getCell(goToCol, goToRow);
                var currentCellData = $.data(getCell(currentCol, currentRow), pluginName);
                var goToCellData = $.data(getCell(goToCol, goToRow), pluginName);

                if (goToCol < 0 || goToCol >= numCols || goToRow < 0 || goToRow >= numRows) {
                    console.log('Out of bounds');
                } else {
                    $widget.trigger("gridNavigationChange", {
                        from: {cell: currentCell, col: currentCol, row: currentRow, index: currentCellData.index},
                        to: {cell: goToCell, col: goToCol, row: goToRow, index: goToCellData.index}
                    });
                    currentCol = goToCol;
                    currentRow = goToRow;
                }
            };

            var goToAboveItem = function(e) {
                updateModel(currentCol, currentRow - 1);
            };

            var goToBelowItem = function(e) {
                updateModel(currentCol, currentRow + 1);
            };

            var goToLeftItem = function(e) {
                updateModel(currentCol - 1, currentRow);
            };

            var goToRightItem = function(e) {
                updateModel(currentCol + 1, currentRow);
            };

            $widget.on('upArrowKeyDown', goToAboveItem);
            $widget.on('downArrowKeyDown', goToBelowItem);
            $widget.on('rightArrowKeyDown', goToRightItem);
            $widget.on('leftArrowKeyDown', goToLeftItem);

            // install commonKeyDown plugin to bound element
            $widget.commonKeyDown();

            // listen for click events on the click delegate
            $clickDelegate.on('click', itemsSelector, function(e) {
                var $this = $(this);

                console.log($.data(this));

                updateModel($this.index(), $this.parent().index());
            });
        });
    };
}(jQuery, window, document));

/**
* The jQuery plugin namespace.
* @external "jQuery.fn"
* @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
*/
