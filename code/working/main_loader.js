// Load code from an URL and run it right away, thanks to Phenx
function load(url) {
    var s = document.querySelector("script[data-url='"+url+"']");
    
    if (s) {
        s.parentNode.removeChild(s);
    }
    
    s = document.createElement("script");
    s.setAttribute("data-url", url);
    s.src = url+"?"+((new Date()).getTime());
    
    document.getElementsByTagName("head")[0].appendChild(s);    
}

// Reload code regularly
setInterval(function(){
    load("https://www.alogh.com/Adventure.Land/code/working/sub_loader.js");
}, 1000);