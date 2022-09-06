// @ts-nocheck
"use strict";

const stockState = {
    productTitle: '',
    productHandle: '',
    productImgUrl: '',
    productId: '',
    variantId: '',
    itiInput: '',
    emailInput: document.querySelector('.e-emailInput'),
    phoneInput: document.querySelector('.e-phoneInput'),
    submitBtn: document.querySelector('.e-notifySend'),
    notifyBtn: document.querySelector('.e-notifyBtn')
}

async function clearCart(formData) {

    try {
        const res = await fetch('/cart/clear.js', {
            method: 'POST'
            // body: JSON.stringify(formData)
        })
        const json = await res.json()
        console.log('json:', json)
        
        // If cart Error run message 
        if(json.status) return pdp_wicks.addMessage(json.description, true, true)

        updateCart(json)
    } catch (error) {
        console.log('cart error:', error)
    }
}
// clearCart()
async function add_to_cart(formData) {
    console.log('formData:', formData)
    try {
        const res = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const json = await res.json()
        console.log('json:', json)
        
        // If cart Error run message 
        if(json.status) return pdp_wicks.addMessage(json.description, true, true)

        updateCart(json)
    } catch (error) {
        console.log('cart error:', error)
    }
}

/* Ater item added to cart update cart with new item and open it */
async function updateCart(returnData) {

    const openCartBtn = document.querySelector('[data-action="open-drawer"]')
    const cartIcon = document.querySelector('[data-action="open-drawer"] .small')
    const res = await fetch('/cart' + '?view=drawer&timestamp=' + Date.now(), {
        credentials: 'same-origin',
        method: 'GET'
    })

    const html = await res.text()
    const cartQuantityData = new DOMParser().parseFromString(html, 'text/html').querySelectorAll('[data-line-item-quantity]')

    /* Gets all line items from cart and adds the total together */
    const cartTotal = Array.from(cartQuantityData).reduce((prev, data) => {
        const quantity = Number(data.dataset.lineItemQuantity)
        return prev + quantity
    }, 0)

    cartTotal > 99 ? cartIcon.classList.add('small-many') : cartIcon.classList.remove('small-many')
    cartIcon.textContent = cartTotal

    const currentCart = document.querySelector('.Cart')
    const parent = currentCart.parentNode
    const newCartItem = new DOMParser().parseFromString(html, 'text/html').querySelector('.Cart')

    /* Added stops sale item from being clicked */
    Array.from(newCartItem.querySelectorAll('.CartItem__Title.Heading a')).forEach(title => {
        if (title.textContent === 'you planted trees for earth day') {
            title.style.pointerEvents = 'none'
        }
    })

    parent.replaceChild(newCartItem, currentCart)
    openCartBtn.click();
    updateShippingPercent(returnData)
}

function updateShippingPercent(returnData){
    const itemPrice = Number( ( (returnData.items[0].final_price * currentQuantity) / 100).toFixed(2))
    const percentProgress = document.querySelector('.progress_percent')
    const textProgress = document.querySelector('.text_progress')

    const currentPercent = Number(percentProgress.style.width.replace(/(\d+\.\d{2}|\d{0,2})(.+)/g, '$1'))
    const newPercentage = currentPercent + itemPrice 
    if(currentPercent >= 100 || newPercentage >= 100) {
        percentProgress.style.width = newPercentage+'%'
        return textProgress.textContent = 'You Qualify for Free Domestic Shipping'
    }
        
    percentProgress.style.width = newPercentage + '%'
    textProgress.textContent = 'You are $'+ (99 - newPercentage).toFixed(2) +' away from Free Domestic Shipping'
}

function pinIt(e) {
    // console.log('WIP pinIt:', e)
    // console.log('stockState.productImgUrl:', stockState.productImgUrl)
    const {imgurl} = e.target.dataset
    console.log('data-imgurl:', imgurl)
    
    // https://pinterest.com/pin/create/button/?url=https://makesy.com/products/12oz-matte-umber-aura&amp;media=https://cdn.shopify.com/s/files/1/0411/8246/2106/products/vessel_aura_matte_umber_candle_large.jpg?v=1646843493&amp;description=Bold%20%26amp;%20elevated%20matte%20coffee%20brown%20glass.%20Single%20Candle%20Jar%20($5.40%20each)Buy%201%20Case%20Pack...
    const pinterest = 'https://pinterest.com/pin/create/button/?'
    const url = 'url=' + window.location.href
    // const media = 'media=' + stockState.productImgUrl
    const media = stockState.productImgUrl === '' ? `media=${imgurl}` : `media=${stockState.productImgUrl}`
    // const media = 'media=https:' + imgurl
    window.open(`${pinterest}${url}&${media}`, '_blank')
}

// add_to_cart({
//     items: [{
//         id: 41043337019546,
//         quantity: 2,
//         properties: {
//             percent: "20,25,30,35,40",
//             quantity: "1,5,10,50,100"
//         }
//     }]
// })

class PDP {
    static get PDP_elements() {
        return document.querySelectorAll('.breadcrumb, .PDP_thumbs, .PDP_mainImage, .PDP_heading-title, .wish-list-heart, .PDP_price, .PDP_inventory,' +
        '.PDP_description, .PDP_color, .btn-dropdown-quantity, .options-select, .PDP_bulk_message, .PDP__cart-submit, .PDP-more-information, .PDP-made-better, .PDP-clips')
    }
    
    constructor() {
        this.thumbs = document.querySelector('.PDP_thumbs')
        this.resizeObserver()
        this.swatchers()
        this.addEventListeners()
        this.stickyCTA()
        this.observeDocumentMutations()
        this.popState()
        this.onLoadChanges()
        this.state = {
            options: {},
            product_type: meta.product.type,
            pricings: {},
            inventory: {},
            inventoryPolicy: {},
            quantity: null,
            browserBack: false,
            madeBetter: {desc: made_better_desc, icons: made_better_icon},
            previous: {color: ''}
        }
    }

    addEventListeners() {
        document.querySelector('.PDP__cart-submit').addEventListener('click', this.cartController.bind(this))
        
        // After all inputs added dynamically on page load then eventlistenders are added to them */
        Array.from(document.querySelectorAll('.m-dropdown input, .Dialog_list input'))
        .forEach(input => input.addEventListener('input', this.updateOptionValues.bind(this)))
    }

    positionThumbs() {
        let fragment = new DocumentFragment();
        const thumbsContainer = document.querySelector('.PDP_thumbs')
        const thumbs = thumbsContainer.querySelectorAll('img')
        const main_img = PDP.PDP_elements[2]
    
        thumbs.forEach(function(img, i) {
            const new_img = img.cloneNode(true)
            new_img.style.position = 'absolute'
            new_img.style.top = '0px'
            new_img.style.left = '0px'
            fragment.appendChild(new_img);
        });
        main_img.appendChild(fragment)
    
        thumbsContainer.onclick = e => {
            revealImg(e.target)
        }
    
        function revealImg(target) {
            const tagName = target.tagName
            if(tagName === 'IMG') Array.from(main_img.children).forEach(el => {
    
                if(el.className && el.className !== 'ProductMetaTitle__PinItIcon fade-in') {
                    el.className = ''
                } 
    
                if(el.src === target.src) {
                    el.className = 'fade-in'
                } 
            })
        }
    }

    onLoadChanges(el) {
        const inventoryElem = document.querySelector('.PDP_inventory')
        const product_id = document.querySelector('input[data-products-id]')

        if(inventoryElem) {
            const replaceWithCommas = (match) => match.split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," )
            let currentText = inventoryElem.textContent.replace(/([\d]+)/, replaceWithCommas)
            inventoryElem.textContent = currentText
        }
        this.positionThumbs()
        /* Multiple dropdowns for options such as "money maker candle kit" and t-shirts */
        if(!this.isWickProduct() && product_id) this.productAPI(product_id.dataset.productsId, (data) => {
            this.filterOptions(data.product.variants)
            this.updateProductContent(data.product)
        })
    }

    observeDocumentMutations() {
        const callback = (mutationsList) => {
            let i = mutationsList.length
            while(i--) {
                const record = mutationsList[i]
                if(record.addedNodes.length && record.target.tagName == 'BUTTON') {
                    record.addedNodes[0].addEventListener('input', this.updateOptionValues.bind(this))
                }
            }
        }
        const config = {subtree: true, childList: true};
        this.observer = new MutationObserver(callback);
        this.observer.observe(document.querySelector('.PDP_product-form'), config);
    }

    resizeObserver() {
        const callback = (mutationsList) => {
            if (window.innerWidth <= 490 ) return;
            // + 20 for the extra bottom margin
            const totalThumbsHeight = Array.from(this.thumbs.children).reduce((prev, thumb) => prev + (thumb.offsetHeight + 20), 0)
            const { height } = mutationsList[0].contentRect
            this.thumbs.style.height = totalThumbsHeight < height ? totalThumbsHeight + 'px' : height + 'px'
        }

        try {
            this.observer = new ResizeObserver(callback);
            this.observer.observe(document.querySelector('.PDP_mainImage'));
        } catch(err) {
            console.log('err:', err)
        }
    }

    stickyCTA() {
        const submitBTN = document.querySelector('.PDP__cart-submit')
        const bottomDropDown = document.querySelector('.m-dropdown-quantity')
        let hasSticky = false
        const options = {
            childList: true
        };

        function handleIntersect(entries, observer) {
            const isVisable = entries[0].isIntersecting
            const isBelowScreen = entries[0].boundingClientRect.bottom > window.innerHeight

            if(!isVisable && !hasSticky && isBelowScreen) {
                submitBTN.classList.add('PDP-btn-sticky')
                hasSticky = true
            } else if(hasSticky && isVisable) {
                submitBTN.classList.remove('PDP-btn-sticky')
                hasSticky = false
            }
        }
        const observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(bottomDropDown);
    }

    popState() {
        window.addEventListener('popstate', e => {
            this.state.browserBack = true
            const state = e.state
            state ? state.collection ? this.updateWithCollection(state) : this.updateWithProduct(state) : location.reload();
        })
    }



    updateProductContent(data, color) {
        console.log('data:', data)
        const product = data.product || data

        if (!product) return;

        const variants = product.variants
        /* By default first variant is selected for the id */
        const id = variants[0].id.replace(/[^0-9]/g, '')
        stockState.variantId = id
        const images = product.images

        /* Update URL with new handle */
        const nextURL = window.location.href.replace(/(.+\/products\/)(.+)/, `$1${product.handle}?variant=${id}`)

        /* Only false during initial page load, updates previous state & history with swatch color */
        if(!this.state.previous.color) {
            color = document.querySelector(`[data-swatch-product-id="${meta.product.id}"]`)?.dataset?.swatchColor
            this.state.previous.color = color
        }
        
        if(color) {
            data.color = color
        }
        !this.state.browserBack && history.pushState(data, "", nextURL);

        
        PDP.PDP_elements.forEach(el => {
            const classNames = el.classList[0]
            switch (classNames) {
                case 'breadcrumb':
                    el.querySelector('#dv_rbd02').textContent = product.title
                    break;
                case 'PDP_thumbs':
                    const newChildren = images.reduce((arr, image, i) => {
                        /* Show thumbs only if not plain swatch color (200x200) or first image which is the main image */
                        const ratio = image.width / image.height
                        
                        if (ratio < 1 && ratio > .7) {
                            const div = document.createElement('div')
                            div.className = 'PDP_thumb showNewImg'
                            const img = new Image()
                            img.src = image.url
                            div.appendChild(img)
                            arr.push(div)
                        }
                        return arr
                    }, [])
                    /* If only the main image exist for a thumb remove all thumbs */
                    if(newChildren.length == 1) return el.replaceChildren(...[]);
                    el.replaceChildren(...newChildren)
                    this.thumbs = document.querySelector('.PDP_thumbs')
                    break;
                case 'PDP_mainImage':
                    const currentThumbs = Array.from(el.children)
                    console.log('currentThumbs:', currentThumbs)
                    currentThumbs.forEach(currentIMG => {
                        // console.log('WIP currentIMG:', currentIMG)
                        // console.log('WIP currentIMG.className:', currentIMG.className)
                        if(currentIMG.className === 'fade-in'){
                            currentIMG.classList.add('fade-in')
                            currentIMG.onload = function(e) {  
                                this.classList.add('fade-in')
                            }
                            currentIMG.src = images[0].url
                        // } else if(!(currentIMG.className === 'e-favBadge' || currentIMG.className === 'ProductMetaTitle__PinItIcon fade-in')) {
                        } else if(currentIMG.className !== 'ProductMetaTitle__PinItIcon fade-in') {
                            currentIMG.remove()
                        }
                    })
                    this.positionThumbs()
                    break;
                case 'PDP_heading-title':
                    el.textContent = product.title
                    break;
                case 'wish-list-heart':
                    el.setAttribute('data-product-id', id)
                    if(el.dataset.swaction) el.removeAttribute('data-swaction')
                    // el.setAttribute('data-with-epi', "true")
                    // el.className = `wish-list-heart swym-button swym-add-to-wishlist-view-product product_${id} swym-icon swym-heart swym-loaded disabled swym-added swym-adding`
                    el.className = `wish-list-heart swym-button swym-add-to-wishlist-view-product product_${id} swym-icon swym-heart swym-loaded`
                    // el.className = `wish-list-heart swym-button swym-add-to-wishlist-view-product product_${id}`
                    console.log('case wish-list-heart; el:', el)
                    if(el){
                        _swat.fetchWrtEventTypeET(fetchCallbackFn, 4);       
                        // fetching all wishlist events
                    }
                    function fetchCallbackFn(products){
                        // console.log('WIP RUN fetchCallbackFn SwymPageData:', SwymPageData)
                        // const favBadge = document.querySelector('.e-favBadge')
                        var activeProductId = stockState.productId, 
                            activeVariantId = stockState.variantId;
                        // var activeProductId = SwymPageData.empi, 
                        //     activeVariantId = SwymPageData.epi;
                        var isInWishlist = products.find(function(p){
                            return p.empi == activeProductId && p.epi == activeVariantId;
                        });
                        if(isInWishlist){
                            // console.log('WIP IS IN WISHLIST')
                            // el.setAttribute('disabled', true);
                            el.disabled = true
                            el.classList.add('disabled', 'swym-added', 'swym-adding')
                            // el.innerHTML = "Saved";
                            // favBadge.style.display = 'inline'
                        } else {
                            // console.log('WIP IS NOT IN WISHLIST')
                            // el.setAttribute('disabled', false);
                            el.disabled = false
                            el.classList.remove('disabled', 'swym-added', 'swym-adding')
                            el.addEventListener("click", function(e){
                                if(SwymPageData){
                                    SwymPageData.et = 4	// et 4 stands for wishlist event type
                                    SwymPageData.empi = stockState.productId
                                    SwymPageData.epi = stockState.variantId
                                    SwymPageData.dt = stockState.productTitle
                                    SwymPageData.du = `https://makesy.com/products/${stockState.productHandle}`
                                    // console.log('WIP SwymPageData NOW:', SwymPageData)
                                    _swat.addToWishList(SwymPageData, function(e){
                                    // el.innerHTML = "Saved"; 
                                        // console.log('WIP ADD TO WISHLIST, SwymPageData:', SwymPageData)
                                        el.disabled = true
                                        el.classList.add('disabled', 'swym-added', 'swym-adding')
                                        // favBadge.style.display = 'inline'
                                    })
                                }
                            });
                            // favBadge.style.display = 'none'
                        }
                    }
                    break;
                case 'PDP_inventory':
                    const inventoryToString = product.variants[0].inventoryQuantity +''
                    el.style.visibility = 'visible'
                    el.textContent = inventoryToString.replace(/[^\d]/g, '').split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," ) + ' in stock'
                    const reviewLink = document.querySelector('.PDP_stockReviewLink')
                    reviewLink.style.display = 'inline'
                    break;   
                case 'PDP_price':
                    el.textContent = '$' + Number(product.priceRangeV2.minVariantPrice.amount).toFixed(2)
                    /* Only used for Swatches at the moment */
                    if(product.type == 'vessels') {
                        const inputs = Array.from(document.querySelectorAll('.options-select input'))
                        const labels = Array.from(document.querySelectorAll('.options-select-label label'))
                        const variants = product.variants
                        /* updates all variant dropdowns for non wicks with price */
                        inputs.length && variants.reduce((i, variant) => {
                            const title = variant.title
                            if(i < labels.length) labels[i].setAttribute('for', title)
                            if(!i) {
                                inputs[i].setAttribute('data-variant-price', variant.price)
                                inputs[i].value = title
                                inputs[i].id = "default"
                            } 
                            i++
                            inputs[i].setAttribute('data-variant-price', variant.price)
                            inputs[i].value = title
                            inputs[i].id = title
                            return i
                        },0)
                    }
                    break;
                case 'PDP_description':
                    if(product.descriptionHtml === '') break;
                    el.innerHTML = product.descriptionHtml
                    break;
                case 'PDP_color':
                    const Color = color || data.color
                    console.log(this.state)
                    if(Color) {
                        el.textContent = 'Color: ' + Color
                        document.querySelector('circle[style]').removeAttribute('style')
                        document.querySelector(`[data-swatch-color="${Color}"] circle`).style.strokeDashoffset = 0
                    }
                    break;
                case 'PDP_bulk_message':
                    el.style.transform = null
                    break;
                /* Update Clips */
                case 'm-dropdown': 
                    const clipsInput = el.querySelector('[title="Separate"]')
                    const preInsertedElement = document.getElementsByClassName('Pre-Inserted')[0]

                    if(clipsInput && preInsertedElement) {
                        const clips = document.querySelector('.PDP-clips [title="Separate"]')
                        const collectionTitle = this.state.title || this.state.product.title

                        if(clips) {
                            switch(collectionTitle) {
                                case 'FLAT':
                                    clipsInput.value = "41047750049946,41290176528538"
                                    preInsertedElement.style = null
                                    break;
                                case  'X WICKS':
                                    clipsInput.value = "41292246876314,41292246909082"
                                    preInsertedElement.style.display = 'none'
                                    break;
                                case 'Spiral Wick .01':
                                    clipsInput.value = "41047752999066,41290195435674"
                                    break;
                                case 'Tube Wick .01':
                                    clipsInput.value = "41047750049946,41290176528538"
                                    break;
                                case 'Cust Crackling Wicks':
                                    clipsInput.value = "41047750049946,41290176528538"
                                    preInsertedElement.style = null
                                    break;
                                case 'Cust Color Flat Wicks':
                                    clipsInput.value = "41047750049946,41290176528538"
                                    preInsertedElement.style = null
                                    break;
                                case 'Cust Color X Wicks':
                                    clipsInput.value = "41292246876314,41292246909082"
                                    preInsertedElement.style.display = 'none'
                                    break;
                                case 'Cust Natural X Wicks':
                                    clipsInput.value = "41292246876314,41292246909082"
                                    preInsertedElement.style.display = 'none'
                                    break;
                                case 'Cust Whisper Wicks':
                                    clipsInput.value = "41047750049946,41290176528538"
                                    preInsertedElement.style = null
                                    break;
                                case 'Cust Word Wicks':
                                    clipsInput.value = "41047750049946,41290176528538"
                                    preInsertedElement.style = null
                            }
                        }
                    }
    
                case 'btn-dropdown-quantity':
                    el.children[0].checked = true
                    break;
                /* Update dropdown data-stock & mark first dropdown checked option */
                case 'options-select':
                    const inputs = Array.from(document.querySelectorAll('.options-select input'))
                    
                    // Update each dropdown stock data attribute with the correct inventory Quantity
                    inputs.forEach((input,i) => {
                        if(i) {
                            input.setAttribute('data-stock', this.state.inventory[i-1])
                        } else {
                            input.setAttribute('data-stock', this.state.inventory[i])
                        }
                    })
                    el.children[0].checked = true
                    break;
                case 'PDP__cart-submit':
                    const defaultInput = document.querySelectorAll('.options-select input')[0]?.dataset.policy
                    // Logic for out of stock swatches or back to instock swatch upon click swatches
                    if(product.totalInventory == 0 && defaultInput !== "continue") {
                        el.children[0].textContent = 'out of stock'
                        el.style.display = 'none'
                        stockState.notifyBtn.style.display = 'block'
                        return el.setAttribute('disabled', '')
                        
                    } else {
                        el.style.display = 'block'
                        stockState.notifyBtn.style.display = 'none'
                        el.removeAttribute('disabled')
                    }
                    /* REMOVE IF PRICE IS NOT NEEDED IN ADD TO CART BUTTON */
                    el.children[0].textContent = 'add to cart - ' + '$'+Number(product.priceRangeV2.minVariantPrice.amount).toFixed(2)
                    el.setAttribute('data-productid', id)
                    break;
                case 'PDP-more-information':
                    const moreInformation = product.more_information?.value
                    if( moreInformation ) {
                        el.innerHTML = '<p>' + moreInformation.split('<br>').join('</p><p>') + '</p>' 
                    }
                    break;
                case 'PDP-made-better':
                    const madeBetter = this.state.madeBetter
                    if( madeBetter ) {
                        el.innerHTML = ''
                        let i = product.tags.length
                        while(i--) {
                            const tag = new RegExp(product.tags[i], 'i');
                            const index = madeBetter.icons.findIndex(icon => tag.test(icon));
                            if(index != -1) {
                                let div = document.createElement('div')
                                div.className = 'PDP-icon-content'
                                const html =`<a href="/pages/makesy-made-better" target="_blank">
                                                <img  src="${madeBetter.icons[index]}"> 
                                            </a>
                                            <p>${madeBetter.desc[index]}</p>`
                                div.innerHTML = html
                                el.appendChild(div)
                            }
                        }
                    }
                    break;
            }
            this.state.browserBack = false
        })
    }

    swatchers() {
        const swatches_container = document.querySelector('.PDP_swatches')
        if (swatches_container) swatches_container.onclick = (e) => {
            const { swatchProductId, swatchColor } = e.target?.dataset
            if (e.target.className == 'swatch_color-item') {
                this.productAPI(swatchProductId, (data) => {
                    this.filterOptions(data.product.variants)
                    this.updateProductContent(data.product, swatchColor);

                    stockState.productTitle = data.product.title
                    stockState.productId = swatchProductId
                    stockState.productHandle = data.product.handle
                    stockState.productImgUrl = data.product.images[0].url

                    // stockState.productTitle = product.data.product.title
                    // stockState.productHandle = product.data.product.handle
                    // stockState.productId = swatchProductId
                    // stockState.productImgUrl = product.data.product.images[0].url
                })
            }
        }
    }

    /* Only running if a sale exist */
    async saleFunc(formData) {
        if(!formData) return

        const vipProduct = document.querySelector('[data-vip]')
        /* If data-vip data attribute exist then customer has makesy_vip tag and qualifies for 
        *  Same day processing product 
        */
        if(vipProduct) {
            const res = await fetch('/cart.js' + '?view=drawer&timestamp=' + Date.now(), {
                credentials: 'same-origin'
            })
            const cart = await res.json()
    
            const itemExists = cart.items.some(item => item.id == 42123741593754)
            // Product already in the cart
            if(itemExists) return add_to_cart(formData);

            formData.items.push({id: 42123741593754, quantity: 1}) 
            return add_to_cart(formData)
        }
        add_to_cart(formData)
    }

    isWickProduct() {
        return /wick/i.test(window.location.pathname) && !/clip|candle-accessories|maker-tools/i.test(meta.product.type)
    }

    processFormData(e) {
        const submitBtn = document.querySelector('.PDP__cart-submit')
        const btn_bulk_discounts = submitBtn.dataset.bulkDiscounts
        const inputs = Array.from(document.querySelectorAll('.PDP_product-form input:checked'))  // Change to specific input

        // Only first input has dataset attribute
        const elementNotSelected = inputs.find(input => input.dataset.index == '0' && input.dataset.productId)
        
        if(elementNotSelected) return this.addMessage(`${elementNotSelected.name}`, true, true)

        const variantId = this.getPriceAndVariant().id 
        console.log('variantId:', variantId)
        const formData = inputs.reduce((obj, {dataset, value, name }) => {

            // Just quantity dropdown exist
            if (inputs.length == 1) {
                obj.id = submitBtn.dataset.productVariantId
                obj.quantity = inputs[0].value
                if (btn_bulk_discounts) {
                    const bulk_discount_obj = JSON.parse(btn_bulk_discounts)
                    obj.properties = {_percent: bulk_discount_obj.percent, _quantity: bulk_discount_obj.quantity}
                }
                return obj
            }

            const bulk_discounts = dataset['bulkDiscounts']
            if (bulk_discounts) {
                const bulk_discount_obj = JSON.parse(bulk_discounts)
                obj.properties = {_percent: bulk_discount_obj.percent, _quantity: bulk_discount_obj.quantity}
                obj.id = variantId || value
                
            } else if (name == 'quantity') {
                obj.quantity = value
            } else if(name == 'selling_plan'){
                obj.selling_plan = value
                obj.id = submitBtn.dataset.productVariantId
            } else {
                obj.id = variantId || value
            }
            return obj
        }, {})

        return {items: [formData]}
    }

    cartController(e) {
        const formData = this.isWickProduct() ?  this.processWickFormData(e.target) : this.processFormData(e.target)

        /* Only if running a sales function */
        if (this.isSale) return this.saleFunc(formData);

        if(formData) add_to_cart(formData)
    }

    static notifyOpen(e) {
        const modal = document.querySelector('.c-notify')
        const closeBtn = document.querySelector('.e-closeNotify')
        const notifyTitle = document.querySelector('.e-notifyItemTitle')
        const {productId, productVariantId} = e.target.dataset
        const phoneInputField = document.querySelector("#phon")
        const resultEl = document.querySelector('.e-notifyResult')

        if(resultEl) resultEl.style.display = 'none'

        // modal
        modal.style.display = 'block'
        closeBtn.addEventListener('click', () => modal.style.display = 'none')
        window.addEventListener('click', (event) => {
            if(event.target == modal) modal.style.display = 'none'
        })

        // update stock state data only if selections haven't been previously updated (for multivariant or multiproduct items)
        stockState.productId === '' ? stockState.productId = productId : null
        stockState.variantId === '' ? stockState.variantId = productVariantId : null
        stockState.productTitle !== '' ? notifyTitle.textContent = stockState.productTitle : null

        // if its not already added
        if(stockState.itiInput === '') {
            stockState.itiInput = window.intlTelInput(phoneInputField, {
                utilsScript:    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.18/js/utils.min.js",
                preferredCountries: ["us"],
                // onlyCountries:  ["us", "ca", "gb"],
            })
        }
    }

    static notifySelect(e) {
        const current = document.querySelector('.m-notifyBtns .active')
        const phoneVerify = document.querySelector('.iti--allow-dropdown')
        const smallEmail = document.querySelector('.e-emailSmall')
        const smallSms = document.querySelector('.e-smsSmall')
        stockState.submitBtn.disabled = true
        current.classList.remove('active')
        e.target.classList.add('active')
        const {delivery} = e.target.dataset
        if(delivery === 'email') {
            stockState.submitBtn.dataset.notifyMethod = 'email'
            stockState.emailInput.style.display = 'block'
            stockState.emailInput.required = true
            stockState.phoneInput.style.display = 'none'
            stockState.phoneInput.required = false
            stockState.phoneInput.value = ''
            phoneVerify.style.display = 'none'
            smallEmail.style.display = 'block'
            smallSms.style.display = 'none'
        } else if(delivery === 'text') {
            stockState.submitBtn.dataset.notifyMethod = 'text'
            stockState.phoneInput.style.display = 'block'
            stockState.phoneInput.required = true
            stockState.emailInput.style.display = 'none'
            stockState.emailInput.required = false
            stockState.emailInput.value = ''
            phoneVerify.style.display = 'block'
            smallSms.style.display = 'block'
            smallEmail.style.display = 'none'
        }
    }

    static notifyBtnState(e) {
        const emailSelect = document.querySelector('.e-selectEmail.active')
        const phoneSelect = document.querySelector('.e-selectText.active')
        const validNumber = stockState.itiInput.isValidNumber()

        if(emailSelect && stockState.emailInput.checkValidity()) {
            stockState.submitBtn.disabled = false
        } else if(phoneSelect && validNumber) {
            stockState.submitBtn.disabled = false
        } else {
            stockState.submitBtn.disabled = true
        }
    }

    static notifySend(e) {
        const {notifyMethod} = e.target.dataset
        const resultEl = document.querySelector('.e-notifyResult')
       
        e.preventDefault()
        const phoneNumber = stockState.itiInput.getNumber()

        if(notifyMethod === 'email') {
            BIS.create(stockState.emailInput.value, stockState.variantId, stockState.productId)
            .then(res => {
                if(res.status == 'OK') {
                    resultEl.textContent = "You're registered!"
                    if(resultEl.classList.contains('error')) resultEl.classList.replace('error', '')
                } else if(res.status == 'Error' && res.errors.base) {
                    resultEl.textContent = "You're already registered!"
                    if(!resultEl.classList.contains('error')) resultEl.classList.add('error')
                } else if(res.status == 'Error' && res.errors.email) {
                    resultEl.textContent = "You're email address is invalid"
                    if(!resultEl.classList.contains('error')) resultEl.classList.add('error')
                } else {
                    resultEl.textContent = 'Contact support for help with your notification'
                    if(!resultEl.classList.contains('error')) resultEl.classList.add('error')
                }
            })
            stockState.emailInput.value = ''
        } else if(notifyMethod === 'text') {
            BIS.create(null, stockState.variantId, stockState.productId, { phone_number: phoneNumber })
            .then(res => {
                if(res.status == 'OK') {
                    resultEl.textContent = "You're registered!"
                    if(resultEl.classList.contains('error')) resultEl.classList.replace('error', '')
                } else if(res.status == 'Error' && res.errors.base) {
                    resultEl.textContent = "You're already registered!"
                    if(!resultEl.classList.contains('error')) resultEl.classList.add('error')
                } else {
                    resultEl.textContent = 'Contact support for help with your notification'
                    if(!resultEl.classList.contains('error')) resultEl.classList.add('error')
                }
            })
        }
        resultEl.style.display = 'block'
        resultEl.textContent = ''
        stockState.phoneInput.value = ''
        stockState.submitBtn.disabled = true
    }
}

class PDP_wicks extends PDP {
    constructor(isSale=false) {
        super();
        this.isSale = isSale
        this.toggleMenu()
        this.bulk_message = document.querySelector('.PDP_bulk_message')
        this.error_message = document.querySelector('.PDP_error_message')
        this.flyout_el = document.querySelector('.Dialog__values')
        this.dropDownRadios = document.querySelectorAll('.PDP-options button')
        this.dialogInputs = document.querySelector('.Dialog_input') // All because of wick sample kits, burn the wicks !!!!!!
        this.submitBTN = document.querySelector('.PDP__cart-submit')
        this.hasTopCollectionDropDown = document.querySelector('.product-form-collection')

        /* Initial load for PDP option dropdowns */
        if (this.isWickProduct() && this.dialogInputs) {
            const collectionID = document.querySelector('[data-collection-id]')?.dataset?.collectionId
            console.log('collectionID:', collectionID)
            const productID = document.querySelector('[data-products-id]')?.dataset?.productsId
            collectionID ? this.collectionAPI(collectionID) : this.productAPI(productID)

            history.replaceState(0, "", window.location.pathname);
            const wickProdSelection = document.querySelector('.Dialog_list')
           
            /* if flyout is not needed remove below */        
            this.dropDownRadios.length && wickProdSelection.addEventListener('mouseover', this.updateFlyOut.bind(this));
        } 
    }
    
    processWickFormData() {
        const inputs = Array.from(document.querySelectorAll('.PDP_product-form input:checked'))
        const quantity = document.querySelector('.m-quantity-select:checked').value
        console.log(document.querySelector('.product-form-size .wick-variant-select input:checked')?.value)

        if (inputs.length <= 3) {
            console.log(document.querySelector('.wick-variant-select input:checked')?.value)
            return {items: [{
                id: document.querySelector('.wick-variant-select input:checked')?.value || this.submitBTN.dataset.productVariantId,
                quantity
            }]}
        }
        const widthNotSelected = inputs.some(input => input.id == 'default' && input.name == 'Width') 

        if(widthNotSelected) {
            this.addMessage('Please select a width', true, true)
            return false
        }

        const packSize = document.querySelector('#select-pack-size input:checked')?.value
        const clipIndex = packSize == '100' || !packSize ? 0 : 1
        const variantId = this.getPriceAndVariant().id.replace(/[^0-9]/g,'')
        console.log('variantId:', variantId)

        /* Wick products with option dropdowns */
        const formData = inputs.reduce((arr, input) => {
            const name = input.name.trim().toLowerCase()

            if(name === 'quantity') {
                const wickOBJ = {
                    id: variantId,
                    quantity,
                    properties: clipIndex ? {_percent: '10,15', _quantity: '10,50'} : null
                }
                arr.push(wickOBJ)
                return arr
            }
            if(name === 'clips') {
                /* Two variant id's for the clips inputs */
                const id = input.value.split(',')[clipIndex]

                if(['true', 'Pre-Inserted'].includes(input.id)) arr.push({
                    id: id,
                    quantity
                })
                
                /* CUSTOM WICK SETUP FEE */
                if(packSize == '100' && /custom-wick/i.test(meta.product.type)) arr.push({
                    id: 35935883853978,
                    quantity: 1
                })
            }
            return arr
        }, [])
        
        console.log('formData:', formData) 
        return {items: formData}
    }

    updateWithCollection(data){
        const isInitialPageLoad = typeof this.state.products === 'undefined'
        const products = data.products

        this.state.options = {}
        this.state.pricings = {}
        this.state = {...this.state, ...data}
        if(!this.hasTopCollectionDropDown && !this.dropDownRadios.length) return;

        const variants = products[0].variants
        const productContent = { ...products[0], ...data, title: data.title }
        if(isInitialPageLoad) {
            this.filterFlyOutData(products)
            return this.loadOptionDropDowns(variants)
        }
        this.updateProductContent(productContent)
        this.loadOptionDropDowns(variants)
        this.loadWickTypeDropDown(products)
    }

    updateWithProduct(data){
        console.log('updatewithproduct', data)
        const isInitialPageLoad = typeof this.state.flyout === 'undefined' 
        this.state = {...this.state, ...data, quantity: '0'}

        if(isInitialPageLoad && this.dropDownRadios.length && data.product?.fly_out ) {
            this.state.flyout = [data.product.fly_out.value]
            this.updateFlyOut()
            return this.loadOptionDropDowns(data.product.variants)
        }
        this.updateProductContent(data)
        this.loadOptionDropDowns(data.variants)
    }

    updateWickProduct(target) {
        const id = target.id
        const title = target.title
        const name = target.name
        
        if(name === 'product') document.querySelector('[for="default"]').textContent = title
        /* If dropdown only has one option don't hit api */
        if(document.querySelectorAll(`[name="${name}"]`).length <= 2 ) return;

        if(name === 'collection') {
            return this.collectionAPI(id)
        }
        const product = this.state.products.find(product => product.title === title)
        this.updateWithProduct(product)
    }

    updateFlyOut(e) {
        const values = this.state.flyout
        const target = e?.target
        
        if(target) {
            const oldDiv = this.flyout_el.firstElementChild
            const index = target.getAttribute("index")
            if(values[index]) {
                const div = document.createElement('div')
                div.innerHTML = values[index] 
                this.flyout_el.replaceChild(div, oldDiv)
                const newHeight = div.getBoundingClientRect().height + 42 +  'px'
                this.flyout_el.style.height = newHeight
            } 
        } else {
            const div = document.createElement('div')
            div.innerHTML = values[0] 
            this.flyout_el.appendChild(div)
            const newHeight = div.getBoundingClientRect().height + 42 + 'px'
            this.flyout_el.style.height = newHeight
        }
    }

    filterFlyOutData(products) {
        const flyout_data = products.map(product => {
            return product.fly_out.value.replace(/<span>/,'<span class="bl-space">')
        })
        this.state.flyout = flyout_data
        this.updateFlyOut()
    }

    /* Filters and removes duplicates in variants options */
    filterOptions(variants) {
        this.state.options = {}
        this.state.pricings = {}

        return variants.reduce((newObj, {title, id, inventoryQuantity,inventoryPolicy, price, selectedOptions}, j) => {
            /* Update options state */
            this.state.options[title] = id.replace(/[^0-9]/g, '')
            this.state.pricings[j] = Number(price)
            this.state.inventory[j] = inventoryQuantity
            this.state.inventoryPolicy[j] = inventoryPolicy

            selectedOptions.reduce((prev, { name, value }) => {
                const key = `${name}`
                
                if (prev[key]) {
                    /* push new value only if it's not included in the array */
                    if (!prev[key].includes(value)) prev[key].push(value)
                } else {
                    prev[key] = [value]
                }
                return prev
            }, newObj)
            return newObj
        }, {})
    }

    /* 
    * Loads the dropdowns for product change or browser back button is performed
    */
    loadOptionDropDowns(variants) {
        if (!this.dropDownRadios.length) return;

        const {inventory, has_bulk_discounts, discount_percent, discount_quantity} = this.state
        const dropDownLabels = document.querySelectorAll('.PDP-options .menu-list')
        const priceElement = document.getElementsByClassName('PDP_price')[0]

        // Remove all inputs and li elements if not default input
        Array.from(document.querySelectorAll('.PDP-options input, .PDP-options li')).forEach(el => !el.checked && el.remove())
        const currentChecked = document.querySelectorAll('.PDP-options input:checked')

        const filterData = (variants) => {
 
            const lowestPrice =  variants.reduce((prev, el)=> {
                const prevPrice = Number(prev.price || prev)
                const currentPrice = Number(el.price)
                if(currentPrice < prevPrice ) prev = currentPrice
                return prevPrice
            }) 
            priceElement.textContent = '$'+lowestPrice.toFixed(2)
            
            const options = this.filterOptions(variants)
            console.log('options:', options)

            this.dropDownRadios.forEach((btn, i) => {
                const inputName = Object.keys(options)[i]
                
                currentChecked[i].title = inputName
                currentChecked[i].value = options[inputName][0]
                currentChecked[i].id = "default"

                options[inputName].forEach(optionValue => { 
                    /* Input dropdowns */
                    const input = document.createElement('input')
                    Object.assign(input, {
                        type: "radio",
                        id: optionValue,
                        name: inputName,
                        title: optionValue,
                        value: optionValue
                    })
                    input.setAttribute('data-index', i)
                    /* Everything but wicks will have inventory key in the state */
                    inventory && input.setAttribute('data-stock', inventory[i])

                    if(has_bulk_discounts?.value === optionValue) {
                        input.setAttribute('data-bulk-discounts', `{"has_bulk_discounts":"${optionValue}","percent":"${discount_percent.value}","quantity":"${discount_quantity.value}"}`)
                    }
                    btn.appendChild(input)
                
                    /* Label dropdowns */
                    const li = document.createElement('li')
                    li.setAttribute('data-index', i)
                    const label = document.createElement('label')
                    label.setAttribute('for', optionValue)
                    label.textContent = optionValue
                    li.appendChild(label)

                    dropDownLabels[i].appendChild(li)
                })
            })
        }
        filterData(variants) 
    }
    
    /* Only top dropdown exist for collections */
    loadWickTypeDropDown(products) {
        console.log('loadWickTypeDropDown products:', products)
        const firstInput = document.querySelector('.product-form-size input')
        const firstLabel = document.querySelector('.product-form-size label')
        const Dialog__list = document.querySelector('.Dialog_list')

        // Remove all inputs and labels
        Array.from(Dialog__list.querySelectorAll('li')).forEach(el => el.remove())
        
        products.forEach(({id, variants, title}, i) => {

            const val = variants?.[0].id
            console.log('val:', val)

            if(i == 0) {
                firstInput.id = "default"
                firstInput.value = val
                firstInput.title = "Select a wick type"
                firstInput.checked = true
                firstLabel.textContent = "Select a wick type"
            } 

            /* Input for dropdowns */
            const input = document.createElement('input')
            Object.assign(input, {
                className: "Dialog_input",
                type: "radio",
                id: id,
                name: 'product',
                title: title,
                value: val
            })

             /* Label dropdowns */
            const li = document.createElement('li')
            const label = document.createElement('label')
            label.className = "Dialog_label"
            label.setAttribute('for', id)
            label.textContent = title
            li.append(input, label)
            Dialog__list.appendChild(li)
        })
    }


    /**
    * 
    * @param {Number} selected_quantity Quantity selection from dropdown in PDP
    * @param {Element} inputs inputs from dropdowns
    * @returns {Object} Quantity , Percentage, Index of bulk discounts
    */
    getBulkDiscounts(selected_quantity=1, inputs) {
        const bulk_obj = inputs && inputs.reduce((obj, input) => {
            const bulk_discounts = input.dataset['bulkDiscounts']
            
            /* check to make sure input has bulk discount dataset */
            if(!bulk_discounts) return obj

            const {percent, quantity} = JSON.parse(bulk_discounts)
            const q = quantity.split(',').map(Number)
            const p = percent.split(',').map(Number)

            const index = q.reduce((prev, quantity, i) => {
                if (quantity <= Number(selected_quantity)) prev = i
                return prev
            }, 0)

            const nextIndex = q[index] - selected_quantity < 0 ? index+1 : index

            obj.index = nextIndex
            obj.percent = p
            obj.quantity = q
            return obj
        }, {}) 
        return Object.keys(bulk_obj).length === 0 ? false : bulk_obj
    }


   /**
    * 
    * @param {String} message The message you want to be sent to the user
    * @param {Boolean} open true or false if the message is currently displayed to the user
    * @param {Boolean} error true or false if it's a error message
    * @returns {void} Just used to short circuit conditional
    */
    addMessage(message, open, error) {
        if(error) {
            this.error_message.style.transform = open ? 'translate(0px, 0px)' : null
            return this.error_message.textContent = message
        }
        this.bulk_message.style.transform = open ? 'translate(0px, 0px)' : null
        this.bulk_message.textContent = message
    }
    

   /**
    * 
    * @param {Number} selected_quantity Quanity selected from product dropdown
    * @returns {void} Just used to short circuit conditional
    */
    bulkMessage(selected_quantity) {
        /* Wicks only message */
        if(this.isWickProduct()) {
            const packSize = document.querySelector('#select-pack-size input:checked')?.value

            if(!packSize) return;

            let message = ''

            if ( packSize == '100') {
                return this.addMessage('', false, false)
            } else if ( selected_quantity > 10 ) { 
                const tierQuantity = 50 - selected_quantity
                if( tierQuantity <= 0 ) {
                    message = 'You qualify for 15% off 50 Packs of 1000'
                } else {
                    message = `You're ${tierQuantity} away from receiving 15% off for 50 Packs of 1000`
                }
            } else {
                const tierQuantity = 10 - selected_quantity
                if(tierQuantity <= 0) {
                    message = 'You qualify for 10% off 10 Packs of 1000'
                } else 
                    message = `You're ${tierQuantity} away from receiving 10% off for 10 Packs of 1000`
            }
            this.addMessage(message, true, false)

        /* Everything else but Wicks message */
        } else {
            const inputs = Array.from(document.querySelectorAll('.options-select input:checked, .PDP__cart-submit'))
            const message_obj = this.getBulkDiscounts(selected_quantity, inputs)
            const title = this.state.checkedTitle || document.querySelector('.PDP__cart-submit').title

            if( message_obj ) {
                let {index, percent, quantity} = message_obj
                const nextTierQuantity = quantity[index] - selected_quantity
                const exactQuantity = nextTierQuantity == 0

                let message = ''
                // *** Basically this can be used for current discount as well, right now set up for max possible disocunts if selected 100 quatity
                if(exactQuantity) {
                    message = `You qualify for ${percent[index]}% off ${title}`
                } else if (isNaN(nextTierQuantity)) {
                    message = `You qualify for ${percent[index-1]}% off ${title}`
                } else {
                    message = `Add ${nextTierQuantity} more for ${percent[index]}% off ${title}`
                }
                this.addMessage(message, true, false)
            } else {
                this.addMessage('', false, false)
            }
        }
    }

    updateInventory({title, dataset}) {
        const inventoryEl = document.querySelector('.PDP_inventory');
        const stockCount = this.getPriceAndVariant().inventory || 0;

        const continueSellingOutOfStock = this.getPriceAndVariant().inventoryPolicy === 'CONTINUE'
        
        // const continueSellingOutOfStock = dataset?.policy === 'continue'
        if(stockCount === 0 && !continueSellingOutOfStock) {
            this.submitBTN.children[0].textContent = 'out of stock'
            this.submitBTN.style.display = 'none'
            stockState.notifyBtn.style.display = 'block'
            return this.submitBTN.setAttribute('disabled', '')
        } else {
            this.submitBTN.children[0].textContent = this.submitBTN.children[0].textContent.replace(/out of stock/, 'add to cart')
            this.submitBTN.style.display = 'block'
            stockState.notifyBtn.style.display = 'none'
            this.submitBTN.removeAttribute('disabled')
        }
        
        if(!inventoryEl) return;
        
        /case pack/i.test(title) ? inventoryEl.style.visibility = 'hidden' : inventoryEl.style.visibility = 'visible';

        if(stockCount <= 0) return inventoryEl.textContent = ''
        if(stockCount < 100) return inventoryEl.textContent = 'less than 100 in stock'
        inventoryEl.textContent = stockCount+''.split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," ) + ' in stock'
    }

    getPriceAndVariant() {
        const sizeInputs = Array.from(document.querySelectorAll('.options-select input:checked'))

        // If no options exist for wick product
        if(!sizeInputs.length) {
            const {productVariantId, variantPrice } = document.querySelector('[data-product-variant-id]').dataset
            return {id: Number(productVariantId), price: Number(variantPrice)}
        }

        let clipsPrice = 0
        if(this.isWickProduct()) {
            const clips = document.querySelector('.PDP-clips input:checked')
            const clipIndex = sizeInputs[2].value === '100' ? 0 : 1
            clipsPrice = Number(clips.dataset.variantPrice.split(',')[clipIndex]) || 0
        }

        const priceObj = this.state.pricings
        const inventoryCount = this.state.inventory
        const inventory_policy = this.state.inventoryPolicy
        const selectedVariant = sizeInputs.map(input => input.value).join(' / ')
        const index = Object.keys(this.state.options).findIndex(key => key == selectedVariant)
        const inventory = inventoryCount[index]
        const inventoryPolicy = inventory_policy[index]

        const price = clipsPrice + priceObj[index]  
        const id = this.state.options[selectedVariant]

        console.log('id:', id)
        return {id, price, inventory, inventoryPolicy}
    }

    /* Updated from quantity selector */
    updatePrice() {
        const selectedPrice = this.getPriceAndVariant().price
        const selectedQuantity =  Number(document.querySelector('.m-dropdown-quantity input:checked').value)
        const displayPrice = document.querySelector('.PDP_price')
        const btnPrice = document.querySelector('.PDP__cart-submit span')
        const originalText = btnPrice.textContent.split('-')[0]
        const newPrice = selectedQuantity * selectedPrice
        displayPrice.textContent = '$' + newPrice.toFixed(2)
        btnPrice.textContent = originalText +' - ' + '$'+newPrice.toFixed(2)
    }

    checkOptionCombinations(value) {
        const inputs = Array.from(document.querySelectorAll(`input[data-index="1"]`))
        if(inputs.length <= 2) return;

        const list_items = Array.from(document.querySelectorAll(`li[data-index="1"]`))
        const nextSelection =  inputs.map(el => `${value} / ${el.value}`) // Need to swap value and el.value when height checked if doing it that way.

        const found = nextSelection.reduce((obj, selection, i) => {
            const compareRegex = new RegExp(selection, 'i')
            /* returns true if height is not found in state */
            const heightNotFound = Object.keys(this.state.options).every(option => !compareRegex.test(option))
            heightNotFound ? obj.notFound.push(i) : obj.exists.push(i)
            return obj
        },{exists: [], notFound: []})

        console.log('found:', found)
        
        // Show dropdown items if display none
        found.exists.forEach((index,i) => {
            if (index) {
                // li elements
                list_items[index-1].style = null
                // input elements
                inputs[index].style = null
            }
            if(!i) {
                const id = inputs[index].id
                // inputs[0].checked = true  // *** This was causing next dropdown to revert back to default; remove if not needed ***
                // Usually means all combinations work if default is found
                if (id !== 'default') inputs[0].value = inputs[index].id
            }
        })
        
        // If all options match no need to hide dropdowns
        if (!found.notFound.length) return;

        // Hide dropdown items if height doesn't exist
        found.notFound.forEach((index, i) => {
            if (index) {
                // li elements
                list_items[index-1].style.display = 'none'
                // input elements
                inputs[index].style.display = 'none'
            }
        })
    }

    updateOptionValues(e) {
        const name = e.target.name
        const optionIndex = e.target?.dataset?.index
        const value = e.target.value
        console.log('value:', value)
        const title = e.target.title

        // variant url param
        const url = new URL(window.location.href)
        url.searchParams.append('variant', value)
        
        if(['collection', 'product'].includes(name)) {
            this.updateWickProduct(e.target)
        } else if(['0', '1', '2' ].includes(optionIndex)) {
            if(optionIndex == '0') {
                this.addMessage('', false, true)
                this.checkOptionCombinations(value)
            }
            this.bulkMessage(this.state.quantity)
            this.updatePrice()
            !this.isWickProduct() && this.updateInventory(e.target)
        } else if(name == 'quantity') {
            this.addMessage('', false, true)
            this.state.quantity = value
            this.updatePrice()
            this.bulkMessage(value)
        } else if(name == 'clips') {
            this.updatePrice()
        } else  {
            stockState.variantId = value
            window.history.replaceState(null, null, `?variant=${value}`); 
            this.addMessage('', false, true)
            this.updateInventory(e.target)
            const hasBulkDiscounts = e.target.dataset.bulkDiscounts
            this.updatePrice()
            if(!hasBulkDiscounts) return this.bulk_message.style.transform = null;
            
            // Don't run message until quantity is selected above
            if(this.state.quantity) {
                this.state.checkedTitle = title 
                this.bulkMessage(this.state.quantity)
            }
        }
    }

    /* Get a single product */
    productAPI(id, callback) {
        stockState.productId = id
        fetch('https://api.makesy.com/product', {
            // fetch('http://localhost:3005/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        .then(res => res.json())
        .then(resData => {
            const product = resData.data
            if(!product) throw "Error at product api: in product-pdp.js"
            console.log('product res:', product)
            stockState.productImgUrl = product.product.images[0].url
            callback ? callback(resData.data) : this.updateWithProduct(resData.data)
        })
        .catch(err => console.log('err: ', err))
    }

    collectionAPI(id, callback) {
        console.log('id:', id)
        // fetch('https://api.makesy.com/collection-products', {
            fetch('https://api.makesy.com/db-collections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        .then(res => res.json())
        .then(data => {
            if(!data) throw "Error at collection api: in product-pdp.js"
            console.log('collection products res:', data)
            this.updateWithCollection(data)
            // callback && callback(resData.data)
        })
        .catch(err => console.log('err: ', err))
    }

    // Drop down variant select & quantity
    toggleMenu() {
        const buttons = Array.from(document.getElementsByClassName('PDP-dropdown-toggle'))
        let openMenu = ''

        buttons.forEach(btn  => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation()
                const target = e.target
                const dropdown = target.closest('.m-dropdown').getElementsByClassName('dropdown-menu-items')[0]

                /* Menu item clicked - update formdata object */
                if (target.tagName !== 'BUTTON') {
                    return openMenu = ''
                };

                if (!openMenu) {
                    document.addEventListener('click', hideDropDown)
                    dropdown.style.transform = 'translateY(0) scale(1)'
                    openMenu = dropdown
         
                } else {
                    /* When Menu is open but clicked on another menu */
                    if(openMenu !== dropdown) {
                        dropdown.style.transform = 'translateY(0) scale(1)'
                        openMenu.style.transform = null
                       return openMenu = dropdown
                    }
                    openMenu.style.transform = null
                    openMenu = ''
                }

                function hideDropDown(e) {
                    document.removeEventListener('click', hideDropDown)
                    if(!openMenu) return;
                    openMenu.style.transform = null
                    openMenu = ''
                }
            })
        })
    }
}

const pdp_wicks = new PDP_wicks(false)

window.addEventListener('DOMContentLoaded', () => {
    // check out of stock btn for notify btn display
    const productBtn = document.querySelector('.PDP__cart-submit')
    const productBtnText = document.querySelector('.PDP__cart-submit span')
    if(productBtnText.textContent == 'OUT OF STOCK') {
        productBtn.style.display = 'none'
        stockState.notifyBtn.style.display = 'block'
    }

    // check favorite status for main img badge display
    // const fav = document.querySelector('.wish-list-heart')
    // const favBadge = document.querySelector('.e-favBadge')
    // if(fav.contains('disabled')) favBadge.style.display = 'none'
})

// window.addEventListener('DOMContentLoaded', (event) => {});
// addMessage(message, open, error) 

// Yotpo reviews add scrollbar if overflow dynamically
// window.addEventListener('DOMContentLoaded', (event) => {
//     const productContent = document.querySelector('.Product__InfoWrapper')
//     const scrollEl = document.querySelector('.c-arrow-down')
    
//     const resizeObserver = new ResizeObserver(entries => {
//         const height = entries[0].contentRect.height

//         if (height > 949 && window.innerWidth > 640) {
//             productContent.classList.add('scroll-bar-product')
//             scrollEl.querySelector('span').classList.add('animate-arrow')
//         } else
//             productContent.classList.remove('scroll-bar-product')
//     });

//     resizeObserver.observe(productContent);

//     let hasScrolled = false
//     productContent.addEventListener('scroll', (e) => {
//         if (!hasScrolled) scrollEl.style.display = 'none'
//         hasScrolled = true
//     })
// });

