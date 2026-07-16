function fnSlideSearchPattern() {
    var $frame = $('#search_pattern');
    var $slidee = $frame.children('ul').eq(0);
    var $wrap = $frame.parent();
    $frame.sly({
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        pagesBar: $wrap.find('.pages'),
        activatePageOn: 'click',
        speed: 300,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
        prevPage: $wrap.find('.prevPage'),
        nextPage: $wrap.find('.nextPage')
    });
    $wrap.find('.toStart').on('click', function() {
        var item = $(this).data('item');
        $frame.sly('toStart', item);
    });
    $wrap.find('.toCenter').on('click', function() {
        var item = $(this).data('item');
        $frame.sly('toCenter', item);
    });
    $wrap.find('.toEnd').on('click', function() {
        var item = $(this).data('item');
        $frame.sly('toEnd', item);
    });
    $wrap.find('.add').on('click', function() {
        $frame.sly('add', '<li>' + $slidee.children().length + '</li>');
    });
    $wrap.find('.remove').on('click', function() {
        $frame.sly('remove', -1);
    });
}

function fnSlideSearchColor() {
    var $frame = $('#search_color');
    var $slidee = $frame.children('ul').eq(0);
    var $wrap = $frame.parent();
    $frame.sly({
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        pagesBar: $wrap.find('.pages'),
        activatePageOn: 'click',
        speed: 300,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
        prevPage: $wrap.find('.prevColor'),
        nextPage: $wrap.find('.nextColor')
    });
    $wrap.find('.toStart').on('click', function() {
        var item = $(this).data('item');
        $frame.sly('toStart', item);
    });
    $wrap.find('.toCenter').on('click', function() {
        var item = $(this).data('item');
        $frame.sly('toCenter', item);
    });
    $wrap.find('.toEnd').on('click', function() {
        var item = $(this).data('item');
        $frame.sly('toEnd', item);
    });
    $wrap.find('.add').on('click', function() {
        $frame.sly('add', '<li>' + $slidee.children().length + '</li>');
    });
    $wrap.find('.remove').on('click', function() {
        $frame.sly('remove', -1);
    });
};

function fnSlideSearchPatternSp() {
    var $frame = $('#search_pattern_sp');
    var $slidee = $frame.children('ul').eq(0);
    var $wrap = $frame.parent();
    $frame.sly({
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        pagesBar: $wrap.find('.pages'),
        activatePageOn: 'click',
        speed: 300,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
        prevPage: $wrap.find('.prevPage_sp'),
        nextPage: $wrap.find('.nextPage_sp')
    });
    $wrap.find('.toStart').on('click', function () {
        var item = $(this).data('item');
        $frame.sly('toStart', item);
    });
    $wrap.find('.toCenter').on('click', function () {
        var item = $(this).data('item');
        $frame.sly('toCenter', item);
    });
    $wrap.find('.toEnd').on('click', function () {
        var item = $(this).data('item');
        $frame.sly('toEnd', item);
    });
    $wrap.find('.add').on('click', function () {
        $frame.sly('add', '<li>' + $slidee.children().length + '</li>');
    });
    $wrap.find('.remove').on('click', function () {
        $frame.sly('remove', -1);
    });
}

function fnSlideSearchColorSp() {
    var $frame = $('#search_color_sp');
    var $slidee = $frame.children('ul').eq(0);
    var $wrap = $frame.parent();
    $frame.sly({
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        pagesBar: $wrap.find('.pages'),
        activatePageOn: 'click',
        speed: 300,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
        prevPage: $wrap.find('.prevColor_sp'),
        nextPage: $wrap.find('.nextColor_sp')
    });
    $wrap.find('.toStart').on('click', function () {
        var item = $(this).data('item');
        $frame.sly('toStart', item);
    });
    $wrap.find('.toCenter').on('click', function () {
        var item = $(this).data('item');
        $frame.sly('toCenter', item);
    });
    $wrap.find('.toEnd').on('click', function () {
        var item = $(this).data('item');
        $frame.sly('toEnd', item);
    });
    $wrap.find('.add').on('click', function () {
        $frame.sly('add', '<li>' + $slidee.children().length + '</li>');
    });
    $wrap.find('.remove').on('click', function () {
        $frame.sly('remove', -1);
    });
};
