function addToCart(isSaleItem) {
    const addToCarttBtn = document.querySelectorAll('.Product__cart-submit')
    const quickViewBtn = document.querySelectorAll('.quick-view-submit')
    const underlay = document.querySelector('.quick-view-underlay')
    const openCartBtn = document.querySelector('[data-action="open-drawer"]')
    const cartIcon = document.querySelector('[data-action="open-drawer"] .small')
    currentQuantity = 1
    let formData  = {
        'items': [{
            'id': '',
            'quantity': null,
             'properties': {}
        }]
    }

    const updateShippingPercent = (returnData) => {
        
        console.log('formData:', formData)
        // const quantity = Number(formData.items[0].quantity)
        // const quantity = Number(parentNode.querySelector('.m-dropdown-quantity input:checked').value)
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

    /* Ater item added to cart update cart with new item and open it */
    async function updateCart(returnData) {
        
        const res = await fetch(window.routes.cartUrl + '?view=drawer&timestamp=' + Date.now(), {
            credentials: 'same-origin',
            method: 'GET'
        })
        
        const html = await res.text()
        const cartQuantityData = new DOMParser().parseFromString(html, 'text/html').querySelectorAll('[data-line-item-quantity]')

        /* Gets all line items from cart and adds the total together */
        const cartTotal = Array.from(cartQuantityData).reduce((prev, data, i) => {
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

    const saleItem =  (formData, target, itemQuantity, id, minPrice) => {

        // Test if Sale item is already in cart
        const isAlreadyAdded = document.querySelector("[data-variant-id=' "+id+"']")
        console.log('isAlreadyAdded:', isAlreadyAdded)

        if(isAlreadyAdded) return 

        const productPrice = Number(target.textContent.replace(/[^\d\.]/gi, ''))

        const cartBtn = document.getElementById('total_of_cart')
        const currentCartPrice = cartBtn ? Number(cartBtn.textContent.replace(/[\$\,?]/gi, '')) : 0

        // const totalPrice = (productPrice * itemQuantity) + currentCartPrice
        const totalPrice = (productPrice ) + currentCartPrice

        if(totalPrice > minPrice) {
            return formData['items'].push({
                    id: id,
                    quantity: 10
                })
        }
        return formData
    }
    
    const vipItem = async (formData) => {
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
            if(itemExists) return formData
            console.log('formData:', formData)

            formData.items.push({id: 42123741593754, quantity: 1}) 
            return formData
        }
    }
    


    async function postCartItem(e) {
        const parentNode = e.target.closest('.Product__content')
        const quantity = formData.items[0].quantity || '1'
        const id = formData.items[0].id

        if (!id) {
            const dataOptions = Array.from(parentNode.querySelectorAll('input[data-options]:checked'))

            const propObj = dataOptions.reduce((obj, el) => {
                const arr = el.dataset.options.split(':')
                const key = arr[0]
                const val = arr[1]

                obj[key] = val
                return obj
            }, {})

            formData['items'] = [{
                'id': e.target.dataset.variantId,
                'quantity': quantity,
                "properties": dataOptions.length ? propObj : {}
            }]
        }
        /* 
        * Params:
        *    current formData Array, target element,current quantity, sale variant id, sale threshhold
        */
        console.log('isSaleItem:', isSaleItem)
        isSaleItem && saleItem(formData, e.target, quantity, 41866862362778, 0)
        

        /**
         * Update formData with vip Item if customer has "maker_pro tag"
         */
        await vipItem(formData)

        try {
            const res = await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const json = await res.json()
            
            updateCart(json)
            formData  = {
                'items': [{
                    'id': '',
                    'quantity': null,
                     'properties': {}
                }]
            };
        } catch (error) {
            console.log('error:', error)
            
            formData  = {
                'items': [{
                    'id': '',
                    'quantity': null,
                     'properties': {}
                }]
            };
        }
    }

    addToCarttBtn.forEach(btn => {
        btn.onclick = (e) => {
            postCartItem(e)
        }
    })

    const inCubic = function(n){
        return n * n * n;
    };

    // Animate only for mobile because of display none elements
    function animateMobile(open, modal) {
        let start = 0
        function animate(timestamp) {
            if(!start) start = timestamp
            const progress = inCubic(Math.min((timestamp - start) / 425, 1))
            const scale = open ? 1 * progress : 1 - ( 1 * progress ) 

            modal.style.transform = 'translate(-50%, -50%) scale('+scale+')'
            modal.style.opacity = scale
    
            if(progress < 1) {
                requestAnimationFrame(animate)
            } else start = 0
        }
        requestAnimationFrame(animate)
    }

    function showModal(e) {
        e.preventDefault();

        const isMobile = e.target.classList.contains('Product__quickview-sm-btn') 
        const closeBtn = e.target.closest('.ProductItem').querySelector('.ProductItem__close-modal')
        const closeElements = [closeBtn, underlay]
        const modal = e.target.closest('.ProductItem').querySelector('.ProductItem__Quickview-modal');
        modal.classList.remove('__desktop');
        
        // closeModal
        [].forEach.call(closeElements, (el) => {
            
            el.addEventListener('click', (e) => {
                if(isMobile) {
                    animateMobile(false, modal)
                } else {
                    modal.style.transform = null
                    modal.style.opacity = null
                }
                
                underlay.style.transform = null
                underlay.style.opacity = null

                // Clear formData when menu closes
                formData  = {
                    'items': [{
                        'id': '',
                        'quantity': null,
                         'properties': {}
                    }]
                };
            })
        })

        if(isMobile) {
            animateMobile(true, modal)
        } else {
            modal.style.transform = 'translate(-50%, -50%) scale(1)'
            modal.style.opacity = 1
        }
        
        underlay.style.transform = 'scale(1)'
        underlay.style.opacity = .7
    }

    quickViewBtn.forEach(btn => {
        btn.onclick = (e) => {
            showModal(e)
        }
    })
    
    // Formats the stock with comma seperate: 1,000 | 10,000 | 100,000
    // Updates stock based on quantity
    function commaSeperagtedStock(stockElements) {

        Array.from(stockElements).map(el => {
            const inventoryElem = el.querySelector('.ProductItem__quantity')
            if(!inventoryElem) return

            let currentText = inventoryElem.textContent
            const commaSeperated = currentText.replace(/[^\d]/g, '').split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," )

             /* Continue selling when out of stock enabled */
            const inventoryPolicy = el.querySelector('button input[data-quantity]:checked').dataset.policy
            const isContinue = inventoryPolicy === 'continue'
            
            if(isContinue) {
                currentText = "100+ available"
            } else if (currentText < 100) {
                currentText = "less than 100 in stock"
            } else {
                currentText = commaSeperated + ' in stock'
            }
                
            inventoryElem.textContent = currentText
        })
    }
    commaSeperagtedStock( document.querySelectorAll('.ProductItem__Quickview') )


    function createFormData(target) {
        const productID = target.dataset.productid
        const parentNode = target.closest('.Quickview-grid-right')
        const dataOptions = Array.from(parentNode.querySelectorAll('input[data-options]:checked'))
        
        // commaSeperagtedStock([parentNode]) // TO DO: Run this but function can't loop but only check the target of this current elements
        const variantStockCount = parentNode.querySelector('button input[data-quantity]:checked').dataset.quantity

        /* Updates the instock count */
        const commaSeperatedStock = variantStockCount.replace(/[^\d]/g, '').split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," );
        
        /* Continue selling when out of stock enabled */
        const inventoryPolicy = parentNode.querySelector('button input[data-quantity]:checked').dataset.policy
        const isContinue = inventoryPolicy === 'continue'
         
        let stockString;
        if( isContinue ) {
            stockString = "100+ available"
        } else if (variantStockCount < 100 ) {
            stockString = "less than 100 in stock"
        } else 
            stockString = commaSeperatedStock + ' in stock'

        const productQuantityElem = parentNode.querySelector('.ProductItem__quantity')
        
        if (productQuantityElem)  productQuantityElem.textContent = stockString 
        const elementPrice = parentNode.querySelector('input[data-price]:checked').dataset.price
        const price = Number(elementPrice.replace(/,/,''))


        if (isNaN(price)) {
            console.log('price from dataset is NaN')
        }
        const quantity = Number(parentNode.querySelector('.m-dropdown-quantity input:checked').value)
        currentQuantity = quantity
        const submitBtn = parentNode.querySelector('.Product__cart-submit')

        if(variantStockCount <= '0' && !isContinue) {
            submitBtn.innerText = 'Out of Stock'
            submitBtn.disabled = true
            submitBtn.classList.add('Product__no-stock')
        } else {
             // Undefinded if dropdown clicked from other than product dropdown
             if (submitBtn) submitBtn.textContent = 'Add to cart - $' + (price * quantity).toFixed(2)
             submitBtn.disabled = false
             submitBtn.classList.remove('Product__no-stock')
        }

        const propObj = dataOptions.reduce((obj, el) => {
            const arr = el.dataset.options.split(':')
            const key = arr[0]
            const val = arr[1]

            obj[key] = val
            return obj
        }, {})

        formData.items[0].properties = dataOptions.length ? propObj : {} 

        /* Only update product id when NOT clicked from quantity dropdown */
        if (productID) {
            formData['items'][0]['id'] = productID
        }
   
        formData['items'][0]['quantity'] = quantity
    }

    // Drop down variant select & quantity
    function toggleMenu() {
        const buttons = Array.from(document.getElementsByClassName('m-dropdown-toggle'))

        let toggle = []

        buttons.forEach((btn, i) => {
            toggle.push(true)
            btn.addEventListener('click', function (e) {
                e.stopPropagation()
                const target = e.target

                const dropdown = target.closest('.m-dropdown').getElementsByClassName('dropdown-menu-items')[0]

                /* Menu item clicked - update formdata object */
                if (target.tagName !== 'BUTTON') return createFormData(target)

                if (toggle[i]) {
                    document.addEventListener('click', hideDropDown)
                    dropdown.style.transform = 'translateY(0) scale(1)'
                    toggle[i] = false
                } else {
                    dropdown.style.transform = null
                    toggle[i] = true
                }

                function hideDropDown(e) {
                    dropdown.style.transform = null
                    toggle[i] = true
                    document.removeEventListener('click', hideDropDown)
                }
            })
        })
    }
    toggleMenu()
}

function checkMutation() {
    const sideNavNode = document.querySelector('.CollectionInner__Products')

    if (!sideNavNode) return;
    
    const mutationObserver = new MutationObserver((mutationList, observer) => {
        mutationList[0].addedNodes.forEach(el => {
            if( el.className === 'ProductListWrapper') {
                addToCart()
            }
        })
    })

    // have the observer observe for changes in children
    mutationObserver.observe(sideNavNode, { childList: true, subtree: true }) 
}

window.addEventListener('DOMContentLoaded', (event) => {
    addToCart(saleItem=false)
    checkMutation()
});


