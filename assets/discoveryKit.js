let state = {
    filter: '',
    collection: [],
    bundle: [],
    bundleQty: 0,
    collectionId: '',
    variantTitle: ''
}

const getCollection = (collectionId, variantTitle) => {
    fetch('https://api.makesy.com/collections-all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: collectionId })
    })
    .then(res => res.json())
    .then(data => {
        data.forEach(product => {
            const [bundleVariant] = product.variants.filter(variant => variant.title.toLowerCase() === variantTitle)
            if(bundleVariant && product.status === 'active' && product.product_type === 'fragrances') {
                state.collection.push({
                    ...product,
                    bundleVariant,
                    bundleQuantity: 0,
                })
            }
        })
        productDisplay()
    })
    .catch(err => console.log('err', err))
}

const filters = {
    active: () => {
        const active = document.querySelector('.m-filters button.active')
        if(active) {
            active.classList.remove('active')
        }
        const newActive = document.querySelector(`[data-tag='${state.filter}']`)
        newActive.classList.add('active')
        const mobileFilterBtn = document.querySelector('.e-filterBtn')
        mobileFilterBtn.textContent = `filter by ${newActive.textContent}`
    },
    select: (e) => {
        state.filter = e.target.dataset.tag
        productDisplay()
        if(window.innerWidth <= 767) window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    showMenu: () => {
        const filterBtn = document.querySelector('.e-filterBtn')
        filterBtn.style.display = 'none'
        const filters = document.querySelector('.m-filters')
        filters.style.display = 'flex'
    },
    closeMenu: () => {
        const filterBtn = document.querySelector('.e-filterBtn')
        filterBtn.style.display = 'block'
        const filters = document.querySelector('.m-filters')
        filters.style.display = 'none'
    }
}

const bundle = {
    display: () => {
        const bundleWrapper = document.querySelector('.swiper-wrapper')
        const fragment = new DocumentFragment
        if(bundleWrapper.firstChild) {
            while(bundleWrapper.firstChild) bundleWrapper.removeChild(bundleWrapper.lastChild)
        }
        for(let i = 0; i < 10; i++) {
            const slide = document.createElement('div')
            slide.classList.add('swiper-slide')
            const slideContent = document.createElement('div')
            slideContent.classList.add('m-bundleItem')
            const slideOverlay = document.createElement('div')
            const overlayText = document.createElement('p')
            overlayText.className = 'e-overlayText'
            if(state.bundle[i]) {
                const productImg = document.createElement('img')
                productImg.src = state.bundle[i].image ? state.bundle[i].image.src : 'https://cdn.shopify.com/s/files/1/0411/8246/2106/t/203/assets/makesy-logomark.svg?v=143047762468104890631647476441'
                const deleteItem = document.createElement('span')
                deleteItem.innerHTML = '&times;'
                deleteItem.className = 'e-delete'
                deleteItem.onclick = () => {bundle.deleteItem(i)}
                const bundleQuickBtn = document.createElement('button')
                window.innerWidth <= 767 ? bundleQuickBtn.classList.add('e-bundleQuickBtn') : bundleQuickBtn.classList.add('e-bundleQuickBtn', 'active')
                bundleQuickBtn.textContent = 'quick view'
                bundleQuickBtn.onclick = () => quickView.open(state.bundle[i])
                overlayText.textContent = state.bundle[i].title
                slideOverlay.className = 'e-selectedOverlay'
                slideOverlay.style.opacity = 1
                slideContent.append(productImg, deleteItem, bundleQuickBtn)
            } else {
                const emptyItem = document.createElement('p')
                emptyItem.className = 'e-empty'
                emptyItem.textContent = i + 1
                overlayText.textContent = 'select from below'
                slideOverlay.className = 'e-emptyOverlay'
                slideContent.append(emptyItem)
            }
            slideOverlay.append(overlayText)
            slideContent.append(slideOverlay)
            slide.append(slideContent)
            fragment.append(slide)
        }
        bundleWrapper.append(fragment)
        bundle.btnState(state.bundle.length)
    },
    addItem: (product) => {
        const productElement = document.getElementById(product.bundleVariant.id)
        const label = productElement.querySelector('.e-label')
        product.bundleQuantity++
        state.bundle.push(product)
        quickView.close()
        bundle.display()
        label.textContent = `${product.bundleQuantity} added`
        label.style.display = 'block'
        if(state.bundle.length === 10) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            productDisplay()
        }
    },
    deleteItem: (bundleIndex) => {
        const productIndex = state.collection.findIndex(product => state.bundle[bundleIndex].id === product.id)
        const product = state.collection[productIndex]
        const productElement = document.getElementById(product.bundleVariant.id)
        const label = productElement.querySelector('.e-label')
        product.bundleQuantity--
        state.bundle.splice(bundleIndex, 1)
        bundle.display()
        label.textContent = `${product.bundleQuantity} added`
        product.bundleQuantity === 0 ? label.style.display = 'none' : null
        if(state.bundle.length === 9) productDisplay()
    },
    btnState: (bundleLength) => {
        const submit = document.querySelector('.e-submit')
        const submitText = document.querySelector('.e-submit span')
        const bundleAlert = document.querySelector('.e-bundleAlert')
        if(bundleLength === 10) {
            submit.disabled = false
            submitText.innerText = 'you did it! add to bag'
            submit.classList.add('active')
            bundleAlert.style.display = 'block'
        } else {
            submit.disabled = true
            submitText.innerText = `${bundleLength} / 10`
            submit.classList.remove('active')
            bundleAlert.style.display = 'none'
        }
    },
    submit: (kitVariantId, kitKey) => {
        const cartBundleQty = 0
        const cartItems = fetch(window.Shopify.routes.root + 'cart.js')
        .then(response => response.json())
        .then(data => {
            data.items.forEach(item => {
                if(item.properties['_discovery_kit_id']) cartBundleQty++
            })
        });
        const bundleVariants = state.collection.filter(item => item.bundleQuantity > 0)
        const bundleProperties = {}
        bundleProperties[kitKey] = true
        bundleVariants.forEach((item, i) => {
            bundleProperties[item.title] = `x ${item.bundleQuantity}`
            bundleProperties[`_item${i + 1}`] = item.bundleVariant.sku
            bundleProperties[`_quantity${i + 1}`] = item.bundleQuantity
        })
        const bundleData = [{
            id: kitVariantId,
            quantity: 1,
            properties: bundleProperties
        }]
        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'items': bundleData
            })
        })
        .then(res => {
            const json = res.json()
            updateCart(json)
        })
        .catch(err => {
            console.error('err:', err)
        })
        state.collection = []
        state.bundle = []
        getCollection(state.collectionId, state.variantTitle, state.filter)
        bundle.display()
    }
}

/* Ater item added to cart update cart with new item and open it */
async function updateCart(returnData) {
    const openCartBtn = document.querySelector('[data-action="open-drawer"]')
    const cartIcon = document.querySelector('[data-action="open-drawer"] .small')
    const res = await fetch(window.routes.cartUrl + '?view=drawer&timestamp=' + Date.now(), {
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
    // Array.from(newCartItem.querySelectorAll('.CartItem__Title.Heading a')).forEach(title => {
    //     if (title.textContent === 'you planted trees for earth day' || title.textContent === 'makesy your own fragrance kit') {
    //         title.style.pointerEvents = 'none'
    //     }
    // })

    parent.replaceChild(newCartItem, currentCart)
    openCartBtn.click();
    // updateShippingPercent(returnData)
}

const productDisplay = () => {
    filters.active()
    const products = state.collection.filter(product => product.tags.includes(state.filter))
    const productGrid = document.querySelector('.m-productContainer')
    const fragment = new DocumentFragment()
    if(productGrid.firstChild) {
        while(productGrid.firstChild) productGrid.removeChild(productGrid.lastChild)
    }
    products.forEach(product => {
        // container
        const newItem = document.createElement('div')
        newItem.className = 'm-product'
        newItem.id = product.bundleVariant.id

        // image
        const imageContainer = document.createElement('div')
        imageContainer.className = 'm-imgContainer'
        const imageContainerMobile = document.createElement('div')
        window.innerWidth <= 767 ? imageContainerMobile.classList.add('m-imgContainerMobile', 'active') : imageContainerMobile.classList.add('m-imgContainerMobile')
        imageContainerMobile.onclick = () => quickView.open(product)
        const image = document.createElement('img')
        image.src = product.image ? product.image.src : 'https://cdn.shopify.com/s/files/1/0411/8246/2106/t/203/assets/makesy-logomark.svg?v=143047762468104890631647476441'
        image.classList.add('e-img', 'e-lazyload')
        // image.loading = "lazy"
        imageContainer.append(imageContainerMobile, image)
        newItem.append(imageContainer)

        const label = document.createElement('span')
        label.className = 'e-label'

        // sold out label
        if(product.bundleVariant.inventory_quantity <= 0 && product.bundleVariant.inventory_policy !== "continue") {
            label.textContent = 'sold out'
            label.style.display = 'block'
        }

        // added label
        if(product.bundleQuantity > 0) {
            label.textContent = `${product.bundleQuantity} added`
            label.style.display = 'block'
        }

        imageContainer.append(label)

        // functional fragrance icon
        if(product.tags.includes('functional-fragrance')) {
            const icon = document.createElement('img')
            icon.src = 'https://cdn.shopify.com/s/files/1/0411/8246/2106/files/functional-fragrance.png'
            icon.className = 'e-icon'
            icon.loading = "lazy"
            imageContainer.append(icon)
        }

        // quick view button
        const btn = document.createElement('button')
        const btnText = document.createTextNode('quick view')
        btn.append(btnText)
        window.innerWidth <= 767 ? btn.classList.add('e-btn') : btn.classList.add('e-btn', 'active')
        btn.setAttribute('data-variant', product.bundleVariant.id)
        btn.onclick = () => quickView.open(product)
        imageContainer.append(btn)

        // title
        const title = document.createElement('p')
        const titleText = document.createTextNode(product.title)
        title.append(titleText)
        title.className = 'e-title'
        newItem.append(title)

        // add button
        const addBtn = document.createElement('button')
        addBtn.className = 'e-addBtn'
        if(product.bundleVariant.inventory_quantity <= 0 && product.bundleVariant.inventory_policy !== "continue") {
            addBtn.textContent = 'sold out'
            addBtn.disabled = true
        } else if(state.bundle.length == 10) {
            addBtn.style.display = 'none'
        } else {
            addBtn.textContent = 'add'
            addBtn.disabled = false
        }
        addBtn.onclick = () => bundle.addItem(product)
        newItem.append(addBtn)

        // append to fragment
        fragment.append(newItem)
    })

    // quick view modal
    const newQuickView = document.createElement('div')
    newQuickView.className = 'm-quickView'
    const quickContent = document.createElement('div')
    quickContent.className = 'm-quickView-content'
    const quickClose = document.createElement('div')
    quickClose.innerHTML = '&times;'
    quickClose.className = 'e-close'
    quickClose.onclick = () => {quickView.close()}
    const quickImg = document.createElement('img')
    quickImg.className = 'e-quickImage'
    const quickImgContainer = document.createElement('span')
    quickImgContainer.className = 'm-quickImgContainer'
    quickImgContainer.append(quickImg)
    const quickInfoContainer = document.createElement('div')
    quickInfoContainer.className = 'm-quickInfoContainer'
    const quickTitle = document.createElement('h2')
    quickTitle.className = 'e-quickTitle'
    const quickBody = document.createElement('div')
    quickBody.className = 'e-quickBody'
    const quickBtn = document.createElement('button')
    quickBtn.className = 'e-quickBtn'
    quickInfoContainer.append(quickTitle, quickBody, quickBtn)
    quickContent.append(quickClose, quickImgContainer, quickInfoContainer)
    newQuickView.append(quickContent)
    fragment.append(newQuickView)
    productGrid.append(fragment)

    const productImgs = document.querySelectorAll('.e-lazyload')
    const productsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.remove('e-lazyload')
                productsObserver.unobserve(entry.target)
            }
        })
    })
    productImgs.forEach(img => {
        productsObserver.observe(img)
    })
}

const quickView = {
    open: function(product) {
        const imageContainer = document.querySelector('.m-quickImgContainer')
        const image = document.querySelector('.e-quickImage')
        const title = document.querySelector('.e-quickTitle')
        const body = document.querySelector('.e-quickBody')
        const addBtn = document.querySelector('.e-quickBtn')
        const ffIcon = document.querySelector('.e-iconQ')

        // image
        image.src = product.image ? product.image.src : 'https://cdn.shopify.com/s/files/1/0411/8246/2106/t/203/assets/makesy-logomark.svg?v=143047762468104890631647476441'
        
        // functional fragrance icon
        if(product.tags.includes('functional-fragrance')) {
            const icon = document.createElement('img')
            icon.src = 'https://cdn.shopify.com/s/files/1/0411/8246/2106/files/functional-fragrance.png'
            icon.className = 'e-iconQ'
            imageContainer.append(icon)
        } else if(ffIcon) {
            console.log('ffIcon:', ffIcon)
            ffIcon.parentNode.removeChild(ffIcon)
        }

        // title
        title.textContent = product.title

        // body
        body.innerHTML = ''
        body.insertAdjacentHTML('afterbegin', product.body_html)

        if(product.bundleVariant.inventory_quantity <= 0 && product.bundleVariant.inventory_policy !== "continue") {
            addBtn.textContent = 'sold out'
            addBtn.disabled = true
        } else if(state.bundle.length == 10) {
            addBtn.textContent = 'remove an item first'
            addBtn.disabled = true
        } else {
            addBtn.textContent = 'add to kit'
            addBtn.disabled = false
        }
        addBtn.onclick = () => bundle.addItem(product)

        const quickViewEl = document.querySelector('.m-quickView')
        quickViewEl.style.display = 'block'
        quickView.animated(true, quickViewEl)
    },
    close: function() {
        const quickViewEl = document.querySelector('.m-quickView')
        quickView.animated(false, quickViewEl)
        quickViewEl.style.display = 'none'
    },
    animated: function(open, modal) {
        let start = 0
        function animate(timestamp) {
            if(!start) start = timestamp
            const progress = quickView.inCubic(Math.min((timestamp - start) / 425, 1))
            const scale = open ? 1 * progress : 1 - ( 1 * progress ) 
    
            modal.style.transform = 'translate(-50%, -50%) scale('+scale+')'
            modal.style.opacity = scale
    
            if(progress < 1) {
                requestAnimationFrame(animate)
            } else start = 0
        }
        requestAnimationFrame(animate)
    },
    inCubic: function(n){
        return n * n * n;
    }
}

const onLoad = (collectionId, variantTitle, filter) => {
    state.filter = filter
    var swiper = new Swiper(".m-bundle", {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
            nextEl: '.e-next',
            prevEl: '.e-previous',
        },
        breakpoints: {
            768: {
                slidesPerView: 5,
                spaceBetween: 10
            },
            1024: {
                slidesPerView: 10,
                spaceBetween: 10
            }
        },
        observer: true
    });
    bundle.display()
    getCollection(collectionId, variantTitle)
    state.collectionId = collectionId
    state.variantTitle = variantTitle
}

window.onclick = (event) => {
    const quickView = document.querySelector('.m-quickView')
    if (event.target.classList.contains('m-quickView')) {
        // quickView.style.transform = null
        // quickView.style.opacity = null
        quickView.style.display = 'none'
    }
}



