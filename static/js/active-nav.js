(function () {

    switch (window.location.pathname.split('/')[1]) {

        case 'about':

            document.getElementById("nav-about").className = "active";
            break;

        case 'story':

            document.getElementById("nav-story").className = "active";
            break;

        case '':

            document.getElementById("nav-map").className = "active";
            break;

        default:

            ''
    }

})();