// @ts-nocheck

function Navigations() {
    let isMobile = true
    let isDesktop = true
    const top_menu = document.getElementsByClassName('header__list')[0]
    const menu_content = document.getElementsByClassName('mobile__menu-back')[0]
    const menu_items = document.querySelectorAll('.header__mega-nav li, .header__list li')
    const back_button = document.getElementsByClassName('mobile__menu-back-btn')[0]
    const back_button_content = document.getElementsByClassName('--menu-back-items')[0]
    const nav = document.getElementsByClassName('header__navigation')[0]
    const icon_group = document.getElementsByClassName('header__icon-group')[1]
    const underlay = document.getElementsByClassName('nav-underlay')[0]
    const menu_wrapper = document.querySelector('.header__nav-transform')
    const allNavs = menu_wrapper.getElementsByTagName('ul')
    const open_side_nav_elements = document.querySelectorAll('.nav__hamburger, #search-mobile, #search-mobile-filter')
    const mobile_predective_search = document.querySelector('.--Mobile #shopify-section-predictive-search')
    const mobile_results_filter = document.querySelector('.Search__filter-mobile')
    const menu_title = document.getElementsByClassName('mobile__menu-title')[0]
    const expert_support_menu = document.querySelector('.expert-support__menu')
    const nav_arrow = document.getElementsByClassName('nav_arrow')[0]

    /* STATE MOBILE */
    let PARENT_ID, PREV_MENU, isRight
    let COUNT = 1
    let START_DIST = 0
    let STEP = 0
    let PREV_ELEMENTS = []

    /* STATE DESKTOP */
    let CURRENT_STEP, CURRENT_NAV_ID, TOP_NAV_ID, CURRENT_X;

    let group = {}

    this.addEventListeners = function () {
        window.addEventListener('resize', resize)


        open_side_nav_elements.forEach( el => {
            el.addEventListener('click', e => {
                if(e.target.id == 'search-mobile') {
                    mobile_predective_search.classList.add('show-search-mobile');
                    top_menu.classList.add('hide-nav-mobile');
                }
                if(e.target.id == 'search-mobile-filter') {
                    mobile_results_filter.classList.add('show-search-mobile');
                    top_menu.classList.add('hide-nav-mobile');
                }
                e.preventDefault()
                nav.style.transform = 'translateX(0)';
                nav.style.boxShadow = '0 13px 27px -5px rgba(50, 50, 93, 25%), 0 8px 16px -8px rgba(0, 0, 0, 30%), 0 -6px 16px -6px rgba(0, 0, 0, 3%)';
                underlay.style.pointerEvents = 'auto'
                document.body.style.overflow = 'hidden'
            })
        })
        

        underlay.addEventListener('click', (e) => {
            removeMobileStyles()
        })

        /* Mobile go back a menu */
        back_button.addEventListener('click', (e) => {
            initMobileMenu(e.target)
        })

        /* Mobile Menu Items */
        menu_items.forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation()
                const target = e.target
                if (target.tagName === 'LI') {
                    window.innerWidth < 768 && initMobileMenu(target)
                }
            })
        })
    }

    function resize() {
        const wW = window.innerWidth

        if (wW < 768) {
            if (isMobile) {
                isMobile = false
                isDesktop = true
                resetAllStyles()
                underlay.removeEventListener("mouseenter", resetDesktopStyles)
                document.querySelector('.header__navigation').removeEventListener("mouseover", initNavDesktop)
                
                navMobile()
            }
            return;
        }
        if (isDesktop) {
            isDesktop = false
            isMobile = true
            resetAllStyles()
            document.querySelector('.header__navigation').addEventListener("mouseover", initNavDesktop)
            top_menu.classList.remove('hide-nav-mobile');
            document.body.style = null
            navDesktop()
        }
    }
    resize()


    function resetAllStyles() {
        let i = allNavs.length
        while (i--) {
            allNavs[i].style.opacity = null
            allNavs[i].style.pointerEvents = 'none'
            allNavs[i].style.transform = null
            allNavs[i].style.left = null
        }
        underlay.style.pointerEvents = null
        Object.assign(menu_wrapper.style, {
            opacity: null,
            transform: null,
            height: null,
            width: null
        })
        
        
        // menu_wrapper.removeAttribute('style')
        top_menu.style.opacity = null
        top_menu.style.transform = null
        menu_content.style.transform = null
        nav.style.boxShadow = null
        expert_support_menu.style.pointerEvents = null
    }



    function navMobile() {
        group = {}
        removeMobileStyles()

        function loadContent(topMenus) {
            /* Menus loaded in the DOM currently */
            const menus = Array.from(topMenus)

            let i = menus.length
            if (COUNT === 4)
                return

            while (i--) {
                const menu = menus[i]
                const step = Number(menu.dataset.step)
                const title = menu.className
                    .replace(/-/g, ' ').trim()
                const prevTitle = step > 1 ? menu.parentNode.parentNode.className
                    .replace(/-/g, ' ').trim() : 'all'

                group[menu.className] = {
                    title: title,
                    menu: menu,
                    prev: prevTitle,
                    parent: document.querySelector('[data-step="0"]')
                }

                if (i === 0) {
                    COUNT++
                    loadContent(Array.from(document.querySelectorAll('[data-step="' + COUNT + '"]')))
                }
            }
        }
        loadContent(Array.from(document.querySelectorAll('[data-step="1"]')))
    }


    const updateNavHeight = (currentNav) => {
        const icon_group_height = 150
        const { top, height } = currentNav.getBoundingClientRect()
        const totalHeight = top + height + icon_group_height

        if (window.innerHeight < totalHeight) {
            icon_group.style.transform = 'translateY(' + (top + height) + 'px)'
        } else
            icon_group.style.transform = null
    }
    updateNavHeight(top_menu)

    function openMobileNav(elObj) {
        const { title, menu, parent, prev } = elObj

        back_button_content.textContent = prev
        // menu_title.textContent = prev == 'all' ? title : prev
        menu_title.textContent = prev
        const collection = '/collections/' + title.replace(/\s/, '-');

        const x = isRight ? START_DIST + 100 : START_DIST - 100


        if (!STEP) {
            updateNavHeight(isRight ? parent : menu)
            // parent.style.transform = 'translate(' + x + '%)'    TEMPORARY HIDE FOR SEARCH, TOTALLY REMOVE IS SEARCH WORKS PERFECT
            parent.style.transform = isRight ? null : 'translate(' + x + '%)' 
            parent.style.opacity = isRight ? 1 : 0
            menu.style.transform = 'translate(' + x + '%)'
            menu.style.opacity = isRight ? 0 : 1
            menu.style.pointerEvents = 'auto'
            menu_content.style.transform = 'translate(' + x + '%)'
            menu_content.style.opacity = isRight ? 0 : 1
        } else {
            updateNavHeight(menu)
            isRight ? PREV_MENU.style.pointerEvents = 'none' : menu.style.pointerEvents = 'auto'
            group[PARENT_ID].menu.style.transform = 'translate(' + x + '%)'
            isRight ? PREV_MENU.style.opacity = 0 : menu.style.opacity = 1
        }

        if (isRight) {
            PREV_MENU = menu
            START_DIST = x
            STEP--
            return
        }
        if (STEP === 0) PREV_ELEMENTS = []

        START_DIST = x
        PREV_ELEMENTS.push(elObj)
        PREV_MENU = menu
    }

    function initMobileMenu(target) {
        /* li element only */
        if (target.id) {
            isRight = false
            const el_data = group[target.id]

            if (el_data) {
                STEP = Number(target.parentNode.dataset.step)
                if (STEP === 0) PARENT_ID = target.id
                openMobileNav(el_data)
            }
            return;
        }

        /* Back button only */
        isRight = true
        const previousStep = STEP ? STEP - 1 : STEP
        openMobileNav(PREV_ELEMENTS[previousStep])
    }

    // Removes styles before and after close ****
    function removeMobileStyles() {
        PREV_ELEMENTS && PREV_ELEMENTS.forEach(prev => {
            prev.menu.removeAttribute('style')
        })

        // Remove search & bring back menu 
        mobile_predective_search.classList.remove('show-search-mobile');
        mobile_results_filter.classList.remove('show-search-mobile');
        top_menu.classList.remove('hide-nav-mobile');
      

        PREV_ELEMENTS = []
        COUNT = 1
        START_DIST = 0
        STEP = 0
        PREV_MENU = undefined
        nav.style.transform = null;
        document.body.style = null
        icon_group.style.transform = null
        top_menu.style.transform = null
        top_menu.style.opacity = null
        underlay.style.pointerEvents = 'none'
        menu_content.removeAttribute('style')
        nav.style.boxShadow = null
    }


    function navDesktop() {
        resetDesktopStyles()
        /* Positions menus on page load to current top bar items */
        /* Orginizes / groups menus to be used during transitions */
        function posMenus(el) {
            /* Menus loaded in the DOM */
            group = {}
            const menus = Array.from(el)
            let m = menus.length
            while (m--) group[menus[m].className] = []
            
            
            const stepOne = Array.from(document.querySelectorAll('[data-step="1"]'))

            stepOne.map((parent, i) => {

                group[parent.className] = [parent]
                const parentWidth = parent.getBoundingClientRect().width
                Array.from(parent.querySelectorAll('[data-step="2"]')).map((child, j) => {

                    const childWidth = child.getBoundingClientRect().width
                    group[child.className] = [parent, child]
                    child.style.left = parentWidth + 'px'
                    Array.from(child.querySelectorAll('[data-step="3"]')).map((grandChild, k) => {

                        group[grandChild.className] = [parent, child, grandChild]
                        grandChild.style.left = childWidth + 'px'
                    })
                })
            })
        }
        posMenus(document.querySelectorAll('.header__menus > ul'))
    }

    /* Returns Height, total Width, and x menu sizes */
    function getUpdatePos(navID, newStep, TOP_NAV_ID) {

        const nodeList = group[navID]

        /* Nav menu to show next */
        const x = document.getElementById(TOP_NAV_ID).getBoundingClientRect().x

        return nodeList.reduce((prev, current, index) => {
            // Current width & heights of nav children
            if (index <= newStep) {
                const { width, height } = current.getBoundingClientRect()

                prev.height < height ? prev.height = height : prev.height
                prev.totalWidth += width
            } else
                prev.remove.push(current)

            return prev
        }, { height: 0, totalWidth: 0, x, remove: [] })
    }

    function initNav(navID, newStep) {
        menu_wrapper.style.pointerEvents = 'auto'
        const newNav = document.getElementsByClassName(navID)[0]

        /* Target Hover doesn't have a menu to open */
        if (!newNav) {
            if (newStep === 0)
                return resetDesktopStyles()

            if (newStep > CURRENT_STEP || isNaN(newStep))
                return;

            newStep--
            return closeCurrent(CURRENT_NAV_ID, newStep, TOP_NAV_ID, navID)
        }

        /* Hovered over same Nav item */
        if (CURRENT_NAV_ID === navID && CURRENT_STEP === newStep) return;

        if (newStep > CURRENT_STEP || !CURRENT_NAV_ID) {
            TOP_NAV_ID = !CURRENT_NAV_ID ? navID : TOP_NAV_ID

            return openAndClose(navID, newStep, TOP_NAV_ID, newNav, false)
        }

        /* Top Nav Bar hovered only */
        if (newStep === 0 && TOP_NAV_ID !== navID) {
            const currentOpenNav = group[CURRENT_NAV_ID]
            TOP_NAV_ID = navID
            return openAndClose(navID, newStep, TOP_NAV_ID, newNav, currentOpenNav)
        }

        if (navID != CURRENT_NAV_ID) {
            const currentOpenNav = group[CURRENT_NAV_ID].slice(1)
            openAndClose(navID, newStep, TOP_NAV_ID, newNav, currentOpenNav)
        }
    }

    function openAndClose(navID, newStep, TOP_NAV_ID, newNav, currentOpenNav) {
        const { height, totalWidth, x } = getUpdatePos(navID, newStep, TOP_NAV_ID)

        const isRightDirection = x > CURRENT_X

        if (currentOpenNav) {
            currentOpenNav.forEach(current => {
                current.style.opacity = 0
                current.style.pointerEvents = 'none'
                current.style.transform = 'translateX(-25px)'
            })
        }
        newNav.style.pointerEvents = 'auto'
        newNav.style.opacity = 1
        newNav.style.transform = 'translateX(0px)'

        menu_wrapper.style.opacity = 1
        menu_wrapper.style.width = totalWidth + 'px'
        menu_wrapper.style.height = height + 'px'
        menu_wrapper.style.transform = 'translateX(' + x + 'px)'
        nav_arrow.style.transform = 'translateX(' + x + 'px) rotate(45deg)'
        nav_arrow.style.opacity = 1
        CURRENT_STEP = newStep
        CURRENT_NAV_ID = navID
        CURRENT_X = x
    }

    function closeCurrent(CURRENT_NAV_ID, newStep, TOP_NAV_ID, navID) {
        const { height, totalWidth, x, remove } = getUpdatePos(CURRENT_NAV_ID, newStep, TOP_NAV_ID)

        remove.forEach(current => {
            current.style.opacity = 0
            current.style.pointerEvents = 'none'
            current.style.transform = null
        })

        menu_wrapper.style.width = totalWidth + 'px'
        menu_wrapper.style.height = height + 'px'

        CURRENT_STEP = newStep
        CURRENT_NAV_ID = navID
        CURRENT_X = x
    }

    function resetDesktopStyles() {
        let i = allNavs.length

        const offSetMenu = allNavs[0].getBoundingClientRect().x - 55
        menu_wrapper.style.opacity = 0
        menu_wrapper.style.transform = 'translateX(' + offSetMenu + 'px)'
        menu_wrapper.style.pointerEvents = null
        nav_arrow.style.transform = null
        nav_arrow.style.opacity = null


        while (i--) {
            allNavs[i].style.opacity = '0'
            allNavs[i].style.pointerEvents = 'none'
            allNavs[i].style.transform = null
        }
        CURRENT_STEP = undefined
        CURRENT_NAV_ID = undefined
        TOP_NAV_ID = undefined
        isRightDirection = undefined
        CURRENT_X = undefined
        underlay.style.pointerEvents = null
    }

    function initNavDesktop(e) {
        const target = e.target
        if (target.tagName === 'LI') {
            const navID = target.id

            const newStep = Number(target.parentElement.dataset.step)
            initNav(navID, newStep)

            /* Moused out of Menus - add original start styles */
            if (underlay.style.pointerEvents === '') {
                underlay.style.pointerEvents = 'auto'
                underlay.addEventListener("mouseenter", resetDesktopStyles)
            }
        }
    }
}


/* Clicks to new page */
function clickNewPage() {
    document.querySelectorAll('.mobile__menu-title, .header__navigation li[data-url], li[data-url-desk]').forEach(item => {
        item.onclick = function (e) {
            const dataset = e.target.dataset
            if (window.innerWidth < 768) {
                if (dataset['url']) window.location.replace(e.target.dataset.url)
                return;
            }
            /* Clicked from screens bigger than 768 */
            if (dataset['urlDesk'] || dataset['url']) window.location.replace(Object.values(dataset)[0])
        }
    })
}



/* Top bar countdown */
function countDown() {
    const countElement = document.getElementsByClassName("header__count")[0]
    if (!countElement) return;

    const paragraphElement = countElement.parentNode

    // Get the current time from the DOM dynamically made from the liquid customizer 
    let [year, month, day, hrs] = countElement.textContent.split(':')

    // Months are the only value that is offset by 1
    month = Number(month)-1
    
    const targetDate = new Date(year, month, day, hrs).getTime()

    setInterval(() => {
        const now = new Date().getTime()
        const timeDiff = targetDate - now

        const days = Math.floor(timeDiff / (1000*60*60*24))
        const hours = Math.floor((timeDiff % (1000*60*60*24)) / (1000*60*60))
        const minutes = Math.floor((timeDiff % (1000*60*60)) / (1000*60))
        const seconds = Math.floor((timeDiff % (1000*60)) / 1000)
        
        countElement.innerHTML = `${days} DAYS ${hours} HR ${minutes} MIN ${seconds} SEC`
        paragraphElement.style.color = paragraphElement.style.color == 'white' ? 'black' : 'white'
    }, 1000)

    // when navigating back to tab. Helps from harsh DOM paintings
    // document.addEventListener("visibilitychange", event => {
    //     if (document.visibilityState === "hidden") {
    //         return clearInterval(intervalID)
    //     }

    //     productTimer(timer, countElement);
    // })
    // productTimer(millaseconds, countElement);
}


/* Top Expert Support Nav */
function supportNav() {
    const support_icon = document.querySelector('.header__support-icon')
    const underlay = document.querySelector('.nav-underlay')
    const expert_support_menu = document.querySelector('.expert-support__menu')
    const expert_support_wrapper = document.querySelector('.expert-support-wrapper')

    const remove_support_styles = function () {
        underlay.removeAttribute('style')
        expert_support_menu.removeAttribute('style')
        expert_support_wrapper.style.transform = null
        underlay.removeEventListener("mouseenter", remove_support_styles)
    }

    const initSupportNav = function (e) {
        if (underlay.style.pointerEvents === '') {
            underlay.style.pointerEvents = 'auto'
            underlay.addEventListener("mouseenter", remove_support_styles)
        }
        underlay.style.zIndex = 5
        underlay.style.pointerEvents = 'auto'
        expert_support_menu.style.transform = 'translate(0)'
        expert_support_menu.style.opacity = 1
        expert_support_menu.style.pointerEvents = 'auto'
        expert_support_wrapper.style.transform = 'translate(0)'
    }
    support_icon.addEventListener("mouseenter", initSupportNav)
}

document.addEventListener('DOMContentLoaded', () => {
    clickNewPage()
    supportNav()
    new Navigations().addEventListeners()
    countDown()
});
