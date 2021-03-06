$(document).ready(function(){
  /*Forms*/
  $('.itl-phone').intlTelInput({
    autoPlaceholder: true,
    preferredCountries: ["au","dk","fi","fr","de","in","ie","it","nl","no","es","se","gb","us","ar","be","br","cl","gr","mx","pl","pt","ro","za","ch","ve"],
    geoIpLookup: function(callback) {
      $.get("//ipinfo.io", function() {}, "jsonp").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "gb";
        callback(countryCode);
      });
    },
    initialCountry: "auto",
  });

  /*Failed server-side validation, set number from post*/
  $('.post-itl-phone').each(function () {
    var target = $('#itl-phone', $(this).parent());
    target.intlTelInput("setNumber", $(this).val(), intlTelInputUtils.numberFormat.NATIONAL);
    $(this).prev().val( $(this).val() );
  });

  /*Keep target input in sync with widget, and clear validation error when valid*/
  $(".itl-phone").keyup(function() {
    var value = $(this).intlTelInput("getNumber");
    $('.itlPhoneFull').each(function(){
      $(this).val( value );
    });
    $('.itlPhoneFull', $(this).parents('form:first')).valid();
  });

  /*Format and sync on blur*/
  $(".itl-phone").blur(function() {
    var value = $(this).intlTelInput("getNumber");
    $('.itl-phone').each(function(){
      $(this).intlTelInput("setNumber", value, intlTelInputUtils.numberFormat.NATIONAL)
    })
  });

  /*Keep watching the inputs for change (browser autofill fix)*/
  setTimeout(function() {
    $('input').each(function() {
      var elem = $(this);
      if (elem.val()) elem.change();
    })
  }, 250);

  $('input:not(#itlPhoneFull)').change(function(){
    $(this).valid();
  });

  $('#itl-phone').change(function(){
    element = $(this).closest('form').find('#itlPhoneFull');
    phoneCountry = $(this).closest('form').find('#phone-country');
    element.val( $(this).intlTelInput("getNumber") );
    phoneCountry.val( $(this).intlTelInput("getSelectedCountryData").iso2 );
    element.valid();
  });

  /*Helper function to set validation messages from data-msg on inputs*/
  function getMsg(selector, context, type) {
    return $(selector, context).attr(type);
  };

  $('form').each(function(){
    var $this = this;
    $(this).validate({
      ignore: ":hidden:not(#itlPhoneFull)",
      rules: {
        firstname: {
          required: true,
        },
        lastname: {
          required: true,
        },
        email: {
          required: true,
          email: true,
          RFC2822Email: true,
          remote: {
            url: "/wp-content/themes/ebs-v2/check.php",
            type: "post",
            data: {
              "email-domain": function() {
                return $("#email").val();
              }
            }
          }
        },
        countrycode: {
          required: true,
        },
        itlPhoneFull: {
          required: true,
          phone_valid: true,
        }
      },
      messages: {
        firstname: getMsg('input[name="firstname"]', $this, 'data-msg'),
        lastname: getMsg('input[name="lastname"]', $this, 'data-msg'),
        email: {
          required: getMsg('input[name="email"]', $this, 'data-msg-required'),
          email: getMsg('input[name="email"]', $this, 'data-msg-format'),
          RFC2822Email: getMsg('input[name="email"]', $this, 'data-msg-format'),
          remote: getMsg('input[name="email"]', $this, 'data-msg-domain'),
        },
        countrycode: getMsg('input[name="countrycode"]', $this, 'data-msg-required'),
        itlPhoneFull: {
          required: getMsg('input[name="phone"]', $this, 'data-msg-required'),
          phone_valid: getMsg('#itlPhoneFull', $this, 'data-msg-valid'),
        },
      },
      errorPlacement: function(error, element) {
        error.appendTo( $('.validation-messages', $this) ).css("display", "block").addClass('sf-validation');
        if (typeof $.fn.matchHeight !== 'undefined'){
          $('.info-boxes__box').matchHeight();
        }
      },
      submitHandler: function(form) {
        var fields = {
          firstname: 		'First name',
          lastname: 		'Last name',
          email: 				'Email',
          itlPhoneFull: 'Phone number',
        };
        var email = $('input#email', $this).val();
        var i = 1;
        _paq.push(['setUserId', email]);
        $('input', $this).each(function(index, elem){
          if ( Object.keys(fields).indexOf(elem.name) > -1 ){
            _paq.push(['setCustomVariable', i, fields[elem.name], elem.value, "visit" ]);
            _paq.push(['setCustomVariable', i, fields[elem.name], elem.value, "page" ]);
            i++;
          };
        });
        _paq.push(['trackEvent', 'Form', 'Instapage', 'Success']);
        form.submit();
      },
      invalidHandler: function(event, validator) {
        if ( $("#itl-phone").intlTelInput("getValidationError") == 0 && !$("#itl-phone").intlTelInput("isValidNumber") ) {
          var $inputs = $(':input', $this);
          var values = {};
          var i = 1;
          $inputs.each(function() {
            if ( $(this).val() ){
              values[this.name] = $(this).val();
            };
            if ( $.inArray( $(this)[0].name ["firstname","lastname","email","itlPhoneFull"] )) {
              _paq.push(['setCustomVariable', i, $(this)[0].name, $(this)[0].value, "page"]);
              i++
            };
          });
          _paq.push(['trackEvent', 'Form', 'Instapage', 'Invalid']);
          $.post( "/wp-content/themes/ebs-v2/check.php", { valid: 0, data: JSON.stringify(values) } );
        }
      },
    });
  });

  jQuery.validator.addMethod("RFC2822Email", function(value, element) {
      return this.optional( element ) || ( /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test( value ) );
  });

  jQuery.validator.addMethod("phone_possible", function(value, element) {
    var form = $(element).parents('form:first');
    var error = $("#itl-phone", form).intlTelInput("getValidationError");
    return error == 0;
  });

  jQuery.validator.addMethod("phone_valid", function(value, element) {
    var form = $(element).parents('form:first');
    return $("#itl-phone", form).intlTelInput("isValidNumber");
  });

  jQuery('input[name="js"]').val('1');
  jQuery('input[name="timezonediff"]').val(function(){
    var d, offset, sign, hours, minutes, result;
    d	= new Date();
    offset = - d.getTimezoneOffset() * 60;
    sign = offset > 0 ? '+' : '-';
    offset = offset > 0 ? offset : -offset;
    hours = parseInt( offset / 3600 ) % 24;
    minutes = parseInt( offset / 60 ) % 60;
    result = sign + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
    return result;
  });
});

window.addEventListener("pagehide", function(evt){
  WistiaTracker.leave(true);
}, false);