
const HeroCarousel = function (main) {

    const button_container = document.querySelector('.r-button-count')
    const button_mark = button_container.querySelector('span')
    const header_titles = main.querySelectorAll('.header--title')
    const header_subtitles = main.querySelectorAll('.header--subtitles span')
    const cta = main.querySelector('.header--cta')
    const ctaBTNs = main.querySelectorAll('.header--cta span')
    const carousel = main.querySelector('.r-carousel')
    const c_items = carousel.querySelectorAll('.carousel__item')
    const item_overlay = carousel.querySelector('.r-carousel-overlay')
    const title_container = main.querySelector('.r-header-card')
    const carouselFlex = document.querySelector('.index__hero-flex')

    // Cache / state
    let index = 0
    let isOpen = false
    let start = 0
    let reqId;
    let isMoving;
    let timeoutID;
    let header_data = []
    let newIndex = false;
    let wW = window.innerWidth

    return {
        updateCarousel: function (e) {
            cancelAnimationFrame(reqId)
            clearTimeout(timeoutID)
            start = 0

            reqId = requestAnimationFrame(this.rotate.bind(this))
            newIndex = Number(e.target.dataset.cIndex) - 1
        },
        /* Resize change H1 titles position */
        observe: function (el) {
            let window_diff = window.innerWidth - wW

            if (window_diff < -50 || window_diff > 50) {
                // Clear timers
                cancelAnimationFrame(reqId)
                clearTimeout(timeoutID)

                const header_titles = main.querySelectorAll('.header--title')
                let i = header_titles.length

                while (i--) {
                    const title = header_titles[i].children[0]

                    // Update pos of titles
                    const header_parent_height = header_titles[i].getBoundingClientRect().height
                    title.style.transform = 'translate(0,' + header_parent_height + 'px)'

                    header_data[i].titleHeight = header_parent_height
                }

                wW = window.innerWidth
                requestAnimationFrame(this.rotate.bind(this))
            }
        },
        loadCarousels: function (callback) {
            title_container.style.opacity = 1

            let i = 0

            while (i < c_items.length) {
                const title = document.createElement('span');
                const header_parent_height = header_titles[i].getBoundingClientRect().height

                title.textContent = header_titles[i].textContent
                title.style.transform = 'translate(0,' + header_parent_height + 'px)'
                header_data.push({
                    opacity: 0, 
                    currentOpac: 0,
                    scale: 1.2, 
                    currentScale: 0,
                    titleHeight: header_parent_height,
                    currentHeight: 0,
                    title: title,
                    subtitle: header_subtitles[i],
                    CTAs: ctaBTNs[i],
                    ctaURL: ctaBTNs[i].dataset.url
                })

                /* Remove text from h1 after added to new title node above ^ */
                header_titles[i].textContent = ""
                header_titles[i].appendChild(title)

                const button = document.createElement('button');
                const index = document.createTextNode(i + 1);
                button.setAttribute('data-c-index', i + 1)
                button.appendChild(index)
                button_container.insertBefore(button, button.nextSibling)

                i++
            }
            this.animate_css_items(header_data, index)
            this.rotate()
        },
        animate_css_items: function (header_data, index) {
            const subtitle = header_data[index].subtitle
            const cta = header_data[index].CTAs
            const x = -index * 100

            if (index) {
                header_data.forEach(header => {
                    if (header.subtitle != subtitle) {
                        header.subtitle.style.transform = 'translate(' + x + '%)'
                        header.subtitle.style.opacity = 0
                        header.CTAs.style.transform = 'translate(' + x + '%)'
                        header.CTAs.style.opacity = 0
                    }
                })
                button_mark.style.transform = index === 1 ? 'translate(-50px)' : 'translate(0)'
                
            } else {
                header_data.forEach(header => {
                    header.subtitle.removeAttribute('style')
                    header.CTAs.removeAttribute('style')
                })
                button_mark.style.transform = 'translate(-100px)'
            }

            subtitle.style.opacity = 1
            subtitle.style.transform = 'translate(' + x + '%)'
            cta.style.opacity = 1
            cta.style.transform = 'translate(' + x + '%)'
        },
        rotate: function (e) {
            const c_length = c_items.length

            const ease = outCube = function (n) {
                return --n * n * n + 1;
            };

            const animate = (timestamp) => {
                if (!start) start = timestamp
                const header = header_data[index]
                const progress = ease(Math.min((timestamp - start) / 550, 1))
                const x = progress * 100
                const headerHeight = header.titleHeight
                const cta_href = header.ctaURL

                const scale = isOpen ? 1 : header.scale - (progress * .2)
                const opacity = isOpen ? 1 : header.opacity + (progress * 1)
                // isOpen true to the right when false back to the left
                overlay_x = isOpen ? -100 + x : 0 - x;
                header_data[index].currentHeight = isOpen ? headerHeight * progress : headerHeight - (headerHeight * progress)
                header.title.style.transform = 'translate(0%,' + header_data[index].currentHeight + 'px)'

                /* Image shown & overlay animates away */
                c_items[index].style.opacity = opacity
                c_items[index].style.transform = 'scale(' + scale + ')'
                c_items[index].style.zIndex = 3
                c_items[index].setAttribute('data-heroURL', cta_href)
                item_overlay.style.transform = 'translate(' + overlay_x + '%)'
                
                cta.setAttribute('href', cta_href)

                if (progress < 1) {
                    
                    
                    reqId = requestAnimationFrame(animate)
                } else {
                    carouselFlex.setAttribute('data-herourl', header.ctaURL)
                    // carouselFlex.href = header.ctaUR
                    isOpen = !isOpen

                    // css transition applied to overlay instead
                    isOpen ? item_overlay.style.opacity = 1 : item_overlay.style.opacity = 0

                    if (overlay_x === 0) {
                        c_items[index].removeAttribute('style')
                        index++

                        /* If clicked while auto animating */
                        if (typeof newIndex === 'number') {
                            index = newIndex
                            newIndex = false
                        }
                    }

                    /* Starts Carousel Over */
                    if (index === c_length) {
                        index = 0
                    }
                    if (isOpen) {
                        timeoutID = setTimeout(() => {
                            start = 0
                            reqId = requestAnimationFrame(animate)
                        }, 5000)
                    } else {
                        this.animate_css_items(header_data, index)
                        start = 0
                        reqId = requestAnimationFrame(animate)
                    }
                }
            }
            reqId = requestAnimationFrame(animate)
            if (isMoving) return

            isMoving = true
        }
    }
}

function heroImageClick() {
    const carousel = document.querySelector('.index__hero-flex')
    carousel.onclick = function (e) {
        const hrefURL = e.target.dataset.herourl
        if(hrefURL === "#") return
            window.location.replace(hrefURL)
    }
}

function heroCarousel() {
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    /* Carousels to Load */
    const carousels = document.querySelectorAll('.index__hero-flex')

    /* Loops through all the carousels on the page */
    carousels.forEach(carouselElem => {

        try {
            let carousel = new HeroCarousel(carouselElem)
            const observer = new ResizeObserver(entries => {
                carousel.observe(entries)
            })
            observer.observe(document.body)

            // Anitial page load adds and updates elements width
            carousel.loadCarousels()
           document.querySelector('.r-button-count').addEventListener('click', carousel.updateCarousel.bind(carousel))

        } catch (e) {
            console.error('Error with carousel.. ', e)
        }
    })

} // *** End of Carousel script ***

window.addEventListener('load', () => {
    heroCarousel()
    heroImageClick()
})



