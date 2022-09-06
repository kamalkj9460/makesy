{
    const getAllCookies = () => document.cookie.split(';').reduce((ac, str) => Object.assign(ac, { [str.split('=')[0].trim()]: str.split('=')[1] }), {});

    async function postCartItem(id) {
        const res = await fetch('/cart/update.js', {
            body: JSON.stringify({
                updates: {
                    [id]: 1
                }
            }),
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
            }
        })
        const data = await res.json()
        // For when App is installed and working
        // fetch('http://localhost:3005/checkout', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({token: data.token})
        //     })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log('data:', data)
        //         // console.log('data:', JSON.parse(data.split('\n')[0]))
        //         // setObj(data);
        //     })
        //     .catch(err => console.log('err: ', err))

        window.location.reload();
    }

    const MakerProShowModal = document.querySelector('.Maker-pro__show-modal')
    const AddToCartBtns = document.querySelectorAll('.e-priority-add')

    function showModal(e) {
        e.preventDefault();
        const Underlay = document.querySelector('.Maker-pro__underlay')
        const CloseBtn = document.querySelector('.Maker-pro__close-modal')
        const CloseElements = [CloseBtn, Underlay]
        const Modal = document.querySelector('.Maker-pro__modal');

        // closeModal
        [].forEach.call(CloseElements, (el) => {
            el.addEventListener('click', (e) => {
                Modal.style.transform = null
                Modal.style.opacity = null
                Underlay.style.transform = null
                Underlay.style.opacity = null
            })
        })

        Modal.style.transform = 'translate(-50%, -50%) scale(1)'
        Modal.style.opacity = 1
        Underlay.style.transform = 'scale(1)'
        Underlay.style.opacity = .7
    }

    if (MakerProShowModal) MakerProShowModal.onclick = e => showModal(e)

    AddToCartBtns.forEach(el => {
        el.onclick = e => {
            const sameDayId = 42123741593754
            const makerProMemberId = 42073291194522
            const isSameDayProcessing = e.target.className == 'e-priority-add'
            postCartItem(isSameDayProcessing ? sameDayId : makerProMemberId) // Go to product
        }
    })

    // Quoted shipping times verbage 
    window.addEventListener('load', () => {
        const p = document.createElement('p')
        p.textContent = "Quoted shipping times are not inclusive of processing time."
        p.className = "checkout_shipping-times"
        const shippingEl = document.querySelector(".edit_checkout .step__sections .section.section--shipping-method")
        shippingEl && shippingEl.appendChild(p)
    })
}
