let scaleFactor = 1;
let a = 5;
let n = 4; 
let useCos = true; 

function polarEquation(theta, scale) {
    let r = useCos ? a * Math.cos(n * theta) : a * Math.sin(n * theta);
    return r * scale;
}

const colorGradient = [
    "#D8BFD8", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFD700",
    "#BA55D3", "#9400D3", "#C08B5C", "#E88D67", "#D81159",
    "#1B263B", "#0D1B2A", "#415A77", "#6A0572", "#570000"
];

let colorIndex = 0;

function getNextColor() {
    let color = colorGradient[colorIndex % colorGradient.length];
    colorIndex++;
    return color;
}

function generateShapeData(scale) {
    const data = [];
    for (let i = 0; i <= 360; i += 1) {
        let theta = i * (Math.PI / 180);
        let r = polarEquation(theta, scale);
        let y = r * Math.cos(theta);
        let x = r * Math.sin(theta);
        let speedFactor = Math.abs(r - polarEquation(theta + 0.1, scale)) * 4.5;
        data.push({ x, y, speed: Math.max(3, 18 - speedFactor) });
    }
    return data;
}

const ctx = document.getElementById('polarChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'scatter',
    data: { datasets: [] },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: { display: false, min: -10, max: 10 }, 
            y: { display: false, min: -10, max: 10 }
        },
        plugins: {
            legend: { display: false }
        }
    }
});

function startAnimation() {
    let index = 0;
    let newDataset = {
        data: [],
        borderColor: getNextColor(),
        borderWidth: 2,
        showLine: true,
        pointRadius: 0
    };

    chart.data.datasets.push(newDataset);
    let shapeData = generateShapeData(scaleFactor);

    function drawStep() {
        if (index < shapeData.length) {
            newDataset.data.push({ x: shapeData[index].x, y: shapeData[index].y });
            chart.update();
            let speed = shapeData[index].speed;
            index++;
            setTimeout(drawStep, speed);
        } else {
            scaleFactor *= (Math.random() > 0.7 ? 0.95 : 1.1);
            startAnimation();
        }
    }
    drawStep();
}

startAnimation();
