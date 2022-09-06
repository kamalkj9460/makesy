/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

// Swaps DetailNav in the desktop header on hover over submenu title



// Open external links in new tab
var links = document.links;
for (let i = 0, linksLength = links.length; i < linksLength; i++) {
  if (links[i].hostname !== window.location.hostname) {
    links[i].target = "_blank";
    links[i].rel = "noreferrer noopener";
  }
}

// Open Wishlist page when filled heart is clicked on Collections, other
// pages that use `prodict-item.liquid`.
const swymButton = document.querySelectorAll(".swym-button");
swymButton.forEach(heart => {
	heart.addEventListener("click", function (event) {
      if (event.target.classList.contains("swym-added")) {
        window.open("/apps/swymWishlist/wishlist/index.php", "_self");
      }
	  });
})


// Remove target=_blank attribute from Homepage Featured Videos that's being produced by the Open External Link script above.
let homepageFeatureVideoLink = document.querySelector(".DuelVideoWrapper a");
if (homepageFeatureVideoLink) {
  homepageFeatureVideoLink.removeAttribute("target");
}

