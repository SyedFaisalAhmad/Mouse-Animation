
const canvas = document.getElementById('dragonCanvas');
const ctx = canvas.getContext('2d');

let width, height;
const mouse = { x: 0, y: 0 };
const segments = [];
const numSegments = 50; // Long, lizard-like tail
const segmentDist = 8;  // Tight vertebrae for smooth curves
let timer = 0;

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    mouse.x = width / 2;
    mouse.y = height / 2;
    segments.length = 0;
    for (let i = 0; i < numSegments; i++) {
        segments.push({ x: mouse.x, y: mouse.y, angle: 0 });
    }
}

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function update() {
    timer += 0.1;
    
    // Smooth easing for the head
    segments[0].x += (mouse.x - segments[0].x) * 0.2;
    segments[0].y += (mouse.y - segments[0].y) * 0.2;

    for (let i = 1; i < numSegments; i++) {
        const seg = segments[i];
        const prev = segments[i - 1];
        
        // Target calculation
        const dx = prev.x - seg.x;
        const dy = prev.y - seg.y;
        
        seg.angle = Math.atan2(dy, dx);
        seg.x = prev.x - Math.cos(seg.angle) * segmentDist;
        seg.y = prev.y - Math.sin(seg.angle) * segmentDist;
    }
}

function draw() {
    // White background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw from tail to head (Z-index layering)
    for (let i = numSegments - 1; i >= 0; i--) {
        const seg = segments[i];
        const taper = (numSegments - i) / numSegments; 
        
        ctx.save();
        ctx.translate(seg.x, seg.y);
        ctx.rotate(seg.angle);

        if (i === 0) {
            // --- REFINED CHAPKALI SKULL ---
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.moveTo(20, 0);       // Snout
            ctx.lineTo(8, -10);      // Eye ridge
            ctx.lineTo(2, -14);      // Back horn flare
            ctx.lineTo(-12, -10);    // Skull base
            ctx.lineTo(-16, 0);      // Neck base
            ctx.lineTo(-12, 10);     // Skull base bottom
            ctx.lineTo(2, 14);       // Back horn flare bottom
            ctx.lineTo(8, 10);       // Eye ridge bottom
            ctx.closePath();
            ctx.fill();

            // Eye holes (Transparent look)
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(6, -5, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(6, 5, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // --- FEATHERY INK STROKES ---
            // Only front-middle segments have long fins
            if (i > 4 && i < 25) {
                const finScale = Math.sin((i / 25) * Math.PI) * 50;
                ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
                ctx.lineWidth = 0.8 * taper;

                for(let j = 0; j < 3; j++) {
                    const offset = j * 5;
                    // Top Fin Sweep
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(-10, -5, -15 - offset, -finScale, -45 - offset, -finScale * 1.3);
                    ctx.stroke();
                    
                    // Bottom Fin Sweep
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(-10, 5, -15 - offset, finScale, -45 - offset, finScale * 1.3);
                    ctx.stroke();
                }
            }

            // --- SPINE / VERTEBRAE ---
            ctx.fillStyle = "black";
            ctx.beginPath();
            // Flatten the circles into ovals to look like bones
            ctx.ellipse(-2, 0, 5 * taper, 2.5 * taper, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    update();
    requestAnimationFrame(draw);
}

window.addEventListener('resize', init);
init();
draw();
