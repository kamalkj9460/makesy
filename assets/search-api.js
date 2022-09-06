class PredictiveSearch extends HTMLElement {
    constructor() {
        super();

        this.input = this.querySelector('input[type="search"]');
        this.predictiveSearchResults = this.querySelector('#predictive-search-results #search-items');

        this.addEventListener('keydown', this.onKeydown.bind(this));
        this.input.addEventListener('input', this.debounce((event) => {
            this.onChange(event);
        }, 400).bind(this));
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

    onChange(e) {
        const searchTerm = this.input.value.trim();

        if (!searchTerm.length) {
            this.close();
            return;
        }
        this.getSearchResults(searchTerm);
    }

    createResults(results) {
        for(const result of results) {
            const li = document.createElement('li')
            console.log('result:', result)
           console.log( new DOMParser().parseFromString(result.body, 'text/html'))
                        // document.createTextNode()
        }
        console.log(this.predictiveSearchResults)
    }

    getSearchResults(query) {
        //   `${routes.predictive_search_url}?q=${query}&resources[type]=product&resources[limit]=4&section_id=predictive-search`
        const dataString = "/search/suggest.json?q={" + query + "}&resources[type]=product&resources[options][unavailable_products]=last"
        fetch(dataString)
            .then((response) => {
                if (!response.ok) {
                    var error = new Error(response.status);
                    console.log('error:', error)
                    this.close();
                    throw error;
                }

                return response.json();
            })
            .then((data) => {
                const productSuggestions = data.resources.results.products;

                //   console.log('data:', new DOMParser().parseFromString(text, 'text/html'))
                //   const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;

                if (productSuggestions.length > 0) {
                    this.createResults(productSuggestions)
                }
                //   this.predictiveSearchResults.innerHTML = resultsMarkup;
                this.open();
            })
            .catch((error) => {
                console.log('error:', error)
                this.close();
                throw error;
            });
    }

    open() {
        this.predictiveSearchResults.style.display = 'block';
    }

    close() {
        this.predictiveSearchResults.style.display = 'none';
    }
}
// customElements.define('predictive-search', PredictiveSearch);
