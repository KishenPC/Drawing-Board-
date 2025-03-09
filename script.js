const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const toolbar = document.querySelector('.features');

let isDrawing = false;
let brushColor = '#000000';
let brushSize = 5;
let brushType = 'pencil'; // Default brush type

const resizeCanvas = () => {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    draw(e);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        draw(e);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath(); // Reset the path after drawing
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', () => {
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

const draw = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    switch (brushType) {
        case 'pencil':
            ctx.lineCap = 'round';
            ctx.lineTo(x, y);
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize;
            ctx.stroke();
            break;

        case 'marker':
            ctx.lineCap = 'square';
            ctx.lineTo(x, y);
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize * 2; // Thicker stroke
            ctx.globalAlpha = 0.7; // Slightly transparent
            ctx.stroke();
            ctx.globalAlpha = 1.0; // Reset transparency
            break;

        case 'eraser':
            ctx.lineCap = 'round';
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#ffffff'; // White color for eraser
            ctx.lineWidth = brushSize * 2; // Larger eraser
            ctx.stroke();
            break;

        case 'spray':
            const density = 50; // Number of spray dots
            for (let i = 0; i < density; i++) {
                const radius = brushSize * 2;
                const offsetX = (Math.random() - 0.5) * radius;
                const offsetY = (Math.random() - 0.5) * radius;
                ctx.fillStyle = brushColor;
                ctx.fillRect(x + offsetX, y + offsetY, 1, 1); // Small dots
            }
            break;

        case 'highlighter':
            ctx.lineCap = 'square';
            ctx.lineTo(x, y);
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize * 2;
            ctx.globalAlpha = 0.3; // Highly transparent
            ctx.stroke();
            ctx.globalAlpha = 1.0; // Reset transparency
            break;

        default:
            break;
    }
};

document.getElementById('brush-type').addEventListener('change', (e) => {
    brushType = e.target.value;
});

document.getElementById('brush-color').addEventListener('change', (e) => {
    brushColor = e.target.value;
});

document.getElementById('brush-size').addEventListener('change', (e) => {
    brushSize = e.target.value;
});

document.getElementById('clear-canvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('add-text').addEventListener('click', () => {
    const text = prompt('Enter your text:');
    if (text) {
        ctx.fillStyle = brushColor;
        ctx.font = `${brushSize * 5}px Arial`;
        ctx.fillText(text, 50, 50);
    }
});

document.getElementById('save-image').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
});

document.getElementById('share-image').addEventListener('click', () => {
    canvas.toBlob((blob) => {
        if (navigator.share) {
            navigator.share({
                title: 'My Drawing',
                files: [new File([blob], 'drawing.png', { type: 'image/png' })],
            }).catch(console.error);
        } else {
            alert('Sharing not supported in this browser.');
        }
    });
});
