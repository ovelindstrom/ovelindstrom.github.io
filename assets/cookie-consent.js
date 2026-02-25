/**
 * Grants consent for Microsoft Clarity analytics and ad storage.
 * This function should be called when a user accepts the cookie policy.
 */
function acceptClarityCookies() {
  if (typeof window.clarity === 'function') {
    window.clarity('consentv2', {
      ad_Storage: "granted",
      analytics_Storage: "granted"
    });
    console.log("Clarity consent granted.");
    // Optional: Hide the cookie banner after consent is given
    document.getElementById('cookie-notice').style.display = 'none';
  } else {
    console.error("Clarity function not found.");
  }
}

/**
 * Denies consent for Microsoft Clarity analytics and ad storage.
 * This function should be called when a user denies the cookie policy.
 */
function denyClarityCookies() {
  if (typeof window.clarity === 'function') {
    window.clarity('consentv2', {
      ad_Storage: "denied",
      analytics_Storage: "denied"
    });
    console.log("Clarity consent denied.");
    // Optional: Hide the cookie banner after the choice is made
    document.getElementById('cookie-notice').style.display = 'none';
  } else {
    console.error("Clarity function not found.");
  }
}

function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

document.addEventListener('DOMContentLoaded', function() {
    if(readCookie('cookie-notice-dismissed')=='true') {
        
    } else {
        document.getElementById('cookie-notice').style.display = 'block';
    }
    
    document.getElementById('cookie-notice-accept').addEventListener("click",function() {
        createCookie('cookie-notice-dismissed','true',31);
        acceptClarityCookies();
        document.getElementById('cookie-notice').style.display = 'none';
        location.reload();
    });

    document.getElementById('cookie-notice-deny').addEventListener("click",function() {
        createCookie('cookie-notice-dismissed','true',31);
        denyClarityCookies();
        document.getElementById('cookie-notice').style.display = 'none';
        location.reload();
    });
});
