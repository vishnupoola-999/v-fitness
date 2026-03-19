// Main JavaScript for Interactions and Logic

// Always land on the hero/top of the page
if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu on link click
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Populate Marquee
    const marqueeContainer = document.getElementById('testimonial-marquee');
    if (marqueeContainer) {
        const reviews = [
            "Coach Samee's Recomp program changed my life! ⭐⭐⭐⭐⭐",
            "Lost 15kg in 3 months. Best online coaching. ⭐⭐⭐⭐⭐",
            "Safe space in Warangal. Love the 1 AM timings. ⭐⭐⭐⭐⭐",
            "Finally managed my PCOS weight gain thanks to Coach Samee! ⭐⭐⭐⭐⭐",
            "1100+ transformations is no joke. Real results. ⭐⭐⭐⭐⭐"
        ];
        
        let marqueeHTML = '';
        for (let i = 0; i < 3; i++) {
            reviews.forEach(review => {
                marqueeHTML += `<span class="review-item">${review}</span>`;
            });
        }
        marqueeContainer.innerHTML = marqueeHTML;
    }

    // Transformations Slider Logic
    const tSlider = document.getElementById('t-slider');
    const tFilters = document.querySelectorAll('#transformations .filter-btn');
    
    const clients = [
        { name: "Rahul D.", goal: "fat-loss", time: "12 Weeks", detail: "Weight: 95kg &rarr; 80kg. Samee's Recomp Plan." },
        { name: "Priya S.", goal: "pcod", time: "16 Weeks", detail: "PCOD Reversal & Fat Loss. Restored insulin sensitivity." },
        { name: "Arjun K.", goal: "muscle", time: "24 Weeks", detail: "Weight: 60kg &rarr; 75kg (Lean Bulk)." },
        { name: "Neha M.", goal: "fat-loss", time: "10 Weeks", detail: "Weight: 70kg &rarr; 61kg in time for her wedding." },
        { name: "Vikas T.", goal: "muscle", time: "30 Weeks", detail: "CrossFit Turf & Strength specific prep. Squat: 80kg &rarr; 140kg." }
    ];

    function renderTransformations(filterGoal = 'all') {
        if (!tSlider) return;
        tSlider.innerHTML = '';
        clients.filter(c => filterGoal === 'all' || c.goal === filterGoal).forEach((client, idx) => {
            // Using placeholder fitness transformation images from Unsplash
            const imgBase = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop";
            const imgAfter = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop";
            
            tSlider.innerHTML += `
                <div class="t-card fade-in" data-category="${client.goal}">
                    <div class="t-images">
                        <div class="img-pane before" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('${imgBase}') center/cover;">
                            <span class="label text-muted">BEFORE</span>
                        </div>
                        <div class="img-pane after" style="background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('${imgAfter}') center/cover; border-left: 2px solid var(--clr-acid-lime)">
                            <span class="label" style="color:var(--clr-acid-lime)">AFTER</span>
                        </div>
                    </div>
                    <div class="t-info">
                        <h4>${client.name}</h4>
                        <span class="t-time">${client.time}</span>
                        <p>${client.detail}</p>
                        <div class="t-badge">Coached by Samee</div>
                    </div>
                </div>
            `;
        });
    }

    if (tFilters.length) {
        tFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                tFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTransformations(btn.getAttribute('data-filter'));
            });
        });
        renderTransformations('all');
    }

    // Pricing Billing Toggle
    const pricingToggle = document.getElementById('pricing-toggle');
    const priceValues = document.querySelectorAll('.price-card .value');
    
    if (pricingToggle && priceValues.length > 0) {
        pricingToggle.addEventListener('change', (e) => {
            const isYearly = e.target.checked;
            document.getElementById('label-yearly').style.color = isYearly ? '#ccff00' : '#9aa0b1';
            document.getElementById('label-monthly').style.color = isYearly ? '#9aa0b1' : '#fff';
            
            priceValues.forEach(val => {
                val.style.opacity = '0';
                setTimeout(() => {
                    const newValue = isYearly ? val.dataset.yearly : val.dataset.monthly;
                    val.textContent = parseInt(newValue).toLocaleString('en-IN');
                    val.style.opacity = '1';
                }, 150);
            });
            
            const periods = document.querySelectorAll('.price-card .period');
            periods.forEach(p => p.textContent = isYearly ? '/yr' : '/mo');
        });
    }

    // Schedule Grid
    const scheduleContainer = document.getElementById('schedule-grid-container');
    if (scheduleContainer) {
        const days = ['Monday', 'Wednesday', 'Friday', 'Saturday'];
        let scheduleHTML = '<div class="s-timeline">';
        
        days.forEach(day => {
            scheduleHTML += `
                <div class="s-day-col">
                    <h3 class="s-day-title">${day}</h3>
                    <div class="s-class">
                        <span class="s-time text-glow">06:00 AM</span>
                        <h4>Functional Flow</h4>
                        <p>Mobility & Core</p>
                    </div>
                    <div class="s-class s-samee">
                        <span class="s-time text-glow">06:00 PM</span>
                        <h4>Samee's Recomp Group</h4>
                        <p>Strength Focus</p>
                    </div>
                    <div class="s-class s-night">
                        <span class="s-time text-glow">10:00 PM</span>
                        <h4>Late Night Grinders</h4>
                        <p>Open floor / Assisted</p>
                    </div>
                </div>
            `;
        });
        scheduleHTML += '</div>';
        scheduleContainer.innerHTML = scheduleHTML;
    }

    // Comprehensive FAQ Accordion (15 Questions Grouped)
    const faqContainer = document.getElementById('faq-container');
    const faqCatBtns = document.querySelectorAll('.faq-cat-btn');

    const faqs = [
        // Coaching / PT (Online & Offline)
        { cat: "coaching", q: "What is the 1-to-1 online training process like?", a: "Coach Samee will monitor your daily progress via an app, provide customized diet & workout plans, and handle check-ins every week to adjust macros and exercises." },
        { cat: "coaching", q: "How many check-ins do I get with Online Coaching?", a: "You get 1 dedicated weekly video/audio check-in, plus daily WhatsApp access for form correction clips." },
        { cat: "coaching", q: "Do I need prior experience to join the Recomp program?", a: "Not at all. The program is tailored to your current fitness level, whether you are a complete beginner or an advanced lifter." },
        { cat: "coaching", q: "Does Personal Training happen directly with Samee?", a: "Yes, if you sign up for PT in Warangal, Coach Samee handles your 1-on-1 sessions directly." },
        { cat: "coaching", q: "How are the diet plans structured?", a: "We don't use fad diets (Keto, extreme fasting). We use macro-tracked, flexible dieting heavily focusing on local Indian cuisine to ensure compliance." },
        
        // PCOD/PCOS 
        { cat: "pcod", q: "Do you offer specific plans for PCOS/PCOD?", a: "Yes, I specialize in PCOD/PCOS recomposition, focusing on insulin sensitivity, stress management, and low-impact strength training." },
        { cat: "pcod", q: "Will heavy lifting make my PCOS worse?", a: "No. Controlled, progressive strength training improves insulin sensitivity and hormonal balance, which directly combats PCOS symptoms." },
        { cat: "pcod", q: "How long does PCOD fat loss take?", a: "It varies, but my clients see sustainable changes within 8-12 weeks once nutrition, sleep, and progressive overload sync up." },
        
        // Gym / Facilities / Timings
        { cat: "gym", q: "Is the Warangal gym actually open till 1 AM?", a: "Yes, V-Shape Fitness Arena is fully operational till 1 AM to accommodate working professionals. It's a highly monitored and safe space." },
        { cat: "gym", q: "Is it a Unisex Gym?", a: "Yes, the gym is entirely unisex, professional, and heavily moderated for a judgment-free atmosphere." },
        { cat: "gym", q: "Is the gym LGBTQ+ friendly?", a: "100%. V-Shape Fitness Arena is a designated safe space. We enforce a zero-tolerance policy against harassment or discrimination of any kind." },
        { cat: "gym", q: "What equipment do you have?", a: "We have dedicated Strength Zones (squat racks, Smith machines, free weights), a Cardio turf, and CrossFit equipment (sleds, battle ropes)." },
        { cat: "gym", q: "Can I shower at the facility?", a: "Yes, we provide hygienic changing rooms and lockers." },
        
        // Payments & Misc
        { cat: "all", q: "Do you offer refunds?", a: "Coaching plans and memberships are non-refundable since seats are extremely limited, but you can pause a membership for medical reasons." },
        { cat: "all", q: "Is there a free trial?", a: "Yes! Book a Free Trial Session through the website, pop in, speak with the coach, and feel the vibe of the arena. No obligations." }
    ];

    function renderFAQs(filterCat = 'all') {
        if (!faqContainer) return;
        faqContainer.innerHTML = '';
        const filtered = faqs.filter(f => filterCat === 'all' || f.cat === filterCat || f.cat === 'all' && filterCat !== 'all'); // 'all' categorised questions show up everywhere
        
        filtered.forEach((faq, index) => {
            faqContainer.innerHTML += `
                <div class="faq-item fade-in">
                    <button class="faq-question">
                        ${faq.q}
                        <span class="icon">+</span>
                    </button>
                    <div class="faq-answer">
                        <p>${faq.a}</p>
                    </div>
                </div>
            `;
        });

        // Re-bind accordion events
        const faqBtns = document.querySelectorAll('.faq-question');
        faqBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const isActive = this.classList.contains('active');
                
                // Close all others
                document.querySelectorAll('.faq-question').forEach(b => {
                    b.classList.remove('active');
                    b.nextElementSibling.style.maxHeight = null;
                    b.querySelector('.icon').textContent = '+';
                });

                if (!isActive) {
                    this.classList.add('active');
                    const answer = this.nextElementSibling;
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    this.querySelector('.icon').textContent = '-';
                }
            });
        });
    }

    if (faqCatBtns.length) {
        faqCatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                faqCatBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderFAQs(btn.getAttribute('data-cat'));
            });
        });
        renderFAQs('all');
    }

    // Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeBot = document.getElementById('close-bot');
    const botInput = document.getElementById('bot-input');
    const sendBotMsg = document.getElementById('send-bot-msg');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if(chatbotToggle && chatbotContainer) {
        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.classList.toggle('active');
            if(chatbotContainer.classList.contains('active')) botInput.focus();
        });
        closeBot.addEventListener('click', () => chatbotContainer.classList.remove('active'));

        const getBotResponse = (text) => {
            const lower = text.toLowerCase();
            if (lower.includes('price') || lower.includes('cost') || lower.includes('fee') || lower.includes('plans')) {
                return "General membership is ₹1,500/mo. Hybrid coaching is ₹3,500/mo, and 1-on-1 PT is ₹8,000/mo. See the Pricing section for Yearly discounts!";
            } else if (lower.includes('time') || lower.includes('open') || lower.includes('hour')) {
                return "We are open 24/7-style until 1 AM every single day!";
            } else if (lower.includes('pcod') || lower.includes('pcos') || lower.includes('hormone')) {
                return "Coach Samee specializes in PCOD/PCOS recomposition! He focuses on insulin sensitivity, stress management, and strength training. Hit the WhatsApp button to chat with him!";
            } else if (lower.includes('location') || lower.includes('where') || lower.includes('address')) {
                return "We are located at Janpak Shaheed, Narsampet Rd, beside Bodrai, Gorrekunta Village, Warangal, TS 506002.";
            } else if (lower.includes('contact') || lower.includes('whatsapp') || lower.includes('call') || lower.includes('phone') || lower.includes('number')) {
                return "You can immediately reach Coach Samee on WhatsApp at +91 073300 60299 or DM him on Instagram @samee__fitness_coach_.";
            } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
                return "Hi there! Welcome to V-Shape Fitness Arena. How can I help you today?";
            } else {
                return "That's a great question! For detailed info, please ping Coach Samee directly on WhatsApp at +91 073300 60299. He'll be happy to answer personally!";
            }
        };

        const handleSend = () => {
            const text = botInput.value.trim();
            if(!text) return;
            
            // Add user msg
            chatbotMessages.innerHTML += `<div class="user-msg fade-in">${text}</div>`;
            botInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Simulate typing delay
            setTimeout(() => {
                const response = getBotResponse(text);
                chatbotMessages.innerHTML += `<div class="bot-msg fade-in">${response}</div>`;
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 500);
        };

        sendBotMsg.addEventListener('click', handleSend);
        botInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') handleSend();
        });
    }
    // v8labs Scroll Reveal Animation Logic
    const revealElements = document.querySelectorAll('.reveal-v8, .reveal-left-v8, .text-reveal-v8');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // If it's a staggered container, handle children
                if (entry.target.classList.contains('stagger-v8')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.15}s`;
                        child.classList.add('active');
                    });
                }
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Simple Parallax Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax-v8');
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.2;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});
