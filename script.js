// ১. মোবাইল মেনু টগল + বাইরে ক্লিক করলে বন্ধ
const mobileMenu = document.querySelector('.mobile-menu');
const mobileNav = document.getElementById('mobileNav');

if (mobileMenu && mobileNav) {
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNav.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });

    // বাইরে ক্লিক করলে মেনু বন্ধ
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileNav.classList.remove('active');
        }
    });
}

// ২. ট্যাব সিস্টেম
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        if (targetTab) {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        }
    });
});

// ৩. ইনফিনিট স্ক্রল - ভিডিও ডুপ্লিকেট
function duplicateVideos() {
    const tracks = document.querySelectorAll('.video-track');
    tracks.forEach(track => {
        const thumbs = track.querySelectorAll('.video-thumb');
        thumbs.forEach(thumb => {
            const clone = thumb.cloneNode(true);
            track.appendChild(clone);
        });
    });
}
duplicateVideos();

// ৪. ভিডিও মডাল
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.querySelector('.close-modal');

if (modal && modalVideo) {
    document.addEventListener('click', (e) => {
        const thumb = e.target.closest('.video-thumb');
        if (thumb) {
            const videoElement = thumb.querySelector('video');
            if (videoElement) {
                // ভিডিও সোর্স সেট করা
                modalVideo.src = videoElement.dataset.video || videoElement.src;
                modal.classList.add('active');
                modalVideo.play(); // অটো প্লে
            }
        }
    });

    const stopVideo = () => {
        modal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = '';
    };

    if (closeModal) closeModal.addEventListener('click', stopVideo);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) stopVideo();
    });
}

// ৫. কাউন্টার অ্যানিমেশন
const counters = document.querySelectorAll('.count');
const speed = 200;

function animateCounter(counter) {
    const target = +counter.dataset.target;
    let count = 0;
    
    const updateCount = () => {
        const inc = target / speed;
        if (count < target) {
            count += inc;
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, 10);
        } else {
            counter.innerText = target + '+';
        }
    };
    updateCount();
}

// Intersection Observer
const aboutSection = document.getElementById('about');
if (aboutSection && counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                // একবার এনিমেশন হলে চাইলে নিচের লাইনটি দিয়ে অবজার্ভার বন্ধ করে দিতে পারেন
                // observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(aboutSection);
}

// ৬. Active ন্যাভ লিংক (সংশোধিত)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

function setActiveNav() {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 250;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        // এখানে ব্যাকটিক (`) ব্যবহার করা হয়েছে
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);
window.addEventListener('load', setActiveNav);


// ৭. কন্টাক্ট ফর্ম + কাস্টম Popup
const contactForm = document.querySelector('.contact-form');
const popup = document.getElementById('custom-popup');
const closePopup = document.getElementById('close-popup');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        let form = e.target;
        let data = new FormData(form);
        
        fetch("https://formspree.io/f/mjglvwyo", {
            method: "POST",
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                popup.style.display = 'flex'; // সুন্দর Popup দেখাও
                form.reset();
            } else {
                alert('Oops! Message failed. Try again.');
            }
        }).catch(error => {
            alert('Network Error! Check your connection.');
        });
    });
}

// Popup বন্ধ করার কোড
if (closePopup) {
    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

// বাইরে ক্লিক করলেও বন্ধ হবে
if (popup) {
    popup.addEventListener('click', (e) => {
        if(e.target === popup) {
            popup.style.display = 'none';
        }
    });
}