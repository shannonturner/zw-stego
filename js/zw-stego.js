/* zw.js */

var HIDDEN_ZERO = '​'; // Zero-width space
var HIDDEN_ONE = '‍'; // Zero-width non-joiner

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function zwDecode(string) {
    return string.replaceAll(HIDDEN_ZERO, '0').replaceAll(HIDDEN_ONE, '1')
}

function zwEncode(string) {
    return string.replaceAll('0', HIDDEN_ZERO).replaceAll('1', HIDDEN_ONE)
}

function str2bin(string){
    string = unescape(encodeURIComponent(string));
    var chr, out = '';
    for (var i=0; i<string.length; i++) {
        chr = string.charCodeAt(i).toString(2);
        while (chr.length % 8 != 0) {
            chr = '0' + chr; 
        }
        out += chr;
    }
    return out;
}

function bin2str(binary) {
    var chr, out = '';
    for (var i=0; i<binary.length; i+=8){
        chr = parseInt(binary.substr(i, 8), 2).toString(16);
        out += '%' + ((chr.length % 2 == 0) ? chr : '0' + chr);
    }
    return decodeURIComponent( out );
}

function hideMessage(secret) {
    return zwEncode(str2bin(secret));
}

function retrieveHiddenMessage(body) {
    secretMessage = [];

    for (var i=0; i<body.length; i++) {
        if (body[i] == HIDDEN_ZERO || body[i] == HIDDEN_ONE) {
            secretMessage.push(body[i]);
        }
    }
    return bin2str(zwDecode(secretMessage.join('')));
}

/* UI */
$('#nav-reveal-message').click(function() {
    $('.when-hiding').hide();
    $('.when-revealing').show();
})
$('#nav-hide-message').click(function() {
    $('.when-revealing').hide();
    $('.when-hiding').show();
})

$('.when-hiding').change(function() {
    $('#message-with-secret').val($('#message-body').val() + hideMessage($('#message-to-hide').val()));

    if ($('#message-with-secret').val().length > 0) {
        $('.result').show();
    }
});

$('.when-revealing').change(function() {
    revealedHiddenMessage = retrieveHiddenMessage($('#plainsight-message').val());

    if (revealedHiddenMessage.length > 0) {
        $('#revealed-hidden-message-helper').text('Hidden message found:');
        $('#revealed-hidden-message').text(revealedHiddenMessage);
    } else {
        $('#revealed-hidden-message-helper').text('No hidden message found.')
        $('#revealed-hidden-message').text('');
    }
});

$('#copy-to-clipboard').click(function() {
    clipboard.copy($('#message-with-secret').val()).then(function() {
        // Success; copied to clipboard
        $('#copy-to-clipboard').addClass('rainbow');
        $('#copy-to-clipboard').text('Copied!')
        setTimeout(function() {
            $('#copy-to-clipboard').removeClass('rainbow');
            $('#copy-to-clipboard').text('Copy to clipboard');
        }, 1000);
    }, function() {
        // Failed to copy to clipboard
        $('#copy-to-clipboard').addClass('btn-danger');
        $('#copy-to-clipboard').removeClass('btn-success');
        $('#copy-to-clipboard').text("Couldn't copy to clipboard - use Control + C");
        setTimeout(function() {
            $('#copy-to-clipboard').removeClass('btn-danger');
            $('#copy-to-clipboard').addClass('btn-success');
            $('#copy-to-clipboard').text('Copy to clipboard');
        });
    });
});

// Begin in Hide a Message Mode
$('#nav-hide-message').click();
$('.when-hiding.result').hide();