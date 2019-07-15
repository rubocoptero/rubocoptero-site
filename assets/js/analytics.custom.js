if (window.location.search.indexOf("internal") != -1) {
    setInternalTrafficCookie();
}

if (isProduction()) {
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', 'UA-37428382-2', 'auto');


    ga('require', 'eventTracker');
    ga('require', 'outboundLinkTracker');
    ga('require', 'maxScrollTracker');

    ga('send', 'pageview');
}

function isProduction() {
    return getDomain(window.location.host) === getDomain('{{site.url}}');

    function getDomain(url, subdomain) {
        subdomain = subdomain || false;

        url = url.replace(/(https?:\/\/)?(www.)?/i, '');

        if (!subdomain) {
            url = url.split('.');

            url = url.slice(url.length - 2).join('.');
        }

        if (url.indexOf('/') !== -1) {
            return url.split('/')[0];
        }

        return url;
    }
}

function setInternalTrafficCookie() {
    setCookie("InternalTraffic", "true", 365, "rubocoptero.com");

    function setCookie(cname, cvalue, exdays, cdomain) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/ ; domain=" + cdomain;
    }
}