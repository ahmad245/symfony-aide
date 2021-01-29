/**
 * Controls.ModalAlert - for mootools 1.2 - jQUery 1.3
 * @name sexyalertbox.v1.2.js
 * @author Eduardo D. Sada
 * @version 1.2.2
 * @date 25-May-2009
 * @copyright (c) 2009 Eduardo D. Sada (www.coders.me)
 * @license MIT - http://es.wikipedia.org/wiki/Licencia_MIT
 * @based in <PBBAcpBox> (Pokemon_JOJO, <http://www.mibhouse.org/pokemon_jojo>)
 * @thanks to Pokemon_JOJO!
 * @features:
 * * Chain Implemented (Cola de mensajes)
 * * More styles (info, error, alert, prompt, confirm)
 * * ESC would close the window
 * * Focus on a default button
 */

/*
Class: Controls.ModalAlert
	Clone class of original javascript function : 'alert', 'confirm' and 'prompt'

Arguments:
	options - see Options below

Options:
	name - name of the box for use different style
	zIndex - integer, zindex of the box
	onReturn - return value when box is closed. defaults to false
	onReturnFunction - a function to fire when return box value
	BoxStyles - stylesheets of the box
	OverlayStyles - stylesheets of overlay
	showDuration - duration of the box transition when showing (defaults to 200 ms)
	showEffect - transitions, to be used when showing
	closeDuration - Duration of the box transition when closing (defaults to 100 ms)
	closeEffect - transitions, to be used when closing
	onShowStart - a function to fire when box start to showing
	onCloseStart - a function to fire when box start to closing
	onShowComplete - a function to fire when box done showing
	onCloseComplete - a function to fire when box done closing
*/

ModalAlert = {
    defaultOptions: {
        name: 'ModalAlert',
        zIndex: 65565,
        onReturn: false,
        onReturnFunction: function() {},
        BoxStyles: {
            'width': 500,
            'forcedWidth': null
        },
        OverlayStyles: {
            'background-color': '#606060',
            'opacity': 0.5
        },
        onShowStart: function() {},
        onShowComplete: function() {},
        onCloseStart: function() {},
        onCloseComplete: function(properties) {
            ModalAlert.options.onReturnFunction(ModalAlert.options.onReturn);
        }
    },
    defaultProperties: {
        textBoxBtnOk: 'OK',
        textBoxBtnCancel: 'Annuler',
        textBoxInputPrompt: null,
        password: false,
        onComplete: function(){},
        labelChamp1: null,
        labelChamp2: null,
        textarea: false
    },

    options: 	        {},
    currentProperties:  {},

    isInitialized: false,

    firedControl: false,

    init: function(options) {
    	this.options = $.extend({}, this.defaultOptions);
    	if(options) {
    		$.extend(this.options, options);
    	}

    	var overlayWidth = $(window).width() + 'px';
        var overlayHeight = $(window).height() + 'px';
        
        this.Overlay = $('<div/>', {
            'id': 'BoxOverlay'
        })
        .css({
        	'display': 'none',
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'opacity': 0,
            'z-index': this.options.zIndex,
            'background-color': this.options.OverlayStyles['background-color'],
            'height': overlayHeight,
            'width': overlayWidth
        });

        this.Box = $('<div/>', {
            'id': this.options.name + '-Box'
        })
        .css({
        	'display': 'none',
            'z-index': this.options.zIndex + 2,
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'width': this.options.BoxStyles.width + 'px'
        });

		this.InBox = $('<div/>', {
            'id': this.options.name + '-InBox'
        }).appendTo(this.Box);

		this.Contenedor = $('<div/>', {
            'id': this.options.name + '-BoxContent'
        }).appendTo(this.InBox);

        this.Content = $('<div/>', {
            'id': this.options.name + '-BoxContenedor'
        }).appendTo(this.Contenedor);

        this.Overlay.appendTo($(document.body));
        this.Box.appendTo($(document.body));

        this.preloadImages();	//TODO: Verif

        $(window).on('resize', function() {
            if (ModalAlert.options.display == 1) {
                ModalAlert.Overlay.css({
                    'height': document.body.offsetHeight + 'px',
                    'width': document.body.offsetWidth + 'px'
                });
                
                ModalAlert.replaceBox();
            }
        });
        $(window).on('scroll', $.proxy(this.replaceBox, this));

        this.Box.on('keydown', function(event) {
            if (event.key == 'esc') {
                ModalAlert.options.onReturn = false;
                ModalAlert.display(0);
            }
        });

        this.isInitialized = true;    
    },

    preloadImages: function() {
        /*var img = new Array(2);
        img[0] = new Image();img[1] = new Image();img[2] = new Image();
        img[0].src = this.Box.getStyle('background-image').replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");
        img[1].src = this.InBox.getStyle('background-image').replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");
        img[2].src = this.Contenedor.getStyle('background-image').replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");*/
    },

    fireKeyboardInput: function(e) {
        if(e.which == 13) { // enter
            $('input[id$=BtnOk]').click();
        }
        else if(e.which == 27) { // escape
            if($('#ModalAlert-Box').find('input[type=submit]').length == 1) {
                $('#ModalAlert-Box').find('input[type=submit]').click();
            } else {
                $('input[id$=BtnCancel]').click();
            }
        }
    },

    togFlashObjects: function(state) {
        var hideobj = new Array("embed", /*"iframe", */ "object");
        for (y = 0; y < hideobj.length; y++) {
            var objs = document.getElementsByTagName(hideobj[y]);
            for (i = 0; i < objs.length; i++) {
                objs[i].style.visibility = state;
            }
        }
    },

    verifMdf:function(){
    	 var mdp = $('#BoxPromptInput').val();
    	if(mdp.length > 0 && mdp == $('#BoxPromptInput2').val()){
    		this.options.onReturn = mdp
    		this.display(0);
    	}else{
    		$('#error').css('display','block');
    	}
    },
    /*
	Property: display
		Show or close box
		
	Argument:
		option - integer, 1 to Show box and 0 to close box (with a transition).
	*/
    display: function(option) {
        // Show Box	
        if (this.options.display === 0 && option !== 0 || option == 1) {

            // Ctrl + Enter for quick validating
            if(typeof ModalAlert.currentProperties !== "undefined" && ModalAlert.currentProperties.textarea === true) {
                $(document).unbind('keyup', this.fireKeyboardInput);
            } else {
                $(document).bind('keyup', this.fireKeyboardInput);
            }

        	//TODO: Verif
            /*if (Browser.ie6) {
                $$('select', 'object', 'embed').each(function(node) {
                    node.style.visibility = 'hidden'
                });
            }*/

            this.togFlashObjects('hidden');
            this.Overlay.css({
            	'display': 'block',
            	'opacity': this.options.OverlayStyles.opacity
            });

            this.resizeOverlay();
            this.options.display = 1;

            if(this.options.onShowStart) {
            	this.options.onShowStart(this.Overlay);
            }

            /*sizes = window.getSize();
            scrollito = window.getScroll();*/

            this.replaceBox();
            this.Box.css({
                'display': 'block'
            });
            setTimeout(function() {
                this.Box.addClass('ModalAlert-open');
            }.bind(this), 10);

            if(this.options.onShowComplete) {
            	this.options.onShowComplete(this.Overlay);
            }

            /*this.Transition = new Fx.Tween(this.Overlay, {
                property: 'opacity',
                duration: this.options.showDuration,
                transition: this.options.showEffect,
                onComplete: function() {
                    sizes = window.getSize();
                    scrollito = window.getScroll();

                    if (this.options.showDuration === 0) {
                        this.replaceBox();
                        this.Box.css({
                            'display': 'block'
                        });
                        setTimeout(function() {
                            this.Box.addClass('ModalAlert-open');
                        }.bind(this), 10);
                    } else {
                        this.Box.css({
                            'display': 'block',
                            'left': (scrollito.x + (sizes.x - this.options.BoxStyles['width']) / 2).toInt()
                        });

                        this.replaceBox();
                    }
                    this.fireEvent('onShowComplete', [this.Overlay]);
                }.bind(this)
            }).start(this.options.OverlayStyles['opacity']);*/

        }
        // Close Box
        else {
            // unbind events
            $(document).unbind('keyup', this.fireKeyboardInput);

            /*if (Browser.ie6) {
                $$('select', 'object', 'embed').each(function(node) {
                    node.style.visibility = 'visible';
                });
            }*/

            ModalAlert.currentProperties = {};
            this.togFlashObjects('visible');

            //TODO: Verif
            //this.queue.delay(500, this);

            this.Box.removeClass("ModalAlert-open");
            setTimeout($.proxy(function() {
                this.Box.css({
                    'display': 'none',
                    'top': 0
                });
                this.Content.empty();
                this.options.display = 0;

                if(this.options.onCloseStart) {
                	this.options.onCloseStart(this.Overlay);
                }
                if(this.options.onCloseComplete) {
                	this.options.onCloseComplete(this.Overlay);
                }
                this.Overlay.css({
                    'height': '0',
                    'width': '0'
                });
                /*if (Browser.ie6 || Browser.ie7) {
                    // Fix IE <= 7 pour alpha ayant une valeur diff�rente de 0 � la fin
                    this.Overlay.css('filter', 'alpha(opacity=0)');
                }*/
            }, this), 100);
        }
    },

    /*
	Property: replaceBox
		Move Box in screen center when brower is resize or scroll
	*/
    replaceBox: function(force) {
        if (this.options.display == 1 || force) {
            var sizes = {
            	x: $(window).width(),
            	y: $(window).height()
            };
            var scrollito = {
            	x: $(window).scrollLeft(),
            	y: $(window).scrollTop()
            };
            
            var boxWidth = (this.options.BoxStyles.forcedWidth ? this.options.BoxStyles.forcedWidth : this.options.BoxStyles.width);

           	this.Box.css({
                'left': parseInt(scrollito.x + (sizes.x - boxWidth) / 2),
                'top': parseInt(scrollito.y + (sizes.y - this.Box.height()) / 2)
            });

           	//TODO: Verif
            //this.focusin.delay(this.options.moveDuration, this);
        }
    },

    focusin: function() {
        if ($('#BoxAlertBtnOk').length > 0) {
            $('#BoxAlertBtnOk').focus();
        } else if ($('#BoxPromptInput').length > 0) {
            $('#BoxPromptInput').focus();
        } else if ($('BoxConfirmBtnOk').length > 0) {
            $('#BoxConfirmBtnOk').focus();
        }
    },

    //TODO: Verif
    /*queue: function() {
        this.i--;
        this.callChain();
    },*/


    /*
	Property: messageBox
		Core system for show all type of box
		
	Argument:
		type - string, 'alert' or 'confirm' or 'prompt'
		message - text to show in the box
		properties - see Options below
		input - text value of default 'input' when prompt
		
	Options:
		textBoxBtnOk - text value of 'Ok' button
		textBoxBtnCancel - text value of 'Cancel' button
		onComplete - a function to fire when return box value
	*/
    messageBox: function(type, message, properties, input) {

    	//TODO: Verif
        //this.chain(function() {

        ModalAlert.currentProperties = ModalAlert.defaultProperties;
        if(properties) {
        	properties = $.extend({}, ModalAlert.defaultProperties, properties);
        } else {
        	properties = $.extend({}, ModalAlert.defaultProperties);
        }

        ModalAlert.currentProperties = properties;
        this.options.onReturnFunction = properties.onComplete;

        this.ContenedorBotones = $('<div/>', {
            'id': this.options.name + '-Buttons'
        });

        if((typeof properties.textarea !== "undefined" && properties.textarea === true)
        || (typeof properties.showImage !== "undefined" && properties.showImage === false)) {
            this.Content.css('padding', '8px 0px 5px 0px');
            this.ContenedorBotones.css('margin', '40px 0px 10px 0px');
        } else {
            this.Content.css('padding', '8px 0px 5px 60px');
            this.ContenedorBotones.css('margin', '40px 0px 10px -60px');
        }
        
        if(properties.boxWidth) {
          this.options.BoxStyles.forcedWidth = properties.boxWidth;
          this.Box.css('width', properties.boxWidth);
        } else {
          this.options.BoxStyles.forcedWidth = null;
          this.Box.css('width', this.options.BoxStyles.width);
        }

        var message_box = this;

        if (type == 'alert' || type == 'info' || type == 'error' || type == 'inform') {
            this.AlertBtnOk = $('<input/>', {
                'id': 'BoxAlertBtnOk',
                'type': 'submit',
                'value': properties.textBoxBtnOk
            })
            .css('width', '70px');

            this.AlertBtnOk.on('click', function() {
                ModalAlert.options.onReturn = true;
                ModalAlert.display(0);
            });

            if(typeof properties.showImage === "undefined" || (typeof properties.showImage !== "undefined" && properties.showImage !== false)) {
                if (type == 'alert') {
                    this.clase = 'BoxAlert';
                } else if (type == 'error') {
                    this.clase = 'BoxError';
                } else if (type == 'info') {
                    this.clase = 'BoxInfo';
                } else if (type == 'inform') {
                    this.clase = 'BoxInfo';
                }
            } else {
                this.clase = '';
            }

            this.Content.attr('class', this.clase).html(message);

            this.ContenedorBotones.append(this.AlertBtnOk);
            this.Content.append(this.ContenedorBotones);

            this.display(1);
        } else if (type == 'confirm') {
            this.ConfirmBtnOk = $('<input/>', {
                'id': 'BoxConfirmBtnOk',
                'type': 'submit',
                'value': ModalAlert.currentProperties.textBoxBtnOk
            })
            .css('width', '70px');

            this.ConfirmBtnCancel = $('<input/>', {
                'id': 'BoxConfirmBtnCancel',
                'type': 'submit',
                'value': ModalAlert.currentProperties.textBoxBtnCancel
            })
            .css('width', '70px');

            this.ConfirmBtnOk.on('click', function() {
                ModalAlert.options.onReturn = true;
                ModalAlert.display(0);
            });

            this.ConfirmBtnCancel.on('click', function() {
                ModalAlert.options.onReturn = false;
                ModalAlert.display(0);
            });

            this.Content.attr('class', 'BoxConfirm');
            this.Content.html(message);

            this.ContenedorBotones.append(this.ConfirmBtnOk);
            this.ContenedorBotones.append(this.ConfirmBtnCancel);
            this.Content.append(this.ContenedorBotones);

            this.display(1);
        }
        else if (type == 'prompt') {
            this.PromptBtnOk = $('<input/>', {
                'id': 'BoxPromptBtnOk',
                'type': 'submit',
                'value': ModalAlert.currentProperties.textBoxBtnOk
            }).css('width', '70px');

            this.PromptBtnCancel = $('<input/>', {
                'id': 'BoxPromptBtnCancel',
                'type': 'submit',
                'value': ModalAlert.currentProperties.textBoxBtnCancel
            }).css('width', '70px');

            if(ModalAlert.currentProperties.textarea == true) {
                this.PromptInput = $('<textarea>', {
                    'id': 'BoxPromptInput',
                }).val(input).css({
                    width: '100%',
                    'min-height': '150px',
                    'min-width': '50%',
                    'max-width': '100%',
                    'max-height': '150px'
                });
            } else {
                type = ModalAlert.currentProperties.password ? 'password' : 'text';
                this.PromptInput = $('<input/>', {
                    'id': 'BoxPromptInput',
                    'type': type,
                    'value': input
                }).css('width', '250px');
            }

            this.PromptBtnOk.click(function() {
                message_box.options.onReturn = message_box.PromptInput.val();
                message_box.display(0);
            });

            this.PromptBtnCancel.click(function() {
                message_box.options.onReturn = false;
                message_box.display(0);
            });

            this.ContenedorBotones
                .append(this.PromptBtnOk)
                .append(this.PromptBtnCancel);

            this.Content.attr('class', 'form');

            this.Content
                .html(message + '<br />')
                .append(this.PromptInput)
                .append('<br/>')
                .append(this.ContenedorBotones);

            this.display(1, ModalAlert.currentProperties);
        }
        else if (type == 'changePasseword') {
            this.PromptBtnOk = $('<input/>', {
                'id': 'BoxPromptBtnOk',
                'type': 'submit',
                'value': properties.textBoxBtnOk,
                'styles': {
                    'width': '70px'
                }
            });

            this.label1 = $('<label>').attr({
                'style': 
                    'width:200px;font-weight:bold;position: relative;left:-80px;'
            }).html(ModalAlert.currentProperties.labelChamp1+ "<br/>");
            
            this.PromptInput = $('<input>').attr({
                id: 'BoxPromptInput',
                type: 'password',
                'style':'width:310px'
            });
            this.label2 = $('<label>').attr({
                'style': 
                    'width:200px;font-weight:bold;position: relative;left:-80px;'
            }).html(ModalAlert.currentProperties.labelChamp2+ "<br/>");
            
            this.PromptInput2 = $('<input>').attr({
                id: 'BoxPromptInput2',
                type: 'password',
                'style': 'width:310px'
            });
            this.error = $('<div>').attr({
            	id:"error",
            	'style': 'display:none;color:#d21242'
            }).html('Veuillez saisir des mots de passes identiques<br/><br/>');
            this.PromptBtnOk.on('click', function() {
                this.options.onReturn = this.PromptInput.value;
                this.verifMdf();
            }.bind(this));


            this.Content.prop('class', 'changePasseword').html( message + '<br />');
            this.ContenedorBotones.append(this.error);
            this.ContenedorBotones.append(this.label1);
            this.ContenedorBotones.append(this.PromptInput);
            this.ContenedorBotones.append('<br/><br/>');
            this.ContenedorBotones.append(this.label2);
            this.ContenedorBotones.append(this.PromptInput2);
            this.ContenedorBotones.append('<br/><br/>');
            this.ContenedorBotones.append(this.PromptBtnOk);
            
            this.Content.append(this.ContenedorBotones);  

            this.display(1);
        } else {
            this.options.onReturn = false;
            this.display(0);
        }

        //});


		//TODO: Verif
        //this.i++;

        //if (this.i == 1) this.callChain();

    },

    /*
	Property: alert
		Shortcut for alert
		
	Argument:
		properties - see Options in messageBox
	*/
    alert: function(message, properties) {
        this.messageBox('alert', message, properties);
    },

    /*
	Property: info
		Shortcut for alert confirm
		
	Argument:
		properties - see Options in messageBox
	*/
    info: function(message, properties) {
        this.messageBox('info', message, properties);
    },
    
    /*
	Property: inform
		Shortcut for alert info
		
	Argument:
		properties - see Options in messageBox
	*/		
	inform: function(message, properties){
		this.messageBox('inform', message, properties);
	},

    /*
	Property: error
		Shortcut for alert error
		
	Argument:
		properties - see Options in messageBox
	*/
    error: function(message, properties) {
        this.messageBox('error', message, properties);
    },

    /*
	Property: confirm
		Shortcut for confirm
		
	Argument:
		properties - see Options in messageBox
	*/
    confirm: function(message, properties) {
        this.messageBox('confirm', message, properties);
    },
    /*
	Property: ChangePasseword
		permet de changer le password de l'usager
		
	Argument:
		properties - see Options in messageBox
	*/
    changePasseword: function(message, input, properties) {
        this.messageBox('changePasseword', message, properties, input);
    },
    /*
	Property: prompt
		Shortcut for prompt
		
	Argument:
		properties - see Options in messageBox
	*/
    prompt: function(message, input, properties) {
        this.messageBox('prompt', message, properties, input);
    },

    resizeOverlay: function() {
        this.Overlay.css({
            'height': $(window).outerHeight() + 'px',
            'width': $(window).outerWidth() + 'px'
        });
    }
};

//Controls.ModalAlert.implement(new Events, new Options);

/*window.addEvent('domready', function() {
    if (!Controls.ModalAlert.instance)
        Controls.ModalAlert.instance = new Controls.ModalAlert();
});*/
$(function() {
	ModalAlert.init();
});

if(typeof(ModalPopup) !== "undefined") {
	ModalPopup = ModalAlert;
}