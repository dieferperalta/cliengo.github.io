
<script>
console.log('Leadaki: form-integration/instapage v2');
//      _              _ _ _                    _____                 _   _                 
//     / \  _   ___  _(_) (_) __ _ _ __ _   _  |  ___|   _ _ __   ___| |_(_) ___  _ __  ___ 
//    / _ \| | | \ \/ / | | |/ _` | '__| | | | | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
//   / ___ \ |_| |>  <| | | | (_| | |  | |_| | |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
//  /_/   \_\__,_/_/\_\_|_|_|\__,_|_|   \__, | |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
//                                      |___/                                               

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
  
function addRefererTracking(){
    var ret;
  	if(readCookie('ldkRefererTracking')){
		ret = '&ldkRefererTracking=' + encodeURIComponent(readCookie('ldkRefererTracking'));
	} else {
        ret = "&ldkRefererTracking=direct";
    }
	return ret;
}
                                  
function addUtmsParam() {
	if(readCookie('ldkUtms')){
		return '&ldkUtms=' + encodeURIComponent(readCookie('ldkUtms'));
	}
	return "";
}
                                  
function addCustomLeadData(){
	if(Leadaki.customAttributes){
		return '&customAttributes=' + encodeURIComponent(Leadaki.customAttributes);
	}
  	return ""; 
}

function ldkFormPost(myform, successCallback) {
    debugger
  
    // Instapage form serializer
    var params = [];
    debugger;
    [].slice.call(myform).forEach(function (el, i) {
        try{
          var paramName = encodeURIComponent(base64_decode(el.name));
		  if(paramName.indexOf("lpsSubmissionConfig") == -1){
	          params.push(encodeURIComponent(base64_decode(el.name)) + "=" + encodeURIComponent(el.value));          
          }
        } catch(e) {
            console.log(e);
        }
    });
  
    var serializedParams = params.join("&");

    // For backward compatibility
    var xhttp;
    if (window.XMLHttpRequest) {
        //Firefox, Opera, IE7, and other browsers will use the native object
        xhttp = new XMLHttpRequest();
    } else {
        //IE 5 and 6 will use the ActiveX control
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

  	debugger;
    // Sets the http request
    xhttp.open("POST", "https://convergency.herokuapp.com/Siteless/contactSave", true);
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (/20/.test(this.status) || this.status == 226) && this.status != 420 && this.status != 520) {
        try {
            dataLayer = dataLayer || {};
            dataLayer.push({"event":"Conversion"})
        } catch (e) {
            throw e;
        } finally {
            if( successCallback && typeof successCallback === 'function' ) {
                successCallback();
            } 
        }
    }
    };
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // This is necessary for the POST request
    xhttp.send(serializedParams + '&ldkCompanyId='+ Leadaki.companyId +'&ldkWebsiteId='+ Leadaki.websiteId + "&channel=FORM" + addRefererTracking() + addUtmsParam() + addCustomLeadData());
}

function getParam(p){
    var match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

//   _____                      ___       _                       _   _             
//  |  ___|__  _ __ _ __ ___   |_ _|_ __ | |_ ___  __ _ _ __ __ _| |_(_) ___  _ __  
//  | |_ / _ \| '__| '_ ` _ \   | || '_ \| __/ _ \/ _` | '__/ _` | __| |/ _ \| '_ \ 
//  |  _| (_) | |  | | | | | |  | || | | | ||  __/ (_| | | | (_| | |_| | (_) | | | |
//  |_|  \___/|_|  |_| |_| |_| |___|_| |_|\__\___|\__, |_|  \__,_|\__|_|\___/|_| |_|
//                                                |___/                             

// Inserta las variables del chat en el documento
window.addEventListener('load', function(){
  if (!window.Leadaki) {
      window.Leadaki = {};
      window.Leadaki.websiteId = "{{websiteId}}";
      window.Leadaki.companyId = "{{companyId}}";
  }
});
  
// Adds gclid to form
var gclid = getParam('gclid');
if(gclid){
    /* Este es el selector de instapage para el nombre 'gclid' porque lo encodean en base 64  */
    var inputs = ijQuery('input[name="Z2NsaWQ="]');
    if(inputs == null){
        console.error('Leadaki: Hay gclid %s pero no inputs hidden de name "gclid"', gclid);
    }
    inputs.val(gclid);
    console.log('Leadaki: guardado el gclid %s correctamente en %s campos hidden', gclid, inputs.size())
} else {
    console.log('Leadaki: no se encontró ningún gclid');
}

//Disparado automático de pixels si está el script de Leadaki
window.instapageFormSubmitSuccess = function( form ) {
  
    ldkFormPost(form,function(){
        console.log('Leadaki: form sent');
    });
}
</script>
