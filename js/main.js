// ====== 3D Hero Fallback ======
const canvas = document.getElementById('threeCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Hero Objects
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.5,1.5,1.5),
  new THREE.MeshStandardMaterial({color:0x00ffcc, roughness:0.4, metalness:0.6})
);
cube.position.set(-1.2,0,0);
scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.8,32,32),
  new THREE.MeshStandardMaterial({color:0xff0077, roughness:0.3, metalness:0.5})
);
sphere.position.set(1.2,0,0);
scene.add(sphere);

camera.position.z = 5;

// Animate Hero Objects
function animateHero() {
  requestAnimationFrame(animateHero);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  sphere.rotation.y += 0.02;
  sphere.position.y = Math.sin(Date.now() * 0.002) * 0.5;

  renderer.render(scene, camera);
}
animateHero();

// Responsive canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ====== GSAP Animations for Hero Text ======
gsap.from('.hero-text h1', { opacity:0, y:-50, duration:1 });
gsap.from('.hero-text p', { opacity:0, y:20, delay:0.5, duration:1 });
gsap.from('.hero-text .btn', { opacity:0, y:20, delay:1, duration:1, stagger:0.2 });

// ====== Dark/Light Mode Toggle ======
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme
if(localStorage.getItem('theme') === 'dark'){
    body.classList.add('dark-mode');
}

// Toggle theme
themeToggle.addEventListener('click', ()=>{
    body.classList.toggle('dark-mode');
    if(body.classList.contains('dark-mode')){
        localStorage.setItem('theme','dark');
    } else {
        localStorage.setItem('theme','light');
    }
});

// ====== Filterable Projects ======
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        const filter = btn.dataset.filter;
        projectItems.forEach(item=>{
            if(filter==='all' || item.dataset.category===filter){
                item.style.display = 'block';
                gsap.to(item,{opacity:1,duration:0.5});
            } else {
                gsap.to(item,{opacity:0,duration:0.5,onComplete:()=>{item.style.display='none'}});
            }
        });
    });
});

// ====== Smooth Scroll for Navbar Links ======
document.querySelectorAll('.nav-link').forEach(link=>{
    link.addEventListener('click', e=>{
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ====== Animate Skill Bars on Scroll ======
const skills = document.querySelectorAll('.progress-bar');
const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            const bar = entry.target;
            gsap.to(bar, {width: bar.style.width, duration:1.5, ease:'power2.out'});
        }
    });
},{threshold:0.5});
skills.forEach(bar=>observer.observe(bar));

// ====== Contact Form Submission with Confetti Demo ======
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    // Confetti effect
    for(let i=0;i<100;i++){
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random()*100+'%';
        confetti.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`;
        document.body.appendChild(confetti);
        gsap.to(confetti, {y:window.innerHeight + 100, rotation: Math.random()*360, duration:3 + Math.random()*2, onComplete:()=>confetti.remove()});
    }
    alert("Message sent! (Demo only – integrate EmailJS or backend later)");
    contactForm.reset();
});
