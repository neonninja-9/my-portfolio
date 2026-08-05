/**
 * 3D Spiral Cylinder Card Carousel
 *
 * Cards wrap around a 3D cylinder. 
 * As you scroll down, the cylinder rotates and cards move up in a spiral.
 * Cards dynamically bend (curve) along the cylinder surface as they appear/disappear.
 */

// ============================================
// CARD DATA
// ============================================
const CARDS = [
    {
        image: 'images/card_image_1_1784865601368.png',
        date: '2026.01.15',
        badge: '10K+ Views',
        title: 'Neo Kyoto Nights',
        desc: 'Cyberpunk cityscape immersive experience',
        tags: ['cyberpunk', 'digital-art', 'metaverse']
    },
    {
        image: 'images/card_image_2_1784865715150.png',
        date: '2025.11.22',
        badge: 'Featured',
        title: 'Aurora Dreamscape',
        desc: 'Ethereal aurora borealis interactive installation',
        tags: ['generative-art', 'interactive', 'installation']
    },
    {
        image: 'images/card_image_3_1784866010504.png',
        date: '2025.09.08',
        badge: 'Award Winner',
        title: 'Cosmic Eden',
        desc: 'Floating island experience in virtual space',
        tags: ['fantasy', 'vr-experience', 'unreal-engine']
    },
    {
        image: 'images/card_image_4_1784866184828.png',
        date: '2025.06.14',
        badge: '',
        title: 'Abyssal Temple',
        desc: 'Underwater ancient ruins exploration',
        tags: ['adventure', 'exploration', '3d-render']
    },
    {
        image: 'images/card_image_5_1784866504400.png',
        date: '2025.03.30',
        badge: 'Trending',
        title: 'Iron Sentinel',
        desc: 'Dystopian mech warrior cinematic experience',
        tags: ['cinematic', 'mech', 'game-concept']
    },
    {
        image: 'images/card_image_6_1784866632459.png',
        date: '2024.12.01',
        badge: '',
        title: 'Enchanted Grove',
        desc: 'Magical forest twilight exploration',
        tags: ['fantasy', 'environment', 'digital-painting']
    }
];

// ============================================
// CONFIG
// ============================================
const TOTAL = CARDS.length;
const RADIUS = 850;            
const SPACING = (2 * Math.PI) / TOTAL; 
const SPIRAL_Y_FACTOR = 450;   
const LERP_FACTOR = 0.08;      
const CARD_WIDTH = 680;
const NUM_SLICES = 5; // For 3D bend effect

// ============================================
// STATE
// ============================================
let targetAngle = 0;
let currentAngle = 0;
let currentIndex = -1;
let mouseX = 0;
let mouseY = 0;

// ============================================
// DOM REFS
// ============================================
let sceneEl, cardInfoEl, dateEl, badgeEl, titleEl, descEl, tagsEl, scrollFillEl;

// ============================================
// BOOT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    sceneEl = document.getElementById('cylinderScene');
    cardInfoEl = document.getElementById('cardInfo');
    dateEl = document.getElementById('cardDate');
    badgeEl = document.getElementById('cardBadge');
    titleEl = document.getElementById('cardTitle');
    descEl = document.getElementById('cardDesc');
    tagsEl = document.getElementById('cardTags');
    scrollFillEl = document.getElementById('scrollFill');

    const scrollProxy = document.createElement('div');
    scrollProxy.className = 'scroll-proxy';
    scrollProxy.style.height = `${(TOTAL + 1) * 100}vh`;
    document.body.appendChild(scrollProxy);

    buildCards();
    listen();
    
    requestAnimationFrame(tick);
});

// ============================================
// BUILD CARD DOM (WITH SLICES FOR BENDING)
// ============================================
function buildCards() {
    CARDS.forEach((d, i) => {
        let slicesHTML = '';
        const sliceWidthPct = 100 / NUM_SLICES;
        
        for (let s = 0; s < NUM_SLICES; s++) {
            // Calculate background position to form a continuous image
            const bgPosX = s * (100 / (NUM_SLICES - 1));
            // Slight width overlap to prevent seams
            slicesHTML += `<div class="card-slice" style="
                width: ${sliceWidthPct + 0.4}%; 
                left: ${s * sliceWidthPct}%; 
                background-image: url('${d.image}');
                background-size: ${NUM_SLICES * 100}% 100%;
                background-position: ${bgPosX}% center;
            "></div>`;
        }

        const el = document.createElement('div');
        el.className = 'carousel-card';
        el.dataset.index = i;
        el.innerHTML = `
            <div class="card-inner">
                <div class="card-image-wrapper">
                    ${slicesHTML}
                </div>
            </div>`;
        sceneEl.appendChild(el);
        
        // Apply permanent 45-degree curve to match the cylinder's surface perfectly
        applyBend(el, 45);
    });
}

// ============================================
// UPDATE SCENE
// ============================================
function updateScene() {
    const cards = sceneEl.querySelectorAll('.carousel-card');
    let minDiff = Infinity;
    let closestIndex = 0;

    cards.forEach((card, i) => {
        let cardAngle = currentAngle + (i * SPACING);
        let normalizedAngle = ((cardAngle + Math.PI) % (2 * Math.PI)) - Math.PI;
        if (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;

        const x = Math.sin(normalizedAngle) * RADIUS;
        const z = Math.cos(normalizedAngle) * RADIUS - RADIUS;
        const y = normalizedAngle * SPIRAL_Y_FACTOR;
        const rotY = normalizedAngle * (180 / Math.PI);

        const depth = (Math.cos(normalizedAngle) + 1) / 2;
        const opacity = Math.max(0, depth * 1.5 - 0.5);
        const scale = 0.7 + depth * 0.3;

        card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = Math.round(depth * 100);

        const diff = Math.abs(normalizedAngle);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }

        if (diff < 0.2) {
            card.classList.add('card-active');
        } else {
            card.classList.remove('card-active');
        }
    });

    if (closestIndex !== currentIndex) {
        currentIndex = closestIndex;
        updateInfoPanel(currentIndex);
    }
}

// Applies exact mathematical bend to slices to form a cylinder arc
function applyBend(card, bendAmountDeg) {
    const slices = card.querySelectorAll('.card-slice');
    if (bendAmountDeg < 1) {
        slices.forEach(slice => slice.style.transform = 'none');
        return;
    }

    const bendRad = bendAmountDeg * (Math.PI / 180);
    const r = CARD_WIDTH / bendRad; // Radius of the card's local bend
    const sliceWidth = CARD_WIDTH / NUM_SLICES;

    slices.forEach((slice, s) => {
        // Center slice is index 0 in this math
        const sliceIndex = s - Math.floor(NUM_SLICES / 2);
        const theta = sliceIndex * (bendRad / NUM_SLICES);
        
        const x = Math.sin(theta) * r;
        const z = Math.cos(theta) * r - r;
        const rotY = theta * (180 / Math.PI);
        
        // Subtract original flat X position to pivot properly
        const originalX = sliceIndex * sliceWidth;
        const dx = x - originalX;
        
        slice.style.transform = `translateX(${dx}px) translateZ(${z}px) rotateY(${rotY}deg)`;
    });
}

// ============================================
// UPDATE INFO PANEL
// ============================================
function updateInfoPanel(idx) {
    const d = CARDS[idx];
    cardInfoEl.classList.remove('entering');
    cardInfoEl.classList.add('transitioning');

    setTimeout(() => {
        dateEl.textContent  = d.date;
        badgeEl.textContent = d.badge;
        titleEl.textContent = d.title;
        descEl.textContent  = d.desc;
        tagsEl.innerHTML    = d.tags.map(t => `<span class="tag">${t}</span>`).join('');
        
        cardInfoEl.classList.remove('transitioning');
        cardInfoEl.classList.add('entering');
    }, 300);
}

// ============================================
// ANIMATION LOOP
// ============================================
function tick() {
    const diff = targetAngle - currentAngle;
    
    if (Math.abs(diff) > 0.0001) {
        currentAngle += diff * LERP_FACTOR;
        updateScene();
    }

    sceneEl.style.transform = `rotateX(${mouseY * -3}deg) rotateY(${mouseX * 2}deg)`;
    requestAnimationFrame(tick);
}

// ============================================
// EVENT LISTENERS
// ============================================
function listen() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));
        
        scrollFillEl.style.height = `${progress * 100}%`;

        const totalAngleNeeded = (TOTAL - 1) * SPACING;
        targetAngle = -progress * totalAngleNeeded;
    });

    document.addEventListener('mousemove', e => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
}
