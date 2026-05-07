document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Scroll Logic ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Reveal & Active Links ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12 });

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.45 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    document.querySelectorAll('section').forEach(section => activeLinkObserver.observe(section));

    // --- Form Handling (Using Fetch for Node.js API) ---
    const form = document.getElementById('ecoForm');
    const successMsg = document.getElementById('successMsg');

    if (form) {
        // Activate Investor Link
        const investorLink = document.getElementById('investorLink');
        if (investorLink) {
            investorLink.addEventListener('click', (e) => {
                e.preventDefault();
                const contactSection = document.querySelector('#contact');
                contactSection.scrollIntoView({ behavior: 'smooth' });
                const interestSelect = form.querySelector('select');
                if (interestSelect) {
                    interestSelect.value = 'investor';
                }
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: form.querySelector('input[type="text"]').value,
                email: form.querySelector('input[type="email"]').value,
                organisation: form.querySelectorAll('input[type="text"]')[1].value,
                interest: form.querySelector('select').value,
                message: form.querySelector('textarea').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (result.success) {
                    form.style.display = 'none';
                    successMsg.style.display = 'block';
                }
            } catch (err) {
                console.error('Error submitting form:', err);
                alert('There was an error sending your message. Please try again.');
            }
        });
    }

    // --- Molecular Network Generator ---
    function generateMolecularNetwork(container) {
        if (!container) return;
        const width = 400;
        const height = 400;
        const nodeCount = 12;
        const nodes = [];

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");

        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = 80 + Math.random() * 80;
            nodes.push({
                x: width / 2 + Math.cos(angle) * radius,
                y: height / 2 + Math.sin(angle) * radius
            });
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                if (dist < 150) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", nodes[i].x);
                    line.setAttribute("y1", nodes[i].y);
                    line.setAttribute("x2", nodes[j].x);
                    line.setAttribute("y2", nodes[j].y);
                    line.setAttribute("stroke", "rgba(255, 255, 255, 0.1)");
                    line.setAttribute("stroke-width", "0.8");
                    svg.appendChild(line);
                }
            }
        }

        nodes.forEach(node => {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", node.x);
            circle.setAttribute("cy", node.y);
            circle.setAttribute("r", 4 + Math.random() * 4);
            circle.setAttribute("fill", "rgba(255, 255, 255, 0.2)");
            svg.appendChild(circle);
        });

        container.appendChild(svg);
    }

    generateMolecularNetwork(document.querySelector('.molecular-container'));
});
