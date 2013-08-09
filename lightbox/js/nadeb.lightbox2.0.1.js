/*
 *  Project     : Nadeb Lightbox Plugin
 *  Description : Very simple Lightbox Plugin
 *  Author      : Mateus Martins
 *  License     : CC Attribution-No Derivative Works 2.5 Brazil - http://creativecommons.org/licenses/by-nd/2.5/br/deed.en_US
 *  Version     : 2.0.1
 */

;(function ( $, window, document, undefined )
{
	var imgSrc,
		pluginName          = "nadebLightBox",
		groupUID            = 0,
		showModalComplete   = jQuery.Event("showModalComplete"),
		resizeModalComplete = jQuery.Event("resizeModalComplete"),
		_onComplete         = {},
		
		_settings = {
			'fontTitle1'      : "'TradeGothicW01-BoldCn20 675334', Arial",
			'fontTitle2'      : "'Trade Gothic W01 Cn 18', Arial",
			'fontDescription' : "'Roboto Condensed', sans-serif",
			'bgColor'         : '#000000',
			'bgLoader'        : '#f1f1f1',
			'bgOpacity'       : 0.5,
			'subtitleHeight'  : 80,
			'border'          : 20,
			'urlLoader'       : 'https://raw.github.com/mateusweb/nadeb-components/master/lightbox/images/loading.gif',
			'close'           : 'https://raw.github.com/mateusweb/nadeb-components/master/lightbox/images/close.png',
			'next'            : 'https://raw.github.com/mateusweb/nadeb-components/master/lightbox/images/next.png',
			'back'            : 'https://raw.github.com/mateusweb/nadeb-components/master/lightbox/images/back.png'
		},
		_events = {
			open : function()
			{
				imgSrc           = $(this).attr('href');
				_settings.index  = $(this).data('nadeb-index');
				_settings.guid   = $(this).data('nadeb-group');
				_settings.limit  = $('.nadebLightGroup'+_settings.guid).length -1;
				_settings.sTiti  = $(this).data('title');
				_settings.sDesc  = $(this).data('description');
				
				var nadebWindow  = new NadebWindow( this );

				nadebWindow.appendObject( _settings.limit );
				nadebWindow.formatSmallWindow( _settings );
				nadebWindow.showModalBox( _settings );

				return false;
			},
			showModalComplete : function()
			{
				var nadebWindow = new NadebWindow( this );
				var loadImage   = NadebLoadImage( _settings, this );
				var img         = new Image();
				
				nadebWindow.writeLegent();
				$(img).attr('src', imgSrc ).load( loadImage.loadComplete );
			},
			resizeModalComplete : function()
			{
				var loadImage = NadebLoadImage( _settings, this );

				loadImage.showLoadedImage( _settings );
			},
			close : function()
			{
				$('.ltBox_bg, .ltBox_tools, .ltBox_bgContainer, .ltBox_container, .ltBox_subtitle').remove();
			},
			back : function()
			{
				var item = _settings.index == 0 ? _settings.limit : _settings.index - 1;
				_settings.newImage = $('.nadebLightGroup'+_settings.guid+':eq('+ item +')');
				
				_events.hiddenImage.call();
			},
			next : function()
			{
				var item = _settings.index >= _settings.limit ? 0 : _settings.index + 1;
				_settings.newImage = $('.nadebLightGroup'+_settings.guid+':eq('+ item +')');
				
				_events.hiddenImage.call();
			},
			hiddenImage : function()
			{
				$('.ltBox_tools .back, .ltBox_tools .next').fadeTo(300,0);
				$('.ltBox_subtitle').fadeTo(500, 0);
				$('.ltBox_container').fadeTo(800, 0, 
					function()
					{
						imgSrc           = _settings.newImage.attr('href');
						_settings.index  = _settings.newImage.data('nadeb-index');
						_settings.sTiti  = _settings.newImage.data('title');
						_settings.sDesc  = _settings.newImage.data('description');

						$('.ltBox_container').html('');
						_events.showModalComplete.call( _settings.newImage );
					}
				);
			}
	};

	$.fn[pluginName] = function ( settings, onComplete, overrideEvents ) 
	{
		i = 0;
		return this.each(function()
		{
			if ( !$.data(this, "plugin_" + pluginName) )
			{
				i == 0 ? groupUID++ : groupUID;
				$(this).attr('data-nadeb-index', i++).attr('data-nadeb-group', groupUID).addClass('nadebLightGroup' + groupUID);
				$.data( this, "plugin_" + pluginName, new NadebLightBox( this, settings, onComplete, overrideEvents ) );
			}
		});
	};

	NadebLightBox = function( element, settings, onComplete, overrideEvents ) 
	{
		/*
		 * Override Internal Configs
		 */
		if ( settings )       $.extend( {}, _settings, settings );
		if ( onComplete )     $.extend( {}, _onComplete, onComplete );
		if ( overrideEvents ) $.extend( {}, _events, overrideEvents );

		this.element      = element;
		this._name        = pluginName;
		this._settings    = _settings;
		this._onComplete  = _onComplete;
		this._events      = _events;
		this.init();
	};

	NadebLightBox.prototype = {

		init : function()
		{
			$(this.element).on( 'click', this._events.open );
			$(this.element).on( 'showModalComplete', this._events.showModalComplete );
			$(this.element).on( 'resizeModalComplete', this._events.resizeModalComplete ); 
		}
	};

	NadebLoadImage = function( _settings, obj )
	{
		var nadebLoadImage = this;
		this.loadComplete = function()
		{
			var newSize   = nadebLoadImage.getNewSizes( this );
			var newImgage = $(this).attr('width', newSize.imageWidth).attr('height', newSize.imageHeight);

			var nadebWindow = new NadebWindow( obj );

			nadebWindow.resizeAll( this.width, this.height, _settings );

			$('.ltBox_container').html( this );
			$('.ltBox_container').hide();
		}

		this.showLoadedImage = function()
		{
			setTimeout(
				function()
				{
					$('.ltBox_container').fadeTo('slow', 1);
				},
				500
			);
			setTimeout(
				function()
				{
					( _settings.sTiti || _settings.sDesc ? $('.ltBox_subtitle').fadeTo('slow', 1) : '' );
				},
				750
			);
			setTimeout(
				function()
				{
					$('.ltBox_tools .back, .ltBox_tools .next').fadeTo('slow', 1);
				},
				1000
			);
		}

		this.getNewSizes = function( img )
		{
			var diffHeight     = _settings.border + _settings.subtitleHeight + 40
			var diffWidth      = _settings.border + 40
			var imageHeight    = img.height;
			var imageWidth     = img.width;
			var lightboxHeight = (imageHeight + diffHeight);
			var lightboxWidth  = (imageWidth + diffWidth);
			var windowHeight   = $(window).height();
			var windowWidth    = $(window).width();

			if( windowHeight < lightboxHeight )
			{
				newHeight   = windowHeight - diffHeight;
				imageWidth  = imageWidth / imageHeight * newHeight;
				imageHeight = newHeight;
			}

			if( windowWidth < lightboxWidth )
			{
				newWidth    = windowWidth - diffWidth;
				imageHeight = imageHeight / imageWidth *  newWidth; 
				imageWidth  = newWidth;
			}

			return {
				'imageHeight' : imageHeight,
				'imageWidth'  : imageWidth
			}
		}

		return this;
	}

	NadebWindow = function( _obj )
	{
		this.showModalBox = function( _settings )
		{
			$('.ltBox_bg').fadeTo('fast', _settings.bgOpacity, function()
			{
				$('.ltBox_bgContainer').fadeTo('slow',1);
				$('.ltBox_tools').fadeTo('slow',1, function()
				{
					jQuery( _obj ).trigger( showModalComplete );
				});
			});
		}

		this.writeLegent = function()
		{
			$('.ltBox_subtitleIndex').html( (_settings.index+1) + '/' +  (_settings.limit+1) );
			$('.ltBox_subtitleTitle').html( _settings.sTiti );
			$('.ltBox_subtitleDescription').html( _settings.sDesc );
		}

		this.appendObject = function( limit )
		{
			$('body').append(
				'<div class="ltBox_bg"></div>'+
				'<div class="ltBox_tools">'+
					'<div class="closeNadeb">[ x ]</div>'+
					
					(limit > 0 ? '<div class="back">[ < ]</div><div class="next">[ > ]</div>' : '') +

				'</div>'+
				'<div class="ltBox_bgContainer"></div>'+
				'<div class="ltBox_container"></div>'+

				'<div class="ltBox_subtitle">'+
					'<div class="ltBox_subtitleIndex"></div>'+
					'<div class="ltBox_subtitleInfo">'+
						'<h3 class="ltBox_subtitleTitle"></h3>'+
						'<p class="ltBox_subtitleDescription"></p>'+
					'</div>'+
				'</div>'
				
			);

			$('.ltBox_bg, .ltBox_tools .closeNadeb').off( 'click', _events.close );
			$('.ltBox_tools .next').off( 'click', _events.next );
			$('.ltBox_tools .back').off( 'click', _events.back );

			$('.ltBox_bg, .ltBox_tools .closeNadeb').on( 'click', _events.close );
			$('.ltBox_tools .next').on( 'click', _events.next );
			$('.ltBox_tools .back').on( 'click', _events.back );
		}

		this.resizeAll = function( w, h, _settings )
		{
			h = ( _settings.sTiti || _settings.sDesc ? h + _settings.subtitleHeight : h );


			var bgContainer = {
					'marginTop'  : -(h + _settings.border)/2,
					'marginLeft' : -(w + _settings.border)/2,
					'height'     :  (h + _settings.border),
					'width'      :  (w + _settings.border)
				}
			var container = {
					'marginTop'  : -h/2,
					'marginLeft' : -w/2,
					'height'     :  h,
					'width'      :  w
				}
			var tools = {
					'marginTop'  : -(h + _settings.border * 2)/2,
					'marginLeft' : -(w + _settings.border * 2)/2,
					'height'     :  (h + _settings.border * 2),
					'width'      :  (w + _settings.border * 2)
				}
			var subtitle = {
					'width'      :  w,
					'marginLeft' : -w/2,
					'marginTop'  : (h/2) - _settings.subtitleHeight
				}
			var navigation = {
					'top'  : h/2
				}


			$('.ltBox_tools .back, .ltBox_tools .next').css( navigation );
			$('.ltBox_subtitle').css( subtitle );
			$('.ltBox_bgContainer').animate( bgContainer, { duration: 500} );
			$('.ltBox_tools').animate(
				tools, 
				{
					duration  : 500,
				 	complete  : function()
								{
									$('.ltBox_container').css( container );
									jQuery( _obj ).trigger( resizeModalComplete );
								}
				}
			);
		}

		this.formatSmallWindow = function( _settings )
		{
			$('.ltBox_bg').css({
				'backgroundColor' : _settings.bgColor,
				'position' : 'fixed',
				'height'   : '100%',
				'width'    : '100%',
				'left'     : '0',
				'top'      : '0',
				'zIndex'   : '10000'
			});

			$('.ltBox_tools').css({
				'position'   : 'fixed',
				'height'     : '170px',
				'width'      : '200px',
				'top'        : '50%',
				'left'       : '50%',
				'margin'     : '-85px 0 0 -100px',
				'zIndex'     : '10004'
			});

			$('.ltBox_bgContainer').css({
				'background' : _settings.bgLoader + ' url('+ _settings.urlLoader +') center no-repeat',
				'position'   : 'fixed',
				'height'     : '156px',
				'width'      : '186px',
				'top'        : '50%',
				'left'       : '50%',
				'margin'     : '-76px 0 0 -93px',
				'zIndex'     : '10002'
			});

			$('.ltBox_container').css({
				'position'   : 'fixed',
				'top'        : '50%',
				'left'       : '50%',
				'display'    : 'none',
				'zIndex'     : '10003'
			});

			$('.ltBox_subtitle').css({
				'background' : _settings.bgLoader,
				'color'      : '#333333',
				'position'   : 'fixed',
				'top'        : '50%',
				'left'       : '50%',
				'overflow'   : 'hidden',
				'height'     : _settings.subtitleHeight,
				'display'    : 'none',
				'zIndex'     : '10006'
			});

			$('.ltBox_subtitleIndex').css({
				'fontFamily'    : _settings.fontTitle2,
				'borderRight'   : '1px dotted #CCCCCC',
				'float'         : 'left',
				'fontSize'      : '60px',
				'height'        : '70px',
				'letterSpacing' : '-2px',
				'lineHeight'    : '76px',
				'marginRight'   : '10px',
				'marginTop'     : '10px',
				'paddingRight'  : '10px',
				'textAlign'     : 'center'
			});

			$('.ltBox_subtitleTitle').css({
				'fontFamily' : _settings.fontTitle1,
				'fontSize'   : '26px',
				'lineHeight' : '32px',
				'paddingTop' : '10px'
			});

			$('.ltBox_subtitleDescription').css({
				'fontFamily' : _settings.fontDescription,
				'fontSize'   : '16px',
				'lineHeight' : '19px'
			});


			$('.ltBox_tools .closeNadeb').css({
				'background' : 'url("'+ _settings.close +'") no-repeat 0 0',
				'height'     : '30px',
				'overflow'   : 'hidden',
				'padding'    : '0',
				'textIndent' : '-999px',
				'width'      : '30px',
				'float'      : 'right',
				'cursor'     : 'pointer'
			});

			$('.ltBox_tools .back').css({
				'background' : 'url("'+ _settings.back +'") no-repeat 0 0',
				'height'     : '30px',
				'overflow'   : 'hidden',
				'padding'    : '0',
				'textIndent' : '-999px',
				'width'      : '30px',
				'position'   : 'absolute',
				'left'       : _settings.border * 2,
				'top'        : '75px',
				'cursor'     : 'pointer',
				'zIndex'     : '1',
				'display'    : 'none'
			});

			$('.ltBox_tools .next').css({
				'background' : 'url("'+ _settings.next +'") no-repeat 0 0',
				'height'     : '30px',
				'overflow'   : 'hidden',
				'padding'    : '0',
				'textIndent' : '-999px',
				'width'      : '30px',
				'position'   : 'absolute',
				'right'      : _settings.border * 2,
				'top'        : '75px',
				'cursor'     : 'pointer',
				'zIndex'     : '1',
				'display'    : 'none'
			});


			$('.ltBox_bg, .ltBox_tools, .ltBox_bgContainer, .ltBox_container').hide();
		}
	}

})( jQuery, window, document );