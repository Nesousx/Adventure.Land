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
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/sub_loader.js");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/helperFunctions");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/evadeTarget");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/merchantSkills");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/mageSkills");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/priestSkills");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/rangerSkills");
    //load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/followLead");
    //load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/farmAssist");
}, 1000);