/**
 * Script de integracion para landings de Instapage

 * En el caso de tener varios pasos en la pagina
 * utilizamos este script para intapage

 * CÃ³digo para guardar el gclid de adwords en el campo hidden "gclid" de
 * instapage, y que lo pueda enviar luego a salesforce
 */
function getParam(p) {
	var match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var gclid = getParam('gclid');

if (gclid) {
	/*
	 * Este es el selector de instapage para el nombre 'gclid' porque lo
	 * encodean en base 64
	 */
	var inputs = ijQuery('input[name="Z2NsaWQ="]');
	if (inputs == null) {
		console.error(
				'Leadaki: Hay gclid %s pero no inputs hidden de name "gclid"',
				gclid);
	}
	inputs.val(gclid);
	console.log(
			'Leadaki: guardado el gclid %s correctamente en %s campos hidden',
			gclid, inputs.size())
} else {
	console.log('Leadaki: no se encontrÃ³ ningÃºn gclid');
}

function successCallback() {
	localStorage.removeItem("form-data");
	localStorage.removeItem("cookie_ldk");
	console.log("success!");
	window.location.href = "http://www.plazofijocolumbia.com/gracias";
}

$(function() {
	if(localStorage.getItem("cookie_ldk") == undefined){
		localStorage.setItem("cookie_ldk", document.cookie);
	}else{
		var arr_cookie = localStorage.getItem("cookie_ldk").split(";");
		var documet_cookie = document.cookie;
		for(var i=0 ; i<arr_cookie.length; i++){
			var item = arr_cookie[i].split("=");
			if(item[0].trim() == "ldkUtms" || item[0].trim() == "ldkRefererTracking"){
				documet_cookie += ";" + item[0] + "=" + item[1];
			}
		}
		document.cookie = documet_cookie;
	}

    $(document).on('click', '.submit-button', function() {    	
    		addLocalStorageObject('form-data');
    });
});

function getParams(){
	var params = {};
	$("form input").each(function(){
		if(this.value.indexOf("http://app.instapage.com") == -1 && this.name != "websiteId"){
 	    		try{params[base64_decode(this.name)] = this.value;} catch(e){console.log(e);}
		}
	});
	return params;
}

function addLocalStorageObject(key){
	var params = getParams();	
	var localdata = localStorage.getItem(key);    	    
    if(localdata == undefined){
	    	localStorage.setItem(key,JSON.stringify(params))
    }else{
    		var params_json = JSON.parse(params);	    	
	    	for (const key of Object.keys(params_json)) 
	    	{
	    	    if(key != "") {
	    	    		localdata_[key] = params_json[key];
	    	    }
	    	}
	    	localStorage.setItem(key,JSON.stringify(localdata))
    } 
}

//Disparado automÃ¡tico de pixels si estÃ¡ el script de Leadaki
window.instapageFormSubmitSuccess = function( form )
{
  console.log('Leadaki: se completÃ³ un formulario correctamente');
  //si estÃ¡ leadaki instalado disparo los pixels cuanco completan el formulario
  if (window.Leadaki && fireNewLeadPixels)
  {    
    var params = {};
    [].slice.call(form).forEach(function (el, i) {    	
    		if(el.value.indexOf("http://app.instapage.com") == -1 && el.name != ""){
    			try{params[base64_decode(el.name)] = el.value;} catch(e){console.log(e);}
    		}
    });
    var ls = JSON.parse(localStorage.getItem("form-data"));
	for (const key of Object.keys(ls)) 
	{
	    if(key != "instapage-local-storage-iframe" && key != "websiteId") {
	    		params[key] = ls[key];
	    }
	}
	
//	console.log($.param(params));
    ldkTrackContactFormSerialized($.param(params), successCallback);  
    
//	  console.log('Leadaki: disparando pixels de conversiÃ³n');
//	  fireNewLeadPixels()	  
  }
}
