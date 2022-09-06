
// const api = 'http://localhost:3005'
const api = 'https://api.makesy.com'

const mProContainer = document.querySelector('.c-mPro')
const cid = parseInt(mProContainer?.dataset?.customerId)

let customerData
// const now = new Date('June 15, 2024')
// const now = new Date('August 1, 2022')
const now = new Date()
const mProTitle = document.querySelector('.e-mProTitle')
const enthusiastTitle = document.querySelector('.e-enthusiastTitle')
const nowMonth = now.getMonth()
let daysLeft
let makesyInitDate
let makesyInitMonth
const makesyDaysLeft = (currentDate, expDate) => {
    return Math.round((expDate - currentDate) / (1000 * 60 * 60 * 24))
}
const makesyDaysElapsed = (currentDate, initDate) => {
    return Math.round((currentDate - initDate) / (1000 * 60 * 60 * 24))
}
const makesyValid = (today, start, end) => {
    return (
        isFinite(today = today.valueOf()) &&
            isFinite(start = start.valueOf()) &&
            isFinite(end = end.valueOf()) ?
            start <= today && today <= end :
            NaN
    );
}

async function userLogin() {
    await fetch(`${api}/get-customer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: cid })
    }).then(res => {
        return res.json()
    }).then(data => {
        customerData = data
        const makesyUpdatedMonth = new Date(customerData.makesy_updated).getMonth()
        // const makesyUpdated = new Date(customerData.makesy_updated)
        makesyInitDate = new Date(customerData.makesy_pro_start) // not using yet
        makesyInitDate.setHours(0, 0, 0)
        makesyInitMonth = new Date(customerData.makesy_pro_start).getMonth()
        const makesyExpDate = new Date(makesyInitDate)
        makesyExpDate.setDate(makesyInitDate.getDate() + 364)
        makesyExpDate.setHours(11, 59, 59)
        daysLeft = makesyDaysLeft(now, makesyExpDate)

        if (!makesyValid(now, makesyInitDate, makesyExpDate)) {
            makerproTags()
        } else if (makesyInitDate.getDate() !== 1 && nowMonth === makesyInitMonth && customerData.calendly === null) {
            mProTitle.style.display = 'block'
            cal()
        } else if (nowMonth !== makesyUpdatedMonth) {
            mProTitle.style.display = 'block'
            giftcard()
        } else {
            mProTitle.style.display = 'block'
            displayBenefits()
        }
    })
        .catch(err => console.log('err:', err))
}

async function makerproTags() {
    const tags = customerData.tags.split(', ')
    const updatedTags = customerData.tags.split(', ').filter(tag => tag !== 'maker_pro').join(', ')
    console.log('customerData.tags:', customerData.tags)
    console.log('cTags, newTags:', tags, updatedTags)
    await fetch(`${api}/update-tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cid: cid, updatedTags: updatedTags })
    })
        .then(res => res.json())
        .then(data => console.log(' makerproTags data:', data))
        .catch(err => console.log('err:', err))

    fetch(`${api}/update-customer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: cid, update: { tags: updatedTags } })
    }).then(res => {
        return res.json()
    })
        .catch(err => console.log('err:', err))
}

const giftcard = () => {
    fetch(`${api}/create-giftcard`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cid: cid
        })
    })
        .then(res => res.json())
        .then(data => {
            customerData.gift_card = data.gift_card
            cal()
        })
        .catch(err => console.log('err: ', err))
}

const cal = () => {
    fetch(`${api}/create-consultation`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            customerData.calendly = `${data.resource.booking_url}?background_color=f9f7f2&text_color=222222&primary_color=d58778`
            updateUser()
        })
        .catch(err => console.log('err: ', err))
}

async function updateUser() {
    fetch(`${api}/update-customer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: cid, update: { calendly: customerData.calendly, gift_card: customerData.gift_card, makesy_updated: now } })
    }).then(res => {
        displayBenefits()
        return res.json()
    })
        .catch(err => console.log('err:', err))
}

async function displayBenefits() {
    console.log('RUN displayBenefits, customerData:', customerData)
    document.querySelector('.c-mPro').style.display = 'block'
    const calWidget = document.querySelector('.e-calModal')
    calWidget.onclick = () => {
        Calendly.initPopupWidget({
            url: customerData.calendly,
            prefill: {
                name: `${customerData.first_name} ${customerData.last_name}`,
                email: customerData.email
            }
        });
        return false;
    }
    const gcValid = document.querySelector('.e-gcValid')
    const gcInvalid = document.querySelector('.e-gcInvalid')
    const gcUsed = document.querySelector('.e-gcUsed')
    const gcTitle = document.querySelector('.e-gcTitle')
    if (makesyInitDate.getDate() !== 1 && nowMonth === makesyInitMonth) {
        gcValid.style.display = 'none'
        gcInvalid.style.display = 'block'
    } else {
        const gc = await fetch(`${api}/get-giftcard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: customerData.gift_card.id })
        })
            .then(res => res.json())
            .then(data => {
                return data.gift_card
            })

        if (gc.balance > 0) { // gift card balance available
            gcValid.style.display = 'grid'
            gcInvalid.style.display = 'none'
            console.log('gc.balance > 0:', gcInvalid)
        } else if (makesyInitDate.getDate() !== 1 && nowMonth === makesyInitMonth) { // after first day of first month, no gift card
            gcValid.style.display = 'none'
            gcInvalid.style.display = 'block'
        } else { // zero gift card balance
            gcValid.style.display = 'none'
            gcUsed.style.display = 'block'
            gcTitle.textContent = 'money well spent, maker!'
        }
    }

    document.querySelector('.e-gift').addEventListener('click', () => {
        console.log('giftcard code copy:', customerData.gift_card.code)
        navigator.clipboard.writeText(customerData.gift_card.code)
        const el = document.querySelector('.e-giftCopied')
        el.classList.toggle('e-showGiftCopied')
    })

    /* Brads Updates */
    updateCart(1)
    const logOutBTN = document.querySelector('a[href^="/account/logout"]')
    logOutBTN && logOutBTN.addEventListener('click', function () {
        updateCart(0)
    });
}

/* Brads Updates */
async function updateCart(quantity) {
    try {
        await fetch('/cart/update.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({updates: {
                42123741593754: quantity,
            }})
        })
        
    } catch (error) {
        console.log('cart error:', error)
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    mProContainer !== null ? userLogin() : enthusiastTitle.style.display = 'block'
});
