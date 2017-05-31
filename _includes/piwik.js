{% if site.github.hostname == 'github.com' %}
  {% assign trackingServer = "https://track.ebs-platform.com/" %}  
  {% assign network = '["www.barschool.net","www.barschool.es","www.barschool.fi","www.barschool.net.au","www.bartenderschool.fr","www.bartenderschool.ie","www.bartenderschool.in","www.bartenderschool.it","www.bartenderschool.nl","www.bartenderschule.com","www.bartenderskolan.com","www.bartenderskolen.com","www.bartenderskolen.dk","www.ebsbarschools.com","booking.ebs-platform.com","fast.wistia.net"]' %}
{% else %}
  {% assign trackingServer = "http://trackstaging.ebs-platform.com/" %}
  {% assign network = '["www-barschool-net.barschool.staging.wpengine.com","www-barschool-es.barschool.staging.wpengine.com","www-barschool-fi.barschool.staging.wpengine.com","www-barschool-net-au.barschool.staging.wpengine.com","www-bartenderschool-fr.barschool.staging.wpengine.com","www-bartenderschool-ie.barschool.staging.wpengine.com","www-bartenderschool-in.barschool.staging.wpengine.com","www-bartenderschool-it.barschool.staging.wpengine.com","www-bartenderschool-nl.barschool.staging.wpengine.com","www-bartenderschule-com.barschool.staging.wpengine.com","www-bartenderskolan-com.barschool.staging.wpengine.com","www-bartenderskolen-com.barschool.staging.wpengine.com","www-bartenderskolen-dk.barschool.staging.wpengine.com","www-ebsbarschools-com.barschool.staging.wpengine.com","booking.ebs-platform.com","fast.wistia.net"]' %}
{% endif %}

var _paq = _paq || [];
var _env = "{{ trackingServer }}";
_paq.push(["setDocumentTitle", document.title.replace(' - European Bartender School', '')]);
_paq.push(["setDomains", {{ network }} ]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
_paq.push(['enableCrossDomainLinking']);
(function() {
  var u= _env;
  _paq.push(['setTrackerUrl', u+'piwik.php']);
  _paq.push(['setSiteId', '1']);
  _paq.push(['enableHeartBeatTimer']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
})();