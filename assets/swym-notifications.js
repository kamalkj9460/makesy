var __toastMarkup = `
<div class="position-fixed top-50 end-0 translate-middle-y p-3" style="z-index: 9999; max-width: 250px;">
		<div aria-atomic="true d-flex" aria-live="polite" class="toast hide" id="swym-toast" role="alert">
			<div class="toast-header">
				 <strong class="me-auto text-center">Successfully Added to Wishlist</strong>
                 <button aria-label="Close" class="btn-close"data-bs-dismiss="toast" type="button"></button>
			</div>
			<div class="toast-body">
			<a class="container" href="{{du}}"><img alt="Image" class="rounded mr-2 img-thumbnail" src="{{iu}}" style=></a>
            	<div class="me-auto text-center mt-2">
				<span class="strong text-center text-truncate">{{dt}} - {{variantInfo}} {{cu}}{{pr}}</span>
					<a class="me-auto link-info" href="#" id="openWl">View Wishlist</a>
				</div>
			</div>
		</div>
	</div>`;

function swymCallbackFn(swat) {
  //   Toast Options - Set Autohide to true, to hide after delay.
  let options = {
    autohide: true,
    delay: 6000,
    animation: true
  };

  function showCustomNotification(event) {
    var parentContainer = document.querySelector("#swym-custom-notify-container");
    var product = event.detail.d;
    if (parentContainer && bootstrap.Toast) {
      parentContainer.innerHTML = ""; // Reset old toasts;
      product = SwymUtils.formatProductPrice(product);
      product.variantInfo = getVariantInfo(product.variants);
      let toastDetails = SwymUtils.renderTemplateString(__toastMarkup, product);
      parentContainer.innerHTML = toastDetails;
      let toastElement = document.querySelector("#swym-toast");
      let toast = new bootstrap.Toast(toastElement, options);
      toast.show();
      bindEvent();

      function bindEvent() {
        document.getElementById('openWl').onclick = function() {
          swat.ui.open();
        }
      }
    }

    function getVariantInfo(variants) {
      try {
        let variantKeys = ((variants && variants != "[]") ? Object.keys(variants[0]) : []),
            variantinfo;
        if (variantKeys.length) {
          variantinfo = variantKeys[0];
        }
        return (variantinfo == "Default Title") ? "" : variantinfo;
      } catch (err) {
        return variants;
      }
    }
  }
  swat.evtLayer.addEventListener(swat.JSEvents.addedToWishlist, function(event) {
    //Show custom Notifications on event;	
    showCustomNotification(event);
  });
}
if (!window.SwymCallbacks) {
  window.SwymCallbacks = [];
}
window.SwymCallbacks.push(swymCallbackFn);