/**
 * Coupon style common JS file.
 *
 * @since 3.3.0
 * @package Wt_Smart_Coupon
 */

( function ( $ ) {
	'use strict';

    function fitCouponAmount() {
        $(".wt-single-coupon.voucher_style .wt_sc_coupon_amount, .wt-single-coupon.festive_vibe .wt_sc_coupon_amount").each(function () {
            let $this = $(this),
                parent = $this.parent(),
                fontSize = 32;
            
            $this.css("font-size", fontSize + "px");
            
            while ($this[0].scrollWidth > parent.width() && fontSize > 12) {
                $this.css("font-size", --fontSize + "px");
            }
        });

        $(".wt-single-coupon.badge_style .wt_sc_coupon_amount").each(function () {
            let $this = $(this),
                $starImage = $this.closest('.wbte_sc_coupon_body_left').find('svg'),
                fontSize = 32,
                containerWidth = $starImage.width() - 18;
            
            let $measure = $('<span>')
                .text($this.text())
                .css({
                    'font-size': fontSize + 'px',
                    'font-family': $this.css('font-family'),
                    'font-weight': $this.css('font-weight'),
                    'visibility': 'hidden',
                    'position': 'absolute',
                    'white-space': 'nowrap'
                })
                .appendTo('body');
            
            let textWidth = $measure.width();
            
            while (textWidth > containerWidth && 16 < fontSize) {
                fontSize--;
                $measure.css('font-size', fontSize + 'px');
                textWidth = $measure.width();
            }
            
            $this.css('font-size', fontSize + 'px');
            $measure.remove();
        });
    }

    $( document ).ready( function() {
        const checkInterval = setInterval( () => {
            if ( $('.wt_coupon_wrapper').length ) {
                fitCouponAmount();
                clearInterval(checkInterval);
            }
        }, 20 );
    } );
    $( window ).on( "resize", fitCouponAmount );

} )(jQuery);