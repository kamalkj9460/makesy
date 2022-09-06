// @ts-nocheck
class AccordianNav extends HTMLElement {
    constructor() {
        super();
        this.current = null
        this.oldHeight = 0
        this.openOnPageLoad = this.querySelector('.--open')
        this.h3 = this.querySelectorAll('.menu_item');
 
        if(!this.h3.length) return;
        for(let h3 of this.h3) h3.addEventListener('click', (event) => {
            this.showNav(event.target)
        });

        // Open nav on page load 
        this.openOnPageLoad && this.showNav(this.openOnPageLoad)
        this.onMutation()
    }

    onMutation() {
        const that = this
        const observer = new MutationObserver(function(mutationList) {
            const target = mutationList[0].target
            if(window.innerWidth < 767) {
                if(target.nodeName == "LI") {
                    const accordianMenuItem = target.parentNode.parentNode
                    const h3 = accordianMenuItem.children[0]
     
                    /* If menu item is open then allow the item to adjust height */
                    if (that.current === accordianMenuItem) 
                    accordianMenuItem.style.height = that.getTotalHeight(h3) + 'px'
                }
            }
        });
        observer.observe(this, {childList: true, subtree: true, characterDataOldValue: true});
    }
    

    /**
     * 
     * @param {HTMLElement} target element to open or close
     * @param {HTMLElement} current current element that is open
     * @param {Boolean} open 
     */
    rotateCross(target, current, open) {
        if(!target) return;

        if(current) {
            const currentCross = current.querySelector('.nav_state')
            currentCross.style.transform = null 
            currentCross.children[1].style.transform = null 
        } 
        const targetCross = target.querySelector('.nav_state')
        if(open) {
            targetCross.style.transform = 'rotate(180deg)';
            return targetCross.children[1].style.transform = 'translate(-50%, -50%) rotate(90deg)'
        }
        targetCross.style.transform = null
        targetCross.children[1].style.transform = null
    }

    /**
     * 
     * @param {HTMLElement} target element height to open nav to
     */
    getTotalHeight(target) {
        this.startHeight = target.getBoundingClientRect().height
        const styles = window.getComputedStyle(target.nextElementSibling)
        const margin = parseFloat(styles['marginTop']) +
                       parseFloat(styles['marginBottom']);
        return Math.ceil(target.nextElementSibling.offsetHeight + margin + this.startHeight)
    }

    /**
     * 
     * @param {HTMLElement|Boolean} target target element either clicked on to open or close or element to have automatically open on page load
     * @type {(event: Event) => void}
     */
    showNav(target=false) {

        if(!target) return;
        const totalHeight = this.getTotalHeight(target)
        const nav = target.parentNode;
        
        if(target.tagName === "H3") {
            
            // Nav open
            if(!this.current) {
                this.rotateCross(nav, false, true)
                this.current = nav
                return nav.style.height = totalHeight + 'px'

            /* Nav open
            *  Current open nav closes
            */
            } else if (!nav.style.height) {
                this.current.style = null
                nav.style.height = totalHeight + 'px'
                this.rotateCross(nav, this.current, true)
                return this.current = nav
            }
            this.current = null
            nav.style.height = null
            this.rotateCross(nav, this.current, false)
        } 
    }
}
customElements.define('accordian-nav', AccordianNav);


