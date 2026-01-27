/**
 * Product page coupon display public side JS file.
 *
 * @since 3.5.0
 * @package Wt_Smart_Coupon
 */

( function ( $ ) {
	'use strict';

    jQuery(document).ready(function($) {
        $('.wbte_sc_cpns_pp_copy_btn').on('click', function() {
            const code = $(this).closest('.wbte_sc_cpns_pp_card_coupon_box').find('.wbte_sc_cpns_pp_code').text();
            const $button = $(this);
            const originalText = $button.text();
          
            function copyToClipboard(text) {
                if ( navigator.clipboard && window.isSecureContext ) {
                    return navigator.clipboard.writeText(text).then(function() {
                        return true;
                    }).catch(function(err) {
                        return false;
                    });
                }
              
                /** Fallback for older browsers */
                return new Promise(function(resolve) {
                    try {
                        const textArea = document.createElement('textarea');
                        textArea.value = text;
                        textArea.style.position = 'fixed';
                        textArea.style.left = '-999999px';
                        textArea.style.top = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                      
                        const successful = document.execCommand('copy');
                        document.body.removeChild(textArea);
                        resolve(successful);
                    } catch (err) {
                        resolve(false);
                    }
                });
            }
          
            copyToClipboard(code).then(function(success) {
                if (success) {
                    $button.find('span').text(WTSmartCouponOBJ.labels.copied);
                    setTimeout(function() {
                        $button.find('span').text(originalText);
                    }, 1500);
                }
            });
        });
    });

} )( jQuery );