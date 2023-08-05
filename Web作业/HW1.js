function scrollToViewMENU() {
    document.getElementsByClassName('third-box')[0].scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth'
    })
}

function scrollToViewABOUT() {
    document.getElementsByClassName("second-box")[0].scrollIntoView({
        behavior: "smooth"
    });
}
function scrollToViewEVENTS() {
    document.getElementsByClassName("table-box")[0].scrollIntoView({
        behavior: "smooth"
    });
}
function scrollToViewRESERVATIONS() {
    document.getElementsByClassName("table-box")[0].scrollIntoView({
        behavior: "smooth"
    });
}
function scrollToViewCONTACT() {
    document.getElementsByClassName("white-box")[0].scrollIntoView({
        behavior: "smooth"
    });
}
function displayTure() {
    document.getElementsByClassName("registry")[0].style.display = "block";
}
function signup() {
    alert("成功注册");
    document.getElementsByClassName("registry")[0].style.display = "none";
}
function returnto() {
    document.getElementsByClassName("registry")[0].style.display = "none";
}