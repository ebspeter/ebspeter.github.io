{% assign path = page.path | split:"/" %}
{% assign market = path[2] %}
{% assign meta = site.data.instapage[market].meta %}

{% if meta.countryAlpha2.size > 0 %}
  {% assign country = meta.countryAlpha2 %}
{% else %}
  {% assign country = meta.market %}
{% endif %}

$(document).ready(function(){

  /* Initialise WistiaTracker if wistia embed exist */
	if( $('iframe[name="wistia_embed"]').length || $('div.wistia_embed').length){
		WistiaTracker.init(true);
	};

  $('.itl-phone').intlTelInput({
    autoPlaceholder: true,
    preferredCountries: ["au","be","ch","de","dk","es","fi","fr","gb","ie","it","nl","no","se","us","pl","pt","za"],
    geoIpLookup: function(callback) {
      $.post("/wp-content/themes/ebs-v2/check.php", {ip: true}).always(function(resp) {
        var countryCode = (resp) ? resp : "{{ country }}";
        callback(countryCode);
      });
    },
    separateDialCode: false,
    initialCountry: "auto",
  });

  $('.itl-phone').attr('autocomplete', 'tel');

  /*Keep watching the inputs for change (browser autofill fix)*/
  form_top = {};
  setInterval(function() {
    $('#form_top input:visible').each(function() {
      var $elem = $(this);
      if ($elem.val() != form_top[$elem[0].name]){
        form_top[$elem[0].name] = $elem.val();
        $elem.change();
      }
    })
  }, 250);

  form_bottom = {};
  setInterval(function() {
    $('#form_bottom input:visible').each(function() {
      var $elem = $(this);
      if ($elem.val() != form_top[$elem[0].name]){
        form_bottom[$elem[0].name] = $elem.val();
        $elem.change();
      }
    })
  }, 250);

  $('input').focus(function(){
    /* Clear any custom variables from a preceeding invalid submit */
    for(i=0; i < 6; i++){
      _paq.push(['deleteCustomVariable', i, 'page']);
    };    
    _paq.push(['trackEvent', 'Form', 'Instapage', 'Focus ' + $(this).attr('name')]);
  });

  $('input').change(function(){
    var $validationElement = $(this).prev();
    if( $validationElement.hasClass('error') || $validationElement.hasClass('valid')){
      updatePhoneContainer( $(this) );
    };
  });

  $('input').blur(function(){
    updatePhoneContainer( $(this) );
  });

  $('.itl-phone').keyup(function(e){
    if( $(this).hasClass('error') || $(this).hasClass('valid') ){
      updatePhoneContainer($(this));
    };
  });

  function updatePhoneContainer($element){
    var valid = $element.valid();
    if( $element.hasClass('itl-phone')){
      $element.closest('form').find('.intl-tel-input').addClass( valid ? 'valid':'error').removeClass( valid ? 'error':'valid');
    };
  };

  /*Helper function to set validation messages from data-msg on inputs*/
  function getMsg(selector, context, type) {
    return $(selector, context).attr(type);
  };

  $('form').each(function(){
    var $this = this;
    var validIcon = 'fa-check';
    var errorIcon = 'fa-times';
    function toggleValid(valid, $element){
      $container = $($element).closest('.input-container');
      var iconClasses = 'fa ' + (valid ? validIcon + ' valid' : errorIcon + ' error');
      $container.find('i').attr('class','').addClass( iconClasses );
      $element.addClass( valid ? 'valid' : 'error' ).removeClass( !valid ? 'valid' : 'error' );
    };
    $(this).validate({
      ignore: ":hidden",
      highlight: function(element){toggleValid(false, $(element))},
      unhighlight: function(element){toggleValid(true, $(element))},
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
        'itl-phone': {
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
        'itl-phone': {
          required: getMsg('.itl-phone', $this, 'data-msg-required'),
          phone_valid: getMsg('.itl-phone', $this, 'data-msg-valid'),
        },
      },
      submitHandler: function(form) {
        $(form).find('.loader').show();
        $(form).find('button[type="submit"]').html('Please wait.. <i class="fa fa-spinner fa-pulse"></i>');
        $(form).find('.itlPhoneFull').val( $(form).find('.itl-phone').intlTelInput("getNumber") );
        var fields = {
          firstname: 		'First name',
          lastname: 		'Last name',
          email: 				'Email',
          itlPhoneFull: 'Phone number',
        };
        var email = $('input[name="email"]', $this).val();
        var i = 1;
        _paq.push(['setUserId', email]);
        $('input', $this).each(function(index, elem){
          if ( Object.keys(fields).indexOf(elem.name) > -1 ){
            /* swith on itl-phone here */
            _paq.push(['setCustomVariable', i, fields[elem.name], elem.value, "visit" ]);
            _paq.push(['setCustomVariable', i, fields[elem.name], elem.value, "page" ]);
            i++;
          };
        });
        _paq.push(['trackEvent', 'Form', 'Instapage', 'Success']);
        form.submit();
      },
      invalidHandler: function(event, validator) {
        var $inputs = $(':input', $this);
        var values = {};
        var i = 1;
        $inputs.each(function() {
          if ( $(this).val() ){
            /* switch on itl-phone here */
            values[this.name] = $(this).val();
          };
          if ( $.inArray( $(this)[0].name ["firstname","lastname","email","itl-phone"] )) {
            _paq.push(['setCustomVariable', i, $(this)[0].name, $(this)[0].value, "page"]);
            i++
          };
        });
        _paq.push(['trackEvent', 'Form', 'Instapage', 'Invalid']);
        $.post( "/wp-content/themes/ebs-v2/check.php", { valid: 0, data: JSON.stringify(values) } );
      },
    });
  });

  jQuery.validator.addMethod("RFC2822Email", function(value, element) {
    value = value.toLowerCase();
    return this.optional( element ) || ( /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test( value ) );
  });

  jQuery.validator.addMethod("phone_possible", function(value, element) {
    var form = $(element).parents('form:first');
    var error = $("#itl-phone", form).intlTelInput("getValidationError");
    return error == 0;
  });

  jQuery.validator.addMethod("phone_valid", function(value, element) {
    var form = $(element).parents('form:first');
    return $(element).intlTelInput("isValidNumber");
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