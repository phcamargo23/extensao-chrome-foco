function getSelectedText() {
    var txt = '';
    if (window.getSelection) {
        txt = window.getSelection();
    } else if (document.getSelection) {
        txt = document.getSelection();
    } else if (document.selection) {
        txt = document.selection.createRange().text;
    }

    // console.log(txt.toString());
    return txt;
}

function createBalloon(selection) {
    var rect = selection.getRangeAt(0).getBoundingClientRect();
    var span = document.createElement("span");
    var tail = document.createElement("span");
    var loading = document.createElement("img");
    var content = document.createElement("span");

    /* Balloon Span */
    span.style.backgroundAttachment = "scroll";
    span.style.backgroundClip = "border-box";
    span.style.backgroundImage = "none";
    span.style.backgroundOrigin = "padding-box";
    span.style.boxShadow = "7px 7px 7px rgba(0, 0, 0, 0.3)";
    span.style.border = "2px solid #bd1e2c";
    span.style.borderTopColor = "rgb(1, 153, 241)";
    span.style.borderBottomColor = "rgb(120, 191, 35)";
    span.style.borderRightColor = "rgb(235, 147, 22)";
    span.style.borderLeftColor = "rgb(229, 35, 80)";
    span.style.borderRadius = "0px";
    span.style.cursor = "auto";
    span.style.display = "block";
    span.style.margin = "0px";
    span.style.padding = "10px";
    span.style.zIndex = "100000";
    span.style.background = "white";
    span.style.position = "absolute";
    span.style.height = "auto";
    span.style.width = "175px";
    span.style.right = "3px";
    span.style.whiteSpace = "pre-wrap";
    span.style.textAlign = "left";
    span.style.color = "black";
    span.style.font = "italic normal 12px Verdana, sans-serif;";
    span.style.left = (rect.left - 15) + "px";
    span.style.top = (rect.top + rect.height + window.pageYOffset + 11) + "px";

    /* Loading Image */
    // loading.src = chrome.extension.getURL("preloader.gif");
    loading.style.backgroundAttachment = "scroll";
    loading.style.backgroundClip = "border-box";
    loading.style.backgroundColor = "transparent";
    loading.style.backgroundImage = "none";
    loading.style.backgroundOrigin = "padding-box";
    loading.style.bordeStyle = "none";
    loading.style.border = "none";
    loading.style.color = "white";
    loading.style.cursor = "auto";
    loading.style.display = "block";
    loading.style.left = "auto";
    loading.style.lineHeight = "normal";
    loading.style.margin = "0px auto";
    loading.style.padding = "0px";
    loading.style.width = "12px";
    loading.style.height = "12px";
    loading.style.position = "static";
    loading.style.zIndex = "auto";

    /* Tail Image */
    tail.style.backgroundAttachment = "scroll";
    tail.style.backgroundClip = "border-box";
    tail.style.backgroundColor = "transparent";
    tail.style.backgroundImage = "none";
    tail.style.backgroundOrigin = "padding-box";
    tail.style.border = "none";
    tail.style.width = "0px";
    tail.style.height = "0px";
    tail.style.borderBottom = "10px solid rgb(1, 153, 241)";
    tail.style.borderLeft = "10px solid transparent";
    tail.style.borderRight = "10px solid transparent";
    tail.style.color = "white";
    tail.style.cursor = "auto";
    tail.style.display = "block";
    tail.style.fontFamily = "sans-serif";
    tail.style.fontSize = "12px";
    tail.style.fontStyle = "normal";
    tail.style.fontVariant = "normal";
    tail.style.fontWeight = "normal";
    tail.style.left = "-22px";
    tail.style.lineHeight = "normal";
    tail.style.margin = "0px";
    tail.style.outlineColor = "white";
    tail.style.outlineStyle = "none";
    tail.style.outlineWidth = "0px";
    tail.style.padding = "0";
    tail.style.position = "absolute";
    tail.style.right = "auto";
    tail.style.textAlign = "left";
    tail.style.left = "15px";
    tail.style.top = "-12px";
    tail.style.verticalAlign = "baseline";
    tail.style.zIndex = "auto";

    span.appendChild(content);
    span.appendChild(loading);
    span.appendChild(tail);
    document.body.appendChild(span);
    // span.addEventListener("click", function () {
    //     balloon.close();
    // }, false);

    var balloon = {
        setText: function (text) {
            span.removeChild(loading);
            content.innerHTML = text;
        },
        close: function () {
            span.parentNode.removeChild(span);
        }
    };

    return balloon;
}

$(document).bind('click dblclick', function(eventType) {
    // console.log(eventType.type);

    var selection = getSelectedText();

    // if(eventType.type == 'click' && selection.toString().length < 2) return true;

    if(selection.toString().length < 2){
        console.log('String pequena: '+selection.toString());
        return true;
    }

    var traducao = Translate.getTranslation(selection);

    if(Translate.idiomaDeOrigem(traducao)  != 'en'){
        console.log('Entrada não aceita: ' + JSON.stringify(traducao));
        return true;
    }

    var balloon = createBalloon(selection);
    balloon.setText(Translate.traducao(traducao));

    setTimeout(function() {
        balloon.close();
    }, 2000);

    chrome.storage.sync.get(function(items) {
      if(objIsEmpty(items)){
            chrome.storage.sync.set({'historico': []}, function() {
                console.log('Storage inicializado');
            });
      }else{
        items.historico.push(Translate.original(traducao));
        chrome.storage.sync.set(items, function(items2) {
            console.log('Novo registro armazenado')
        });
      }
    });

});