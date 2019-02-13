/* =============================================================================================================
	
	https://github.com/patrick-moire/dialog.js (Last update : 02.07.2018)
	
	Compatibility : IE8* -> Edge
					Chrome
					Firefox
					...
	
	- jQuery 1.9
	- jquery-dialogextend (https://github.com/ROMB/jquery-dialogextend)
	
	
	PS : Ajouter pour internet Explorer (8 & plus) dans le code de l'appelant :
		
		<!DOCTYPE html5 PUBLIC "">
		<html>
		<head>
			<meta http-equiv="Content-Type" 	content="text/html; charset=iso-8859-1">
			<meta http-equiv="X-UA-Compatible" 	content="IE=edge,chrome=1">
			...
		</head>
		...
		
		+ limiter le nombre de commentaire HTML (<!-- ..... -->) avant la balise <meta http-equiv="X-UA-Compatible" ...> pour IE10 & IE11 !!!  (une ou deux passe... cinq ou six et IE ne prend plus en compte la balise <meta> de compatibilité !!!)
============================================================================================================= */

		//------------------------------- Chargement d'un fichier via une Dialog jQuery "interractive" (iFrame)
		function dialog(param,w,h,titre) {

			// Gestion ancienne version pour compatibilité : 
			if (typeof(param)=="string" || $(param).is('form')) {
				param = {
					formulaire : param,
						 titre : titre,
					    height : h,
					     width : w
				//	 minHeight : 100,
				//	  minWidth : 300,
				//	 maxHeight : false,
				//	  maxWidth : false,
				//	    create : function(even,ui,$iframe,dialog) {....}	 
				// beforeClose : function(even,ui,$iframe,dialog) {....}	 
				//    	 close : function(even,ui,$iframe,dialog) {....}	 
				}
			}

			// pour compatibilité !
			if (param.witdh!=undefined)  param.width  = param.witdh;
						
			// Valeur par defaut...
		    if (param.height==undefined) 	param.height 	= 4000;
		    if (param.width==undefined)  	param.width  	= 1000;
		    if (param.minHeight==undefined) param.minHeight = 100;
		    if (param.minWidth==undefined)  param.minWidth  = 300;
		    if (param.maxHeight==undefined) param.maxHeight = false;
		    if (param.maxWidth==undefined)  param.maxWidth  = false;
			if (param.titre==undefined)  	param.titre  	= 'Chargement en cours...';
			
			// Correction hauteur/largeur et placement par rapport à la taille de la fenêtre...

			var innerHeight = (window.innerHeight==undefined ? document.documentElement.clientHeight /* IE8 */ : window.innerHeight /* Chrome */);
			var innerWidth  = (window.innerWidth==undefined ? document.documentElement.clientWidth /* IE8 */ : window.innerWidth /* Chrome */);
			
			var scoolbarY   = (document.scrollingElement==undefined ? 16 /* IE */ : (document.scrollingElement.scrollHeight > innerHeight ? 16 : 0));
			var scoolbarX   = (document.scrollingElement==undefined ? 0  /* IE */ : (document.scrollingElement.scrollWidth  > innerWidth  ? 16 : 0));
			
			if (param.height > (innerHeight - 97 - scoolbarX)) param.height = innerHeight - 97 - scoolbarX;
			if (param.width  > (innerWidth  - 10 - scoolbarY)) param.width  = innerWidth  - 10 - scoolbarY;

			var offset = (param.height<(innerHeight-107-scoolbarX) ? (innerHeight - 97 - param.height) / 3 : 0);
			
			// Récupération de l'iframe courant ?
			var id_recup = undefined;
			var $iframe = $();
			if (typeof(param.formulaire)!="string") {
				$(param.formulaire).attr('target',(param.formulaire.target==undefined ? 'dialog_' + $('iframe').length : param.formulaire.target).toLowerCase());
				$iframe = $('iframe[name="'+param.formulaire.target+'"]',parent.$('.ui-dialog'));
				if ($iframe.length>0) {
					var $dialog = parent.$('.ui-dialog.ui-widget-content');
					for (id_recup=0 ; id_recup<$dialog.length && $('iframe:first',$dialog.get(id_recup)).attr('name')!=param.formulaire.target; id_recup++);
				}
			}
			if ($iframe.length==0) {

				// Création d'une iframe nommé depuis le nom de la target du formulaire
				$iframe = $('<iframe name="'+param.formulaire.target+'">').attr({
				   allowfullscreen: true,
					   frameborder: 0,
					   marginwidth: 0,
					  marginheight: 0,
						 scrolling: 'yes',			
							 width: '100%',//param.width-25,
							height: param.height
				});
						
				// intégration de l'iframe dans une dialog jQuery			
				var $dialog = $("<div>").append($iframe)
										.appendTo("body")
										.dialog({
										   title : 	param.titre,
										position : 	"center top+" + offset, 
										   modal : 	true,
									   resizable : 	true,
										minWidth : 	param.minWidth,
									   minHeight : 	param.minHeight,
										maxWidth : 	param.maxWidth,
									   maxHeight : 	param.maxHeight,
									   scrolling : 	'no',
										   width : 	param.width,
										  height : 	"auto",
									  resizeStop : 	function(event, ui) { 
														$iframe.width($(this).width());
														$iframe.height($(this).height());
													},
										 buttons : 	[	{	 text: "Envoyer",
															 name: "send",
															style: "display:none",
															icons: { primary: "ui-icon-mail-closed" },
															click: function() {	$iframe.get(0).contentWindow.Envoyer($(this)); }
														},
														{	 text: "Ajouter",
															 name: "add",
															style: "display:none",
															icons: { primary: "ui-icon-plusthick" },
															click: function() {	$iframe.get(0).contentWindow.Ajouter($(this)); }
														},
														{	 text: "Supprimer",
															 name: "delete",
															style: "display:none",
															icons: { primary: "ui-icon-trash" },
															click: function() {	$iframe.get(0).contentWindow.Supprimer($(this)); }
														},
														{	 text: "Sauvegarder",
															 name: "save",
															style: "display:none",
															icons: { primary: "ui-icon-disk" },
															click: function() {	$iframe.get(0).contentWindow.Sauvegarder($(this)); }
														},
														{	 text: "Imprimer",
															 name: "print",
															style: "display:none",
															icons: { primary: "ui-icon-print" },
															click: function() {	$iframe.get(0).contentWindow.Imprimer($(this)); }
														},
														{    text: "Fermer",
															 name: "close",
															icons: { primary: "ui-icon-closethick" },	
															click: function() {	$( this ).dialog( "close" ); }
														}
													],
									 beforeClose : 	function( event, ui ) {
														// Call-back confirmation avant déchargement de la dialog
														if (param.beforeClose!=undefined) {
															param.beforeClose(event, ui, $iframe, $iframe.get(0).contentWindow);
														// Pour compatibilité... 	
														} else try {
															if ($iframe.get(0).contentWindow.dialog_beforeClose!=undefined) {
																return $iframe.get(0).contentWindow.dialog_beforeClose($(this));
															}
														} catch(err) {
														//	Pour FireFox lors de l'affichage d'une facture au format PDF !
														}
													},
										   close : 	function ( event, ui ) {
														// Call-back pour indiqué le déchargement de la dialog
														if (param.close!=undefined) { 
															param.close(event, ui, $iframe, $iframe.get(0).contentWindow);
														// Pour compatibilité... 	
														} else try { 
															if ($iframe.get(0).contentWindow.query_unload!=undefined) {
																$iframe.get(0).contentWindow.query_unload($(this));
															}
														} catch(err) {
														//	Pour FireFox lors de l'affichage d'une facture au format PDF !
														}
														// suppression dialog
														$iframe.attr("src", "");
														$iframe.remove();
														$(this).dialog( "destroy" );
														$(this).remove(); //document.body.removeChild(this);
														
														// Pour compatibilité....
														if (param.close==undefined && document.forms[0].refresh_screen!=undefined) { 
															if (document.forms[0].refresh_screen.value=="O") refresh(); 
														}
														
													},
										  create :	function( event, ui ) {    
														if (param.create!=undefined) param.create(event, ui, $iframe, this);
													}
										})
										.mousewheelStopPropagation()
										.disableSelection()
										.css({overflow:"hidden"})
										.dialogExtend({
										   maximizable: true,
										   minimizable: true,
											  dblclick: "maximize",
											  maximize: function(event, ui) { 
															if (param.maxWidth!==false  && $(this).width()>param.maxWidth)   {
																$(this).dialog("option", "width",param.maxWidth);
																$(this).dialog("option", "position", {my: "center", at: "center", of: window});
															}
															if (param.maxHeight!==false && $(this).height()>param.maxHeight) {
																$(this).dialog("option", "height",param.maxHeight);
																$(this).dialog("option", "position", {my: "center", at: "center", of: window});
															}
															$iframe.width($(this).width());
															$iframe.height($(this).height());
														},
											   restore: function(event, ui) { 
															$iframe.width($(this).width());
															$iframe.height($(this).height());
														}
										});
										
				$dialog.parent().css('overflow','hidden');
				
				// ajout du bouton print-screen
				var $bt_print = $('<a class="ui-dialog-titlebar-print ui-corner-all ui-state-default" href="#!" role="button" style="margin-right: 5px;height: 18px;width: 18px;">'
								+ 	'<span class="ui-icon ui-icon-print" Title="imprimer ce cadre"/>'
								+ '</a>'
				).mouseover(function() {
					$(this).addClass("ui-state-hover");
				}).mouseout(function() {
					$(this).removeClass("ui-state-hover");
				}).focus(function() {
					$(this).addClass("ui-state-focus");
				}).blur(function() {
					$(this).removeClass("ui-state-focus");
				}).click(function() { 
					var iframe = $iframe.get(0).contentWindow;
					if (iframe.document.queryCommandSupported('print')) { // https://stackoverflow.com/questions/44547861/ie11-windows-7-print-issue-after-kb4021558
						iframe.document.execCommand('print', false, null)
					} else {
						iframe.focus();
						iframe.print(); 
					}
				});
				$('.ui-dialog-titlebar-buttonpane',$dialog.parent()).append($bt_print);			  
				
				// couleur de fond...
				if (param.backgroundColor) {
					$(".ui-widget-content, .ui-resizable-handle",$dialog.parent('div.ui-dialog')).css("background", param.backgroundColor); 
					$dialog.parent('div.ui-dialog').css("background", param.backgroundColor); 
				}

				// event when iframe ready
				if (param.ready!=undefined) {
					$iframe.ready( function () {
						param.ready($dialog,this);
					});
				}
			}
			
			// Appel du formulaire dans l'iFrame 'dialog'			
			if (typeof(param.formulaire)=="string") {
				$iframe.attr("src", param.formulaire);
			} else if ($(param.formulaire).is('form')){
				param.formulaire.submit();
			}

			$iframe.focus();

			// fermeture dialog qui sont au dessus :
			if (id_recup!=undefined) {
				var $dialog = parent.$('.ui-dialog.ui-widget-content');
				for (var i = (id_recup+1) ; i<$dialog.length; i++) {
					$(".ui-button[name='close']",$dialog.get(i)).click();
				}
			}
			return($dialog);
		}		
