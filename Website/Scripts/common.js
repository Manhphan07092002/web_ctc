function showSpinLoading() {
    $(".waiting-spin-content").css({ "display": "block" });
}

function hideSpinLoading() {
    $(".waiting-spin-content").css({ "display": "" });
}

function showError(title, message) {
    swal(
        title,
        message,
        'error'
    )
}

function showSuccess(title, message) {
    swal(
        title,
        message,
        'success'
    )
}

function showWarning(title, message) {
    swal(
        title,
        message,
        'warning'
    )
}

function showConfirm(title, message, callBackYes, callBackNo) {

    swal({
        title: title,
        text: message,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonClass: 'btn btn-success btn-medium margin-rigth10px',
        cancelButtonClass: 'btn btn-danger btn-medium',
        buttonsStyling: false
    }).then(function () {
        callBackYes();
    }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
            callBackNo();
        }
    })
}


function showConfirmParam(title, message, callBackYes, callBackNo, param) {
    swal({
        title: title,
        text: message,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true
    }).then(function () {
        if (typeof (param) != 'undefined') {
            callBackYes(param);
        }
        else {
            callBackYes();
        }
    }, function (dismiss) {

        if (dismiss === 'cancel') {
            callBackNo();
        }
    });
}

function NoCallAction() {
}

$(document).ready(function () {
    /*chuyển có dấu thành ko dấu*/
    $(".nounicode").on({
        keydown: function (e) {
            if (e.which === 32)
                return false;

        },
        keyup: function (e) {
            var str = this.value;
            str = str.replace(/\s/g, "");
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/Đ/g, "D");
            str = str.replace(/\!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
            str = str.replace(/-+-/g, "-");
            str = str.replace(/^\-+|\-+$/g, "");
            this.value = str;
        }
    });

    /*chuyển có dấu thành ko dấu*/
    $(".nospecialcharacter").on({
        //keydown: function (e) {
        //    if (e.which === 32)
        //        return false;

        //},
        keyup: function (e) {
            var str = this.value;
            //str = str.replace(/\s/g, "");
            str = str.replace(/\!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|$|_/g, "-");
            str = str.replace(/-+-/g, "-");
            str = str.replace(/^\-+|\-+$/g, "");
            this.value = str;
        }
    });
});

//Convert /date(...)/ to datetime
function convertDatetime(input, fullDateTime, ampm, format, showsecond) {
    if (format == null || format == "") {
        format = 'dmy';
    }

    if (showsecond == null)
        showsecond = false;

    if (input == null || input == "")
        return "";
    var time = "";
    var value = new Date(parseInt(input.replace(/(^.*\()|([+-].*$)/g, '')));
    var day = value.getDate() > 9 ? value.getDate() : "0" + value.getDate();
    var month = (value.getMonth() + 1) > 9 ? (value.getMonth() + 1) : "0" + (value.getMonth() + 1);
    var year = value.getFullYear();

    var gio = value.getHours();
    if (ampm) {
        var time = gio >= 12 ? 'PM' : 'AM';
        gio = gio % 12;
        gio = gio ? gio : 12;
    }
    var hour = gio > 9 ? gio : "0" + gio;
    var minute = value.getMinutes() > 9 ? value.getMinutes() : "0" + value.getMinutes();
    var second = value.getSeconds() > 9 ? value.getSeconds() : "0" + value.getSeconds();

    var result = "";
    if (format == "dmy") {
        result = day + "/" + month + "/" + year;
    } else if (format == "mdy") {
        result = month + "/" + day + "/" + year;
    } else if (format == "ddmm") {
        result = day + "/" + month;
    }
    else {
        result = year + "/" + month + "/" + day;
    }

    if (fullDateTime) {
        if (ampm)
            return result + " " + hour + ":" + minute + (showsecond ? (":" + second) : "") + " " + time;
        return result + " " + hour + ":" + minute + (showsecond ? (":" + second) : "");
    }
    return result;
}

function convertDatetimeNotYear(input, fullDateTime, ampm, format) {
    if (format == null || format == "") {
        format = 'dmy';
    }

    if (input == null || input == "")
        return "";
    var time = "";
    var value = new Date(parseInt(input.replace(/(^.*\()|([+-].*$)/g, '')));
    var day = value.getDate() > 9 ? value.getDate() : "0" + value.getDate();
    var month = (value.getMonth() + 1) > 9 ? (value.getMonth() + 1) : "0" + (value.getMonth() + 1);
    var year = value.getFullYear();

    var gio = value.getHours();
    if (ampm) {
        var time = gio >= 12 ? 'PM' : 'AM';
        gio = gio % 12;
        gio = gio ? gio : 12;
    }
    var hour = gio > 9 ? gio : "0" + gio;
    var minute = value.getMinutes() > 9 ? value.getMinutes() : "0" + value.getMinutes();
    var result = "";
    if (format == "dmy") {
        result = day + "/" + month;
    } else if (format == "mdy") {
        result = month + "/" + day;
    } else {
        result = year + "/" + month;
    }



    if (fullDateTime) {
        if (ampm)
            return result + " " + hour + ":" + minute + " " + time;
        return result + " " + hour + ":" + minute;
    }
    return result;
}

//DMY==> YMD
function reformatDateString(s, splitstr) {
    if (s == null || s == "")
        return "";
    if (splitstr == null) {
        splitstr = '-';
    }
    var b = s.split(/\D/);
    return b.reverse().join(splitstr);
}

function formatNumber(nStr) {
    if (nStr == null)
        return 0;
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function setMoneyTextBox(selector, callBackChange) {
    //$(selector).inputmask("decimal", {
    //    radixPoint: ".",
    //    groupSeparator: ",",
    //    digits: 2,
    //    autoGroup: true,
    //    rightAlign: true,
    //    oncleared: function () { $(this).val('0'); }
    //});
    $(selector).css("text-align", "right");
    $(selector).autoNumeric('init', { currencySymbol: '', decimalPlacesOverride: 0, showWarnings: false });



    $(selector).change(function () {
        var value = $(this).val();
        var Re = new RegExp("\\,", "g");
        value = value.replace(Re, "");
        if (value == "") {
            value = 0;
        }
        $(this).next().val(value);

    });

}

function setMoneyTextBoxAllign(selector, allignright) {
    $(selector).inputmask("decimal", {
        radixPoint: ".",
        groupSeparator: ",",
        digits: 2,
        autoGroup: true,
        rightAlign: allignright,
        oncleared: function () { $(this).val('0'); }
    });



    $(selector).change(function () {
        var value = $(this).val();
        var Re = new RegExp("\\,", "g");
        value = value.replace(Re, "");
        $(this).next().val(value);

    });

}

function ConvertMoneyToNumber(value) {
    var Re = new RegExp("\\,", "g");
    value = value.replace(Re, "");
    return parseFloat(value);
}
function print(url) {
    console.log(url);
    var iframe = this._printIframe;
    if (!this._printIframe) {
        iframe = this._printIframe = document.createElement('iframe');
        document.body.appendChild(iframe);

        iframe.style.display = 'none';
        iframe.onload = function () {
            setTimeout(function () {
                iframe.focus();
                iframe.contentWindow.print();
            }, 1);
        };
    }

    iframe.src = url;
}
function formatDefaultSQLDate(value) {
    var ngay = value.getDate();
    if (ngay < 10) {
        ngay = '0' + ngay;
    }
    var thang = value.getMonth() + 1;
    if (thang < 10) {
        thang = '0' + thang;
    }
    var nam = value.getFullYear();

    return nam + '-' + thang + '-' + ngay;
}


function setIcheck(input, changeInput, valueTrue, valueFalse, callback) {
    $(input).iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });
    $(input).on('ifChecked', function (event) {
        if (typeof changeInput != 'undefined') {
            if (typeof valueTrue != 'undefined') {
                $(changeInput).val(valueTrue);
            } else {
                $(changeInput).val("True");
            }

        }
        if (typeof callback != 'undefined') {
            callback(true, event);
        }

    });

    $(input).on('ifUnchecked', function (event) {
        if (typeof changeInput != 'undefined') {
            if (typeof valueFalse != 'undefined') {
                $(changeInput).val(valueFalse);
            } else {
                $(changeInput).val("False");
            }

        }
        if (typeof callback != 'undefined') {
            callback(false, event);
        }
    });

}


function arrayToString(arr) {
    var select = "";
    var stausID = "";
    for (var i = 0; i < arr.length; i++) {
        if (stausID == "") {
            stausID += arr[i];
        }

        else {
            stausID += "," + arr[i];
        }
    }
    return stausID;
}

function onSearchDelay(id, fn) {
    var keytime = new Date();
    $(id).keyup(function () {
        keytime = new Date();
        setTimeout(function () {
            var current = new Date();
            var dif = current - keytime;
            if (dif > 500) {
                fn(id);
            }
        }, 700);
    });
}

function enterSearch(selector, functionInput) {
    $(selector).keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $(selector).val($.trim($(selector).val()));
            functionInput();
        }
    });
}

function imgDefault(image) {
    image.onerror = "";

    //image.src = "/Content/Image/noimage.png";
    return true;
}

function tinymceOption(selector) {
    return {
        forced_root_block: "",
        selector: selector,
        height: 150,
        theme: 'modern',
        plugins: [
          'advlist autolink lists link image charmap print preview hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code fullscreen',
          'insertdatetime media nonbreaking save table contextmenu directionality',
          'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
        ],
        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor',
        image_title: true,
        image_description: true,
        image_caption: true,

        content_css: [
          '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
          '//www.tinymce.com/css/codepen.min.css'
        ],

        file_picker_callback: function (callback, value, meta) {
            //// Provide file and text for the link dialog
            //if (meta.filetype == 'file') {
            //    callback('mypage.html', {text: 'My text'});
            //}

            //// Provide image and alt text for the image dialog
            //if (meta.filetype == 'image') {
            //    callback('myimage.jpg', {alt: 'My alt text'});
            //}

            //// Provide alternative source and posted for the media dialog
            //if (meta.filetype == 'media') {
            //    callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
            //}
            tinymceFileCallBack = callback;
            tinymce.activeEditor.windowManager.open({
                title: 'Chọn file',
                url: 'http://' + window.location.host + '/filepicker/index?callback=tinymceFileCallBack&&tinymce=1',
                width: 1000,
                height: 600
            }, {
                arg1: 42,
                arg2: 'Hello world'
            });
        }
    }
}
