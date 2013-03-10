/*
 *  Project	 : Nadeb Custom Scroll Plugin
 *  Description : Very simple Custom Scroll Plugin
 *  Author	  : Mateus Martins
 *  License	 : CC Attribution-No Derivative Works 2.5 Brazil - http://creativecommons.org/licenses/by-nd/2.5/br/deed.en_US
 *  Version	 : 1.0.0
 */

;(function ( $, window, document, undefined )
{
	var pluginName = "customScroll",
		defaults   = {
			'width'        : '300px',
			'height'       : '200px',
			'scrollHandle' : 
			{
				'background'   : '#333',
				'borderRadius' : '6px',
				'width'        : '12px'
			},
			'hand' : 
			{
				'background'   : '#f1f1f1',
				'borderRadius' : '4px',
				'height'       : '40px',
				'margin'       : '2px',
				'width'        : '8px'
			}
		};

	function Plugin( element, options )
	{
		this.element   = element;
		this.options   = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name     = pluginName;

		this.init();
	}

	Plugin.prototype = {

		init: function()
		{
			this.formatBox( $(this.element), this.options );
			
			this.hand          = $(this.element).find('.hand');
			this.scrollInner   = $(this.element).find('.scroll-contents');
			this.scrollContent = $(this.element);
			this.startDrag( this.hand, this.scrollContent, this.scrollInner );
		},

		startDrag : function(obj, content, inner)
		{
			var startY  = content.offset().top;
			var limitY  = content.height() - ( obj.height() + parseFloat( obj.css('marginTop') ) +  parseFloat( obj.css('marginBottom') ) );
			var ptClick = 0;

			this.hand.mousedown(
				function()
				{
					$('body').mousemove(
						function(e) 
						{
								if( ptClick == 0 ) ptClick = e.pageY - obj.offset().top;

								var dragY = (e.pageY - content.offset().top) - ptClick;

								if( dragY < 1 ) dragY = 0;
								if( dragY > limitY ) dragY = limitY;

								obj.css({
									'position' : 'absolute',
									'top'      : dragY
								});

								var yTop     = obj.offset().top - content.offset().top;
								var percentY = yTop / limitY;
								var areaY    = inner.height() - content.height();
								var move     = -areaY * percentY;

								console.info( inner.height() )

								inner.css({
									'position' : 'absolute',
									'top'      : move
								});

								return false;
						}
					);

					return false
				}
			);

			$('body').mouseup(
				function()
				{
					ptClick = 0;
					$('body').unbind('mousemove');
				}
			);
		},

		formatBox: function(obj, opt)
		{
			obj.html(
				'<span class="scroll-handle"><span class="hand"></span></span>' + '<div class="scroll-contents">' + obj.html() + '<div>'
			);

			obj.css({
				'width'    : opt.width,
				'height'   : opt.height,
				'position' : 'relative',
				'overflow' : 'hidden'
			});

			$('.hand').css({
				'cursor'     : 'pointer',
				'display'      : 'block'
			})


			$('.scroll-handle').css({
				'position'   : 'absolute',
				'top'        : '0',
				'right'      : '0',
				'height'     : opt.height,
				'zIndex'     : '999'
			})

			$('.hand').css(opt.hand);
			$('.scroll-handle').css(opt.scrollHandle);

			$('.scroll-contents').css({
				'top'      : '0',
				'left'     : '0',
				'width'    : obj.width() - ( $('.scroll-handle').width() + 5),
				'position' : 'absolute',
				'overflow' : 'hidden'
			});

		}
	};

	$.fn[pluginName] = function ( options ) 
	{
		return this.each(function () 
		{
			if (!$.data(this, "plugin_" + pluginName)) 
			{
				$.data(this, "plugin_" + pluginName, new Plugin( this, options ));
			}
		});
	};

})( jQuery, window, document );