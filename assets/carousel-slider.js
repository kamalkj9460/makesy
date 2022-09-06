window.addEventListener('DOMContentLoaded', (event) => {
    carousel()
})


const Carousel = function (carousel) {
    const data = carousel.dataset
    const current_items = carousel.querySelectorAll('.c-carousel-item')
    const item_parent = carousel.querySelector('.carousel-item-array')
    
    /* If data attribute exist for override then desktop items will show inline and no handles for carousel */
    const overRide = data.override
    const countRequested = Number(data.itemCount || 4);
    const current_items_length = current_items.length

    // Cached / State
    let carousel_wrap = carousel.querySelector('.c-carousel-wrap')
    let shown = false
    let show_count = 0
    let carousel_transform = 0;
    let newItemsLength = 0
    let carousel_width = 0
    let item_width = 0
    let isMoving = false
    let isGestureMoving = false // Keeps Carousel from moving when image clicked for modal / popup is in use
    let current_items_width = 0
    let initialPosition = null
    let difference = 0
    let direction = ''
    let new_wW = ''
    let max_animated_width = 0
    let inview = []

    if (current_items_length < 4) throw 'Not enough carousel items to display'

    // Utility Functions
    const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < data.scroll;
    /*  
        Checks if data-scroll is set less than the window width 
        and data.scroll is added as a data attribute if isMobile device is true
    */
    const scroll = () => window.innerWidth < data.scroll && (isMobile()) ? true : false
    const item_offset = () => scroll() ? 30 : 0 // Offset each item in pixels
    
    const showButtons = () => {
        carousel.querySelectorAll('.c-left-btn, .c-right-btn')
            .forEach(btn =>  scroll() || overRide ? btn.style.display = 'none' : btn.style.display = 'block')
    }

    const addRemoveEventListeners = () => {
        if ( isMobile() && !data.scroll ) {
            carousel.querySelector('.c-carousel-wrap').addEventListener('touchstart', gestureStart, false)
            carousel.querySelector('.c-carousel-wrap').addEventListener('touchmove', gestureMove, false)
            carousel.querySelector('.c-carousel-wrap').addEventListener('touchend', gestureEnd, false)

            carousel.querySelector('.c-left-btn').removeEventListener('click', rotate)
            carousel.querySelector('.c-right-btn').removeEventListener('click', rotate)
        } else  {
            carousel.querySelector('.c-left-btn').addEventListener('click', rotate)
            carousel.querySelector('.c-right-btn').addEventListener('click', rotate)

            carousel.querySelector('.c-carousel-wrap').removeEventListener('touchstart', gestureStart, false)
            carousel.querySelector('.c-carousel-wrap').removeEventListener('touchmove', gestureMove, false)
            carousel.querySelector('.c-carousel-wrap').removeEventListener('touchend', gestureEnd, false)
        }
    }

    /* Carousel Resize Event */
    const resizeObserve = new ResizeObserver(entries => {
        loadCarousels()
    })
    resizeObserve.observe(item_parent)


    function observeCarouselInview(inView) {
        if (inView && !shown) {
            shown = true

            let i = inview.length
            while (i--) {
                const index = i
                setTimeout(() => {
                    inview[index].style.transform = null
                    inview[index].style.opacity = null
                }, i * 125)
            }
        }
    }
    const observer = new IntersectionObserver(entries => {
        !shown && observeCarouselInview(entries[0].isIntersecting)
    })
    observer.observe(carousel)

    /* scroll without transfrom */
    function touchScroll(items, scroll_start) {
        item_parent.style.overflow = 'auto'
        const firstElement = items[0]
        const lastElement = items[items.length - 1]
        const frontAndBack = [firstElement, lastElement]

        frontAndBack.forEach(item => {
            const ob = new IntersectionObserver(obCallback, {
                threshold: 1,
            });
            ob.observe(item);
        })

        /* IF OBSERVER ABOVE FOR SHOW ELEMENTS WHEN IN VIEW IS REMOVED
         * WE CAN REMOVE THE LOGIC FOR elementMoved BELOW
         */
        let elementMoved = false
        function obCallback(payload) {

            const entry = payload[0]
            if (entry.intersectionRatio === 1) {
                if (lastElement == entry.target) {
                    item_parent.scroll(scroll_start,0)
                } 
                
                if (firstElement == entry.target) {
                    elementMoved && item_parent.scrollTo(current_items_width, 0)
                }

            } else {
                /* Stopes from running elements on Y scroll */
                if (entry.intersectionRect.y === entry.boundingClientRect.y) {
                     elementMoved = true
                }
            }
        }
    }

    const checkCarouselEnd = function () {
        item_parent.style.transition = null
        const carousel_width = carousel.querySelector('.c-carousel-wrap').getBoundingClientRect().width
        isMoving = false
        // Keeps Carousel from moving when image clicked for modal / popup
        isGestureMoving = false
        // Makes sure carousel_transform variable is always a positive number to begin with
        const currentTransform = carousel_transform < 0 ? carousel_transform * -1 : carousel_transform

        /* Items reached max distance right */
        if (max_animated_width - currentTransform < carousel_width) {
            carousel_transform = carousel_transform + current_items_width
            item_parent.style.transform = 'translate3d(' + carousel_transform + 'px, 0, 0)'
        }
        /* Items reached max distance left */
        else if (currentTransform < carousel_width) {
            carousel_transform = -(currentTransform + current_items_width)
            item_parent.style.transform = 'translate3d(' + carousel_transform + 'px, 0, 0)'
        }
    }

    /* Recursion returning just enough count to make carousel items even for current show_count */
    const evenCount = (items, show) => {
        const checking = (start) => {
            if ((items + show + start) % show == 0) {
                return start
            }
            start++
            return checking(start)
        };
        /* Ending items plus any difference with show_items and ending items */
        return checking(show) + (items % show)
    }

     function updateContainerValues(item_width) {
        item_parent.style.gridTemplateColumns = 'repeat(' + newItemsLength + ',' + item_width + 'px)' 
        if(scroll()) {
            item_parent.style.transform = null
            item_parent.style.overflow = 'auto'
        } else {
            item_parent.style.overflow = null
            item_parent.style.transform = 'translate3d(' + carousel_transform + 'px, 0, 0)'
        }
    }

    // Only if break points for window width change or page load addElement runs
    function addElement() {
        const cloneStart = current_items_length - show_count
        const cloneEnding = evenCount(current_items_length, show_count)

        newItemsLength = 0
        // Clone elements add before and after current items
        for (let i = 0; i < current_items_length; i++) {
            const el = current_items[i]

            // Adds additional items to the beginning
            if (i >= cloneStart) {
                const cloned = el.cloneNode(true)
                cloned.className += " cloned"
                item_parent.insertBefore(cloned, current_items[0])
                newItemsLength++
            }
            // Add additional items to the end
            if (i < cloneEnding) {
                const cloned = el.cloneNode(true)
                cloned.className += " cloned"
                item_parent.appendChild(cloned)
                newItemsLength++
            }
            newItemsLength++
            /* Only images in view get tranformed into view on scroll */
            if (i < show_count && !shown && !scroll) {
                el.style.transform = 'translateY(75px)'
                el.style.opacity = 0
                inview.push(el)
            }
        }

        setTimeout(addRemoveEventListeners, 500)

        if(scroll()) {
            const carousel_items = carousel.querySelectorAll('.c-carousel-item')
            const scroll_end_start = (item_width * cloneEnding) -  item_offset() * show_count

            item_parent.scroll(0,0)
            touchScroll(carousel_items, scroll_end_start)
        } 
    }

    function removeCloned() {
        item_width = carousel_width / show_count - item_offset()
        const cloned = carousel.querySelectorAll('.cloned')
        const cloned_count = cloned.length
        for (let i = 0; i < cloned_count; i++) item_parent.removeChild(cloned[i])
        addElement()
    }

    function checkShowCount(count) {
        if (count * 2 <= current_items_length) return count
        if ((count - 1) * 2 <= current_items_length) return count - 1
        if ((count - 2) * 2 <= current_items_length) return count - 2
        if ((count - 3) * 2 <= current_items_length) return count - 3
    }

    function loadCarousels() {
        carousel_wrap = carousel.querySelector('.c-carousel-wrap')
        carousel_width = carousel_wrap.getBoundingClientRect().width
        
        const wW = window.innerWidth

        switch (true) {
            case wW > 1201 && new_wW != 'xl':
                show_count =  overRide ? overRide : checkShowCount(countRequested)
                removeCloned()
                new_wW = 'xl'
                break;
            case wW > 992 && wW <= 1200  && new_wW != 'lg':
                show_count =  overRide ? overRide : checkShowCount(countRequested-1)
                removeCloned()
                new_wW = 'lg'
                break;
            case wW > 768 && wW <= 991  && new_wW != 'md':
                show_count = checkShowCount(countRequested-1)
                removeCloned()
                new_wW = 'md'
                break;
            case wW <= 768 && wW > 576  && new_wW != 'sm':
                show_count = 3
                removeCloned()
                new_wW = 'sm'
                break;
            case wW <= 576  && new_wW != 'xs':
                show_count = 2
                removeCloned()
                new_wW = 'xs'
        }

        item_width = carousel_width / show_count - item_offset()
        carousel_transform = -(item_width * show_count)
        current_items_width = item_width * current_items_length
        max_animated_width = item_width * newItemsLength - carousel_width

        showButtons()
        
        /* This updates the values always on screen size change */
        updateContainerValues(item_width)
    }

    function rotate(ev, touchX) {
        if (isMoving) return

        const wW = window.innerWidth
        const target = ev.target.className
        const carousel_width = carousel.querySelector('.c-carousel-wrap').getBoundingClientRect().width
        transformed = true

        item_parent.style.transition = wW < 768 ? 'transform .4s  cubic-bezier(0.33, 1, 0.68, 1)' : 'transform .55s cubic-bezier(0.33, 1, 0.68, 1)'

        if (target === 'c-left-btn' || direction === 'left') {
            const x = touchX ? (carousel_transform -= touchX) : carousel_transform += carousel_width
            item_parent.style.transform = 'translate3d(' + x + 'px, 0, 0)'

        } else {
            const x = touchX ? (carousel_transform += touchX) : carousel_transform -= carousel_width
            item_parent.style.transform = 'translate3d(' + x + 'px, 0, 0)'
        }

        isMoving = true
        item_parent.addEventListener('transitionend', checkCarouselEnd)
    }
    let initialCarouselTransform = 0
    function gestureStart(e) {
        initialPosition = e.changedTouches[0].pageX;
        // On every first touch updates container transform X
        initialCarouselTransform = Number(carousel.querySelector('.carousel-item-array').style.transform.replace(/(translate3d)+\(([-\d.]+)px(.*)/gi, '$2')) * -1
    }
     function gestureMove(e) {
        if (isMoving) return
        let pageX = e.changedTouches[0].pageX
        let previous = pageX - initialPosition

        // Updates which direction to rotate
        direction = previous > difference ? 'right' : 'left'
        difference = pageX - initialPosition

        carousel_transform = - initialCarouselTransform + difference
        item_parent.style.transform = 'translateX(' + carousel_transform + 'px)'
        isGestureMoving = true // Keeps Carousel from moving when image clicked for modal / popup
    }
     function gestureEnd(e) {
        // Keeps Carousel from moving when image clicked for modal / popup
        if (!isGestureMoving) return
        const carousel_wrap_width = carousel.querySelector('.c-carousel-wrap').getBoundingClientRect().width

        if (direction === 'left') {
            const touchX = carousel_wrap_width + difference
            rotate(e, touchX)
        } else {
            const touchX = carousel_wrap_width + -difference
            rotate(e, touchX)
        }
    }
}


function carousel() {
    /* Carousels to Load */
    const carousels = document.querySelectorAll('.c-carousel')
    /* Loops through all the carousels on the page */
    carousels.forEach(carouselElem => {
        try {
            let carousel = new Carousel(carouselElem)
        } catch (e) { 
            console.log('Error with carousel.. ', e)
        }
    })
} // *** End of Carousel script ***
