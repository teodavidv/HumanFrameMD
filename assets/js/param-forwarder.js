/**
 * SpineRelief URL Parameter Forwarder
 * 
 * This script automatically captures URL parameters and appends them to all links
 * on the page, ensuring attribution data flows through the entire customer journey.
 * 
 * Features:
 * - Captures all URL parameters on page load
 * - Stores parameters in sessionStorage for persistence across page loads
 * - Appends parameters to all internal links and checkout links
 * - Handles dynamically added links via MutationObserver
 * - Works across both buyspinerelief.com and checkout.buyspinerelief.com
 * 
 * Common parameters preserved:
 * - UTM parameters (utm_source, utm_medium, utm_campaign, utm_content, utm_term)
 * - Facebook Click ID (fbclid)
 * - Google Click ID (gclid)
 * - TikTok Click ID (ttclid)
 * - Custom tracking parameters
 */

(function() {
  'use strict';

  // Configuration
  var CONFIG = {
    // Domains that should receive parameters
    allowedDomains: [
      'buyspinerelief.com',
      'checkout.buyspinerelief.com',
      'www.buyspinerelief.com'
    ],
    // Storage key for persisting parameters
    storageKey: 'spinerelief_url_params',
    // Parameters to always forward (even if not in current URL)
    priorityParams: [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'fbclid', 'gclid', 'ttclid', 'msclkid', 'dclid',
      'ref', 'affiliate', 'aff_id', 'sub_id', 'click_id',
      'ad_id', 'adset_id', 'campaign_id', 'placement'
    ],
    // Parameters to exclude from forwarding
    excludeParams: ['_ga', '_gl', '_gid']
  };

  /**
   * Get current URL parameters as an object
   */
  function getCurrentParams() {
    var params = {};
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach(function(value, key) {
      if (CONFIG.excludeParams.indexOf(key) === -1) {
        params[key] = value;
      }
    });
    return params;
  }

  /**
   * Get stored parameters from sessionStorage
   */
  function getStoredParams() {
    try {
      var stored = sessionStorage.getItem(CONFIG.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.warn('[ParamForwarder] Error reading stored params:', e);
      return {};
    }
  }

  /**
   * Store parameters in sessionStorage
   */
  function storeParams(params) {
    try {
      sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(params));
    } catch (e) {
      console.warn('[ParamForwarder] Error storing params:', e);
    }
  }

  /**
   * Merge current URL params with stored params (current takes precedence)
   */
  function getMergedParams() {
    var stored = getStoredParams();
    var current = getCurrentParams();
    
    // Merge: stored params as base, current params override
    var merged = Object.assign({}, stored, current);
    
    // Store the merged result for future pages
    storeParams(merged);
    
    return merged;
  }

  /**
   * Check if a URL should have parameters appended
   */
  function shouldProcessUrl(url) {
    if (!url || url === '#' || url.startsWith('javascript:') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return false;
    }
    
    try {
      var urlObj = new URL(url, window.location.origin);
      var hostname = urlObj.hostname.toLowerCase();
      
      // Check if it's a relative URL or matches allowed domains
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        return true;
      }
      
      // Check against allowed domains
      for (var i = 0; i < CONFIG.allowedDomains.length; i++) {
        if (hostname === CONFIG.allowedDomains[i] || hostname.endsWith('.' + CONFIG.allowedDomains[i])) {
          return true;
        }
      }
      
      return false;
    } catch (e) {
      // If URL parsing fails, try to process relative URLs
      return url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || !url.includes('://');
    }
  }

  /**
   * Append parameters to a URL
   */
  function appendParamsToUrl(url, params) {
    if (!url || Object.keys(params).length === 0) {
      return url;
    }

    try {
      var urlObj;
      var isRelative = !url.includes('://');
      
      if (isRelative) {
        urlObj = new URL(url, window.location.origin);
      } else {
        urlObj = new URL(url);
      }

      // Add each parameter if not already present
      Object.keys(params).forEach(function(key) {
        if (!urlObj.searchParams.has(key)) {
          urlObj.searchParams.set(key, params[key]);
        }
      });

      // Return the appropriate format
      if (isRelative) {
        return urlObj.pathname + urlObj.search + urlObj.hash;
      }
      return urlObj.toString();
    } catch (e) {
      // Fallback: simple string concatenation
      var separator = url.includes('?') ? '&' : '?';
      var paramString = Object.keys(params).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
      
      // Handle hash in URL
      var hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        return url.substring(0, hashIndex) + separator + paramString + url.substring(hashIndex);
      }
      return url + separator + paramString;
    }
  }

  /**
   * Process a single link element
   */
  function processLink(link, params) {
    var href = link.getAttribute('href');
    
    if (shouldProcessUrl(href)) {
      var newHref = appendParamsToUrl(href, params);
      if (newHref !== href) {
        link.setAttribute('href', newHref);
        link.setAttribute('data-params-added', 'true');
      }
    }
  }

  /**
   * Process all links on the page
   */
  function processAllLinks(params) {
    var links = document.querySelectorAll('a[href]:not([data-params-added="true"])');
    links.forEach(function(link) {
      processLink(link, params);
    });
  }

  /**
   * Set up MutationObserver to handle dynamically added links
   */
  function setupObserver(params) {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Process the node if it's a link
            if (node.tagName === 'A' && node.hasAttribute('href')) {
              processLink(node, params);
            }
            // Process any links within the node
            var childLinks = node.querySelectorAll ? node.querySelectorAll('a[href]:not([data-params-added="true"])') : [];
            childLinks.forEach(function(link) {
              processLink(link, params);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Handle form submissions (for search forms, etc.)
   */
  function processForm(form, params) {
    var action = form.getAttribute('action');
    if (shouldProcessUrl(action)) {
      // Add hidden inputs for each parameter
      Object.keys(params).forEach(function(key) {
        if (!form.querySelector('input[name="' + key + '"]')) {
          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = params[key];
          form.appendChild(input);
        }
      });
    }
  }

  /**
   * Process all forms on the page
   */
  function processAllForms(params) {
    var forms = document.querySelectorAll('form[action]:not([data-params-added="true"])');
    forms.forEach(function(form) {
      processForm(form, params);
      form.setAttribute('data-params-added', 'true');
    });
  }

  /**
   * Push parameters to dataLayer for GTM
   */
  function pushToDataLayer(params) {
    window.dataLayer = window.dataLayer || [];
    
    // Only push if we have tracking parameters
    var trackingParams = {};
    CONFIG.priorityParams.forEach(function(key) {
      if (params[key]) {
        trackingParams[key] = params[key];
      }
    });

    if (Object.keys(trackingParams).length > 0) {
      window.dataLayer.push({
        event: 'url_params_captured',
        url_params: trackingParams
      });
      console.log('[ParamForwarder] Pushed to dataLayer:', trackingParams);
    }
  }

  /**
   * Initialize the parameter forwarder
   */
  function init() {
    // Get merged parameters (current URL + stored)
    var params = getMergedParams();
    
    if (Object.keys(params).length === 0) {
      console.log('[ParamForwarder] No parameters to forward');
      return;
    }

    console.log('[ParamForwarder] Parameters to forward:', params);

    // Push to dataLayer for GTM tracking
    pushToDataLayer(params);

    // Process existing links
    processAllLinks(params);
    
    // Process existing forms
    processAllForms(params);

    // Set up observer for dynamically added content
    if (document.body) {
      setupObserver(params);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        setupObserver(params);
      });
    }

    // Re-process links after a short delay (for JS-rendered content)
    setTimeout(function() {
      processAllLinks(params);
      processAllForms(params);
    }, 1000);

    // Re-process again after longer delay (for lazy-loaded content)
    setTimeout(function() {
      processAllLinks(params);
      processAllForms(params);
    }, 3000);
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also run on window load (catches late-rendered content)
  window.addEventListener('load', function() {
    var params = getMergedParams();
    if (Object.keys(params).length > 0) {
      processAllLinks(params);
      processAllForms(params);
    }
  });

  // Expose for debugging
  window.SpineReliefParamForwarder = {
    getParams: getMergedParams,
    processLinks: function() { processAllLinks(getMergedParams()); },
    appendParams: appendParamsToUrl
  };

})();
