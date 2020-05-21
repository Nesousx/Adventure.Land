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
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/Main.js");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/sub_loader.js");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/helperFunctions.js");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/evadeTarget.js");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/merchantSkills.js");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/mageSkills.js");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/priestSkills.js");
    load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/rangerSkills.js");
    //load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/followLead.js");
    //load("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/farmAssist.js");
}, 1000);