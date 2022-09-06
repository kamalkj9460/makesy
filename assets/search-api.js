// @ts-nocheck
class PredictiveSearch extends HTMLElement {
    static desktop_predective_search = document.querySelector('.--desktop #shopify-section-predictive-search')
    static mobile_results_filter = document.querySelector('.Search__filter-mobile')
    static menuBackButtons = document.querySelectorAll('.predictive_btn-back')
    static url = 'https://cdn.shopify.com/s/files/1/0411/8246/2106/t/203/assets/makesy-logomark.svg?v=143047762468104890631647476441';
    static pageCDNs = [
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-91610841242.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-94905958554.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-94759780506.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-95990120602.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92257648794.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92273377434.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-95814123674.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-94479548570.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-93129638042.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-94522540186.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-93501522074.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-95230886042.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92514255002.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92673573018.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-94162256026.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92944531610.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-65503559834.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92695068826.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92449636506.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92156493978.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-91813314714.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-94044717210.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-93126623386.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92887515290.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-92577398938.jpg",
        "https://cdn.shopify.com/s/files/1/0411/8246/2106/files/search-results-91729232026.jpg"
    ]
    
    constructor() {
        super();

        this.form = this.getElementsByClassName('header__search-form')[0]
        this.top_menu = document.querySelector('.header__list')
        this.mega_nav = document.querySelector('.header__mega-nav')
        this.input = this.querySelector('input[type="search"]');
        this.predictiveSearch = this.querySelector('#shopify-section-predictive-search')
        this.element_types = this.querySelectorAll('.m-trending_terms, .m-trending_categories, .m-trending_products, .m-trending_articles')
        this.menuBackButton = this.predictiveSearch.querySelector('.predictive_btn-back')
        this.predictiveSearchResults = this.querySelector('#predictive-search-results .predictive_container');
        this.desktop_predective_search = this.querySelector('.--desktop #shopify-section-predictive-search')
        this.predectiveItems = {}

        // All Article Elements preloaded prior to updating articles,videos & guides 
        this.articleElements = {
            link: this.element_types[3].getElementsByTagName('a'),
            title: this.element_types[3].getElementsByClassName('article_item_title'),
            img: this.element_types[3].getElementsByTagName('img'),
            description: this.element_types[3].getElementsByClassName('article_desc'),
        }

        this.underlay = document.querySelector('.search-underlay')
        this.magnifyIconDrawer = this.getElementsByTagName('img')[0]
        this.sideNav = this.closest('.header__navigation')

        this.close = this.close.bind(this)
        this.mouseEnterClose = this.mouseEnterClose.bind(this)
        this.suggestions = this.querySelector('.m-trending_terms ul')
        this.suggestionItems = this.querySelectorAll('.m-trending_terms li')
        this.trendingElementsReplaced = false

        const perfEntries = performance.getEntriesByType("navigation");
        if(perfEntries[0].type === 'reload') this.input.value = ''

    }

    connectedCallback() {
        this.addEventListeners()
        this.sideNav && this.onMutation()
    }

    searchSeggestionSubmit(e) {
        this.input.value = e.target.textContent
        this.form.submit()
    }

    addEventListeners() {
        PredictiveSearch.menuBackButtons && PredictiveSearch.menuBackButtons.forEach(el => el.addEventListener('click', this.close));
        this.underlay.addEventListener('click', this.close)
        this.suggestions.addEventListener('click', this.searchSeggestionSubmit.bind(this))
        this.input.addEventListener('mousedown', this.onMousedown.bind(this))
        this.input.addEventListener('keydown', this.onKeydown.bind(this));
        this.input.addEventListener('input', this.debounce((event) => {
            this.onChange(event);
        }, 200).bind(this));
    }

    removeEventListeners() { }

    onMutation() {
        const that = this
        const observer = new MutationObserver(function (mutationList) {
            const navigationHasClosed = mutationList[0].oldValue
            if (navigationHasClosed) {
                that.close()
            }
        });
        observer.observe(this.sideNav, { attributeOldValue: true });
    }

    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    onKeydown(event) {
        // Prevent the cursor from moving in the input when using the up and down arrow keys
        if (
            event.code === 'ArrowUp' ||
            event.code === 'ArrowDown'
        ) {
            event.preventDefault();
        }
    }

    mouseEnterClose() {
        console.log('mouseEnterClose:')
        this.underlay.addEventListener("mouseenter", this.close)
        PredictiveSearch.desktop_predective_search.removeEventListener("mouseenter", this.mouseEnterClose)
    }

    onMousedown(e) {

        this.magnifyIconDrawer.style.display = "none"
        const { offsetHeight } = this.querySelector('#predictive-search-results .predictive_container')
        this.open(offsetHeight);

        // Only desktop predictiveSearch element adds mouseenenter listener
        if (!this.sideNav) {
            PredictiveSearch.desktop_predective_search.addEventListener("mouseenter", this.mouseEnterClose)
        }
    }

    onChange(e) {
        this.searchTerm = this.input.value.trim();
        if (!this.searchTerm) {
            return;
            return this.close();
        }

        /* If search is closed when typing it will automatically open back up */
        if (this.predictiveSearch.style.visibility === 'hidden') {
            const { offsetHeight } = this.querySelector('#predictive-search-results .predictive_container')
            this.open(offsetHeight);
        }
        this.getSearchResults(this.searchTerm);
        if (!this.trendingElementsReplaced) this.replaceTrendingElements()
    }

    async createResults(results) {
        let suggestionCount = 0
        for (const [type, typeArr] of Object.entries(results)) {

            let i = typeArr.length
            while (i--) {
                const artiLinkElement = this.articleElements.link[i]
                const artiImgElement = this.articleElements.img[i]
                const artiDescElement = this.articleElements.description[i - 1]

                // Updates search suggestions
                this.suggestionItems[suggestionCount++].textContent = typeArr[i].title

                if (type == 'products') {
                    const link = this.element_types[2].getElementsByTagName('a')
                    const priceElements = this.element_types[2].getElementsByClassName('product_item_price')
                    const titleElements = this.element_types[2].getElementsByClassName('product_item_title')
                    const imgElements = this.element_types[2].getElementsByTagName('img')

                    // Updates the products
                    link[i].href = typeArr[i].url
                    priceElements[i].textContent = '$' + typeArr[i].price + ' +'
                    titleElements[i].textContent = typeArr[i].title
                    imgElements[i].src = typeArr[i].image
                }
                else if (type == 'articles') {
                    if (i && i < 3) {
                        artiLinkElement.href = typeArr[i].url
                        if (artiImgElement) artiImgElement.src = typeArr[i].image
                        artiDescElement.textContent = typeArr[i].title
                    }
                }
                else if (type == 'pages') {
                    this.articleElements.link[3].href = typeArr[i].url
                    const pageID = new RegExp(typeArr[i].id)
                    this.articleElements.description[2].textContent = typeArr[i].title

                    if(window.innerWidth >= 768) {
                        let l = PredictiveSearch.pageCDNs.length
                        while(l--) {
                            const cdn = PredictiveSearch.pageCDNs[l]
                            // img cdn matches page id update image src with cdn
                            // cdn is not true on mobile
                            if(pageID.test(cdn)) {
                                this.articleElements.img[3].src = cdn
                                break;
                            }
                        }
                    }
                }
            }
        }
        let totalSuggestions = this.suggestionItems.length - suggestionCount;
        if(totalSuggestions) for(let i = suggestionCount; i < this.suggestionItems.length; i++) this.suggestionItems[i].textContent = ''
    }

    replaceTrendingElements() {
        this.trendingElementsReplaced = true

        for (let i = 0; i < this.element_types.length; i++) {
            const el = this.element_types[i]
            switch (el.className) {
                case 'm-trending_terms':
                case 'm-trending_terms accordian__menu_items':
                    el.style.gridArea = '1 / 1 / 3 / 2'
                    el.children[0].textContent = 'search suggestion'
                    el.children[1].style.columnCount = '1'
                    break;
                case 'm-trending_categories':
                case 'm-trending_categories accordian__menu_items':
                    el.style.display = 'none'
                    break;
                case 'm-trending_products':
                case 'm-trending_products accordian__menu_items':
                    el.children[0].textContent = 'search products'
                    break;
                case 'm-trending_articles':
                case 'm-trending_articles accordian__menu_items':
                    el.children[0].textContent = 'articles, videos & guides'
                    break;
            }
        }
        this.trendingElementsReplaced = true
    }

    getSearchResults(query) {
        const dataString = "/search/suggest.json?q=" + query + "&resources[type]=product,page,article,collection&resources[limit]=4&resources[options][unavailable_products]=last";
        fetch(dataString)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                const productSuggestions = data.resources.results;
                console.log('productSuggestions:', productSuggestions)
                //   const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;

                if (productSuggestions) {
                    this.createResults(productSuggestions)
                }
            })
            .catch((error) => {
                console.log('error:', error)
            });
    }

    open(height, width) {

        /* Desktop Search */
        if (window.innerWidth > 767) {
            this.predictiveSearch.style.visibility = 'visible';
            this.predictiveSearch.style.height = height + 40 + 'px';
            this.underlay.style.pointerEvents = 'auto'
        }
        /* Mobile Search */
        else {
            this.predictiveSearch.classList.add('show-search-mobile');
            this.mega_nav.classList.add('hide-nav-mobile');
            this.top_menu.classList.add('hide-nav-mobile');
        }
    }

    close(e) {
        this.underlay.removeEventListener("mouseenter", this.close)
        PredictiveSearch.desktop_predective_search.removeEventListener("mouseenter", this.mouseEnterClose)

        /* Pulled this outside of the else to make sure it always gets removed 
        *  due to screen resize while side nav is open the search wasn't transforming away. 
        */
        this.predictiveSearch.classList.remove('show-search-mobile');
        PredictiveSearch.mobile_results_filter.classList.remove('show-search-mobile')

        /* Desktop Search */
        if (window.innerWidth > 766 || PredictiveSearch.desktop_predective_search.style.visibility === 'visible') {
            this.underlay.style.pointerEvents = null
            PredictiveSearch.desktop_predective_search.style.height = '200px';
            this.underlay.removeEventListener("mouseenter", this.close)
            setTimeout(() => {
                PredictiveSearch.desktop_predective_search.style.visibility = 'hidden';
            }, 200)
        }
        /* Mobile Search */
        else {
            this.mega_nav.classList.remove('hide-nav-mobile');
            this.top_menu.classList.remove('hide-nav-mobile');
        }
    }
}
customElements.define('predictive-search', PredictiveSearch);
