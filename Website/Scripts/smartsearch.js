
var checkedRadio;
var screenwidth = window.innerWidth;
var checkloadSmartSearch = 0;


function rC(e, cate) {


    $('.product_filter' + cate + " .result_search").html("");

    //$(".loadmore" + cate).html('<img id="loadmoreSmartSearch' + cate + '" src="../../Content/Image/WebImage/loader.gif" />');
    $("#smartsearch_form" + cate + " [name=pageNo]").val(0);
    $("#product_list_container" + cate).html("");
    if (window.innerWidth < 768) {
        $(".searchExtracontent_item_content").css({ "display": "none" });
    }


    //var top_filter = $('.header3').height;

    //debugger;
    var filtercontainer = "product_filter" + cate;
    ////$('.content_' + filtercontainer).css({
    ////    'position': '',
    ////    'margin-top': '',
    ////    'width': '',
    ////    'height': '',
    ////    'top': '',
    ////    // 'bottom':'0 !important',

    ////});
    var contentheight = $(".btnLoad_" + cate).offset().top;


    $('html,body').stop().animate({ scrollTop: 0 }, 100);



    fnSmartSearch(cate);
}




function fnSmartSearch(cate) {

   
    var productcontainer = "product_list_container" + cate;
    var filtercontainer = "product_filter" + cate;
    $("." + productcontainer + " .waiting-filter-product").css({ "display": "block" });
    setValueSmartSearch(cate);
    var fd = new FormData(document.getElementById("smartsearch_form" + cate));

    $.ajax({
        type: "POST",
        url: '/WProducts/SmartSearchProducts',
        data: fd,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (data) {
            //$('.content_' + filtercontainer).css({
            //    'position': '',
            //    'top': '0',
            //});
            $("." + productcontainer + " .waiting-filter-product").css({ "display": "none" });
            $('#product_list_container' + cate).html(data);






            //$('.' + filtercontainer).css({ 'left': '' });
            //$('.' + filtercontainer).removeClass("active_scroll");

            //$('.content_' + filtercontainer).css({
            //    'position': '',
            //    'top': '',
            //    'margin-top': '',
            //    'height': '',

            //});

            $('#loadmore' + cate).css({ 'display': 'none' });

            ScrollFilter(cate);


            // ScrollPatternColor(cate);

            //curSmartPage = parseInt(curSmartPage) + 1;
            //$("#smartsearch_form [name=pageNo]").val(curSmartPage);
        }
    });


}
redirect(true);

function redirect(check) {
    //debugger;
    var arrCondition = [];
    $("input[type=checkbox]:checked").each(function () {
        arrCondition.push($(this).val());
    });
    $("input[type=radio]:checked").each(function () {
        arrCondition.push($(this).val());
    });
    var lstcr = "";
    if (check == false) {
        var lstcr = arrCondition.toString();
    }
    else {
        var lstcr = "";
    }
    $.ajax({
        type: "POST",
        url: '/WProducts/UpdateCurrentCondition',
        data: { lst: lstcr },

        success: function (data) {

            //  alert(data.Code);


        }
    });
}
function setValueSmartSearch(cate) {


        initSmartSearchValuePC(cate);
        var filtercontainer = "product_filter" + cate;
        var productcontainer = "product_list_container" + cate;
        var ct_fil_h = $('.content_' + filtercontainer).height();
        $('.' + filtercontainer).css({

            'min-height': ct_fil_h + 'px',

        });
        $('.' + productcontainer).css({

            'min-height': ct_fil_h + 'px',

        });

}

function initSmartSearchValuePC(cate) {

    var arrCondition = [];
    var arrCategory = [];

    var arrSize = [];
    var arrMaterial = [];
    var arrStyle = [];
    var arrDrapSpecification = [];
    var arrBlanketSpecification = [];
    var arrMaker = [];

    var arrPrice = [];

    var arrOrderBy = [];

    var arrMattressType = [];

    var arrPatern = [];
    var arrColor = [];

    var arrDecorColor = [];
    var arrDecorMatterial = [];
    var arrThickness = [];
    //Danh mục

    $('.product_filter' + cate + " input:radio[name=search_cate]:checked").each(function () {
        arrCategory.push($(this).val());
        arrCondition.push($(this).val());
        $(this).parents(".searchExtracontent_item").find(".result_search").append('<p class="crResult"><a class="lblSearchNo" href="javascript:;"><span>' + $(this).attr("title") + ' <\/span></a><a style="float:right;padding:8px 0;" href="' + $(this).attr("parentUrl") + '" onclick="DeleteCategory(this,\'' + $(this).val() + '\',\'search_cate\',\'' + cate + '\');">' + "<img src='/Content/Image/WebImage/remove.png'/></a></p>");

    });




    //Màu
    $('.product_filter' + cate + " input:checkbox[name=search_color]:checked").each(function () {
        arrColor.push($(this).val());
        arrCondition.push($(this).val());
        $(this).parents(".searchExtracontent_item").find(".result_search").append('<p class="crResult"><a class="lblSearchColor" href="javascript:;"><span style="background-color:' + $(this).attr("color") + '">&nbsp;&nbsp; <\/span></a><a style="float:right;padding:8px 0;" href="javascript:;" onclick="DeleteFilter(this,\'' + $(this).val() + '\',\'search_color\',\'' + cate + '\');">' + "<img src='/Content/Image/WebImage/remove.png'/></a></p>");
        //$('.product_filter' + cate + " .result_search").append('<a class="result_text" href="javascript:;" onclick="DeleteFilter(this,\'' + $(this).val() + '\',\'check7\',\'' + cate + '\');">' + $(this).attr("title") + " <i class='fa fa-times bt_close' aria-hidden='true'></i><\/a>");
    });

    $("#Color").val(arrColor.toString());



    //Size
    $('.product_filter' + cate + " input:checkbox[name=search_size]:checked").each(function () {
        arrSize.push($(this).val());
        arrCondition.push($(this).val());

        $(this).parents(".searchExtracontent_item").find(".result_search").append('<p class="crResult"><a class="lblSearchBorder" href="javascript:;"><span>' + $(this).attr("title") + ' <\/span></a><a style="float:right;padding:8px 0;" href="javascript:;" onclick="DeleteFilter(this,\'' + $(this).val() + '\',\'search_size\',\'' + cate + '\');">' + "<img src='/Content/Image/WebImage/remove.png'/></a></p>");

        // $('.product_filter' + cate + " .result_search").append('<a class="result_text" href="javascript:;" onclick="DeleteFilter(this,\'' + $(this).val() + '\',\'search_size\',\'' + cate + '\');">' + $(this).attr("title") + " <i class='fa fa-times bt_close' aria-hidden='true'></i><\/a>");
    });

    $("#smartsearch_form" + cate + " #Size").val(arrSize.toString());


    //Giá
    $('.product_filter' + cate + " input:checkbox[name=search_price]:checked").each(function () {
        arrPrice.push($(this).val());
        arrCondition.push($(this).val());
        $(this).parents(".searchExtracontent_item").find(".result_search").append('<p class="crResult"><a class="lblSearchNo" href="javascript:;"><span>' + $(this).attr("title") + ' <\/span></a><a style="float:right;padding:8px 0;" href="javascript:;" onclick="DeleteFilter(this,\'' + $(this).val() + '\',\'search_price\',\'' + cate + '\');">' + "<img src='/Content/Image/WebImage/remove.png'/></a></p>");

        // $('.product_filter' + cate + " .result_search").append('<a class="result_text" href="javascript:;" onclick="DeleteFilter(this,\'' + $(this).val() + '\',\'search_price\',\'' + cate + '\');">' + $(this).attr("title") + " <i class='fa fa-times bt_close' aria-hidden='true'></i><\/a>");
    });

    $("#smartsearch_form" + cate + " #Price").val(arrPrice.toString());

    //Order
    $('.product_filter' + cate + " input:radio[name=search_order]:checked").each(function () {
        arrOrderBy.push($(this).val());
    });

    $("#smartsearch_form" + cate + " #OrderBy").val(arrOrderBy.toString());

  



    var lst = arrCondition.toString();

    if (arrCondition.length > 0) {
        // $('.product_filter' + cate + " .result_search").append('<a class="deleteAll_text" href="javascript:;" onclick="DeleteAllFilter(this,\'' + cate + '\')"> Xóa tất cả <i class="fa fa-times bt_close" aria-hidden="true"></i><\/a>');
    }
}

function modifyInputSearch(cate, isCheck, val, hidden) {
    //debugger;
    var current = $("#smartsearch_form" + cate + " [name=" + hidden + "]").val();
    current = current + ",";
    if (isCheck) {
        if (current.indexOf(val + ",") < 0) {
            current = current + val;
        }
    } else {
        current = current.replace(val + ",", "");
    }
    if (current.startsWith(","))
        current = current.substring(1, current.length);
    if (current.endsWith(","))
        current = current.substring(0, current.length);

    $("#smartsearch_form" + cate + " [name=" + hidden + "]").val(current);

    rC(this, cate);
}

function getUrlParameter(name) {
    
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function loadMoreSmartSearch(cate) {
   
    var productcontainer = "product_list_container" + cate;
    var curSmartPage = $("#smartsearch_form" + cate + " [name=pageNo]").val() * 1;
    curSmartPage = curSmartPage + 1;

    $("#smartsearch_form" + cate + " [name=pageNo]").val(curSmartPage);
    $('#btnLoadMore' + cate).button('loading')

    var fd = new FormData(document.getElementById("smartsearch_form" + cate));

    var infoPara = getUrlParameter('vendor');
    if (infoPara == null) {
        var info = $("#txtSearch").val();
        fd.append("SearchKey", info);
    }
    else {
        $("#txtSearch").val('');
    }
    $("." + productcontainer + " .waiting-filter-product").css({ "display": "block" });
   
    $.ajax({
        type: "POST",
        url: '/WProducts/SmartSearchProducts',
        data: fd,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (data) {
            $("." + productcontainer + " .waiting-filter-product").css({ "display": "none" });
            $('#product_list_container' + cate).append(data);

            $("." + productcontainer + ' img[data-alt-src]').each(function () {
                new Image().src = $(this).data('alt-src');
            }).hover(sourceSwap, sourceSwap);

            ScrollFilter(cate);

        }
    });

}



function DeleteFilter(e, value, inputname, cate) {

    value = value.replace(/\s/g, '');
    $(".product_filter" + cate + " [name=" + inputname + "][value=" + value + "]").prop("checked", false);
    $("#smart_search_display_form [name=" + inputname + "][value=" + value + "]").prop("checked", false);
    rC(e, cate);




}


function DeleteAllFilter(e, cate) {
    $(".product_filter" + cate + " .filterProduct_smartPhone input[type=checkbox]").iCheck('uncheck');
    $(".product_filter" + cate + " .filterProduct_smartPhone input[type=radio]").iCheck('uncheck');
    $(".product_filter" + cate + " .filterProduct_content input[type=checkbox]").prop("checked", false);
    $("#smart_search_display_form input[type=checkbox]").prop("checked", false);

    rC(e, cate);
    ViewSearchResult();


}


function changeCategorySM(cate, containcate) {
    $("#smartsearch_form" + containcate + " #Category").val(cate);
    rC(this, containcate);
}

$(document).ready(function () {
    $(".hv_nav_product li").on('click', function () {
        $(".hv_nav_product li").removeClass('active');
        $(this).addClass('active');
    });
})

function ViewSearchResult() {
    $(".searchExtracontent_item_content").css({ "display": "" });
}







/*----------scroll filter-----------*/
function ScrollFilter(category) {

    var productcontainer = "product_list_container" + category;
    var filtercontainer = "product_filter" + category;




    var container = $(".list_product").width();
    var mainscreen = $(".container").width();
    var contentwidth = $('.' + productcontainer).width();
    var fullcontentwidth = contentwidth + $('.' + productcontainer).offset().left;
    var setleft = $(".container").offset().left + 'px';
    var setwidth = (mainscreen - contentwidth) + 'px';
    var setwidth2 = (mainscreen - contentwidth - 30) + 'px';
    var heightheader = $(".header3").height();
    var contentheight = $(".btnLoad_" + category).offset().top;
    var ct_fil_h = $('.content_' + filtercontainer).height();
    if (window.innerWidth > 767) {
        if (ct_fil_h < $('.' + productcontainer).height()-40) {
            $('.' + filtercontainer).addClass("active_scroll");


            if ($('.' + filtercontainer).length > 0) {
                $('.' + filtercontainer).css({ 'left': setleft, 'width': setwidth });

                var scroll = $(this).scrollTop();

              

                var filterheight = contentheight - ct_fil_h - heightheader;

                var height = ct_fil_h + 'px';

                $('.' + productcontainer).css({

                    'min-height': ct_fil_h + 'px',

                });
                $('#' + productcontainer).css({

                    'min-height': ct_fil_h + 'px',

                });
                //$('.' + filtercontainer).css({

                //    'min-height': ct_fil_h + 'px',

                //});

                var height2 = contentheight - ct_fil_h - $('.' + filtercontainer).offset().top + $(".btnLoad_" + category).height() + 'px';

               
                if (filterheight > 0) {

                    if (scroll < filterheight) {
                        
                        if (window.innerWidth > 1200) {
                            $('.content_' + filtercontainer).css({
                                'position': 'fixed',
                                'top': '0',
                                'margin-top': '188px',
                                'height': '',
                                'width': setwidth2,

                            });
                        }

                        else {

                            $('.content_' + filtercontainer).css({
                                'position': 'fixed',
                                'top': '0',
                                'margin-top': '225px',
                                'height': '',
                                'width': setwidth2,

                            });
                        }



                    }

                    else if (scroll >= filterheight) {
                      
                        $('.content_' + filtercontainer).css({
                            'position': 'absolute',
                            'margin-top': '0',
                            'width': setwidth2,
                            'height': '',
                            'top': height2,

                        });
                    }
                }
                else {
                    $('.content_' + filtercontainer).css({
                        'position': '',
                        'top': '',
                        'margin-top': '',
                        'height': '',
                        'width': '',
                       
                    });
                    $('.' + filtercontainer).css({
                        'padding-right': '0',

                    });
                }


            }
        }
        else if ((ct_fil_h > $('.' + productcontainer).height())) {
           
            $('.' + filtercontainer).removeClass("active_scroll");
            //$('.content_' + filtercontainer).css({ 'padding-right': '15px' });
            $('.content_' + filtercontainer).css({
                'position': '',
                'top': '',
                'margin-top': '',
                'height': '',
                'width': '',
               
            });
            $('.' + filtercontainer).css({
                'padding-right': '0',

            });
        }
    }
    else if (window.innerWidth < 768) {
        var sp_width = $('.' + filtercontainer).width() + 'px';
        if ($('.' + filtercontainer).length > 0) {
            var scroll = $(this).scrollTop();
            var contentheight = $(".btnLoad_" + category).offset().top - 150;
            if (scroll < $('.' + filtercontainer).offset().top - 58) {
                $('.content_' + filtercontainer).css({
                    'position': 'relative',
                    'margin-top': '0',
                    // 'top': '0'
                });
            }
            else if (scroll <= contentheight) {


                $('.content_' + filtercontainer).css({
                    'position': 'fixed',
                    'top': '0',
                    'margin-top': '70px',
                    //'background-color': 'white',
                    //'z-index': '2',
                    'width': sp_width,
                });

                $('.filter_drap .content_' + filtercontainer).css({
                    'position': 'fixed',
                    'top': '0',
                    'margin-top': '70px',
                    //'background-color': 'white',
                    //'z-index': '2',
                    'width': sp_width,
                });
            }

            else if (scroll > contentheight) {
                $('.content_' + filtercontainer).css({
                    'position': 'absolute',
                    'width': sp_width,
                    'margin-top': '0',

                });
            }

        }

    }

}

/*----------end scroll filter-----------*/

/*----------scroll pattern-color-----------*/

function ScrollPatternColor(category) {

    // if(showfilter == 1){
    var contentwidth = $("#smart_search_display_form").width();
    //  $(window).scroll(function(){

    var scroll = $(this).scrollTop();
    var contentheight = $(".btnLoadMoreContainer").offset().top;
    var searchheight = $('.search_condition').offset().top + $('.search_condition').height();

    if (window.innerWidth > 767) {
        if (scroll < $('#smart_search_display_form').offset().top - 50) {
            $('.search_condition').css({
                'position': 'relative',
                'padding': '',
                'margin-top': '',
                'z-index': '2',
                'top': '',
            });

        }
        else if (scroll <= contentheight) {

            $('.search_condition').css({
                'position': 'fixed',
                'top': '0',
                'margin-top': '58px',
                'width': contentwidth + 'px',
                'background-color': 'white',
                'padding': '20px 0 5px 0',
                'z-index': '10',

            });

        }
        else {

            $('.search_condition').css({
                'position': 'absolute',
                'top': '0',
                'width': contentwidth + 'px',
                'padding': '0',
                'z-index': '2',
            });
        }
    }
    else {
        // debugger;
        if (scroll < $('#main-column').offset().top - 55) {
            $('.smartSeart_container').css({
                'display': 'block'

            });
            //$("#filterProduct_smartPhone .filterProduct_sp").css({ "width": "355px" });
            $('#smartSearch_color_title').css({
                'display': 'none'

            });
            $('#smartSearch_pattern_title').css({
                'display': 'none',

            });

        }

        else if (scroll <= contentheight - 100) {
            //$(".filterProduct_sp").css({ "width": "750px" });
            $('#smartSearch_color_title').css({
                'display': 'inline-block',

            });
            $('#smartSearch_pattern_title').css({
                'display': 'inline-block',

            });
            $('.smartSeart_container').css({
                'display': 'none'

            });


        }
        else {

            $('.smartSeart_container').css({
                'display': 'none'

            });
        }
    }


}


/*----------end scroll pattern-color-----------*/