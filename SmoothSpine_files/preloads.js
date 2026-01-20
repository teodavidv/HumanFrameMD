
    (function() {
      var cdnOrigin = "https://cdn.shopify.com";
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.CFJwiHCL.js","/cdn/shopifycloud/checkout-web/assets/c1/app.B9mcwN21.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.DgL5bcaV.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage.C5JpbR3H.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalizationExtensionField.Cbg0PwDI.js","/cdn/shopifycloud/checkout-web/assets/c1/NumberField.2twX0iEi.js","/cdn/shopifycloud/checkout-web/assets/c1/useShowShopPayOptin.96moxofS.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayOptInDisclaimer.C1NW2oWK.js","/cdn/shopifycloud/checkout-web/assets/c1/RememberMeDescriptionText.CQMEkeA3.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentButtons.DFUs-IPD.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblemsLineItemList.il5gJITz.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalPickup.BiOaAjqx.js","/cdn/shopifycloud/checkout-web/assets/c1/useShopPayButtonClassName.CMSUZHcl.js","/cdn/shopifycloud/checkout-web/assets/c1/VaultedPayment.BTzIgHPE.js","/cdn/shopifycloud/checkout-web/assets/c1/SeparatePaymentsNotice.D4EjPkOE.js","/cdn/shopifycloud/checkout-web/assets/c1/useAddressManager.ZCyIOhUV.js","/cdn/shopifycloud/checkout-web/assets/c1/useShopPayQuery.D1LcHy4l.js","/cdn/shopifycloud/checkout-web/assets/c1/PayButtonSection.Bo5O8r2p.js","/cdn/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown.C28ou8Mm.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandiseModal.CkDJ3JD3.js","/cdn/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview.DXHxwHEb.js","/cdn/shopifycloud/checkout-web/assets/c1/component-ShopPayVerificationSwitch.DhPqkafn.js","/cdn/shopifycloud/checkout-web/assets/c1/useSubscribeMessenger.dYMjA9ko.js","/cdn/shopifycloud/checkout-web/assets/c1/shop-js-index.BXivc0rd.js","/cdn/shopifycloud/checkout-web/assets/c1/v4.BKrj-4V8.js","/cdn/shopifycloud/checkout-web/assets/c1/component-RuntimeExtension.r23647eg.js","/cdn/shopifycloud/checkout-web/assets/c1/AnnouncementRuntimeExtensions.BNgEoBox.js","/cdn/shopifycloud/checkout-web/assets/c1/Switch.rJO--QJc.js","/cdn/shopifycloud/checkout-web/assets/c1/rendering-extension-targets.BgvF3UGI.js","/cdn/shopifycloud/checkout-web/assets/c1/controller.D4EWes_p.js","/cdn/shopifycloud/checkout-web/assets/c1/receiver.Cec2U7LE.js","/cdn/shopifycloud/checkout-web/assets/c1/ExtensionsInner.BjsP4YhX.js","/cdn/shopifycloud/checkout-web/assets/c1/host.Djr6ieoM.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.CPuqBvEZ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.Bbt-2IKJ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/LocalizationExtensionField.Ca9titpM.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/LocalPickup.Dm9JB4kF.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShopPayVerificationSwitch.WW3cs_z5.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/NumberField.CRpcZnVJ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayButtonClassName.BrcQzLuH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/VaultedPayment.OxMVm7u-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StackedMerchandisePreview.D6OuIVjc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RuntimeExtension.DWkDBM73.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/AnnouncementRuntimeExtensions.CBn65ejv.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Switch.DLN3k-fn.css"];
      var fontPreconnectUrls = ["https://fonts.shopifycdn.com"];
      var fontPrefetchUrls = ["https://fonts.shopifycdn.com/poppins/poppins_n4.0ba78fa5af9b0e1a374041b3ceaadf0a43b41362.woff2?h1=c21vb3Roc3BpbmUuY29t&hmac=e2c8cf1e71c74b7038afea31db4b26f600352370e5c7133c20cc0808a9762f6c","https://fonts.shopifycdn.com/poppins/poppins_n7.56758dcf284489feb014a026f3727f2f20a54626.woff2?h1=c21vb3Roc3BpbmUuY29t&hmac=bc86b8a21ff5c905fb73deda5d5a3f0cfca33021bd0adabccb5cb591a4f90a30"];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0252/1261/6781/files/90_day_banner_x320.jpg?v=1725004149"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [cdnOrigin].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  