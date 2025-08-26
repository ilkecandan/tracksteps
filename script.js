let stepCount = 0;
const stepCountEl = document.getElementById('stepCount');
const addStepBtn = document.getElementById('addStep');
const stepHistory = JSON.parse(localStorage.getItem('stepHistory')) || {};

// Update today's steps
const today = new Date().toISOString().split('T')[0];

if (!stepHistory[today]) stepHistory[today] = 0;
stepCount = stepHistory[today];
updateDisplay();

// Add step button
addStepBtn.addEventListener('click', () => {
    stepCount++;
    stepHistory[today] = stepCount;
    localStorage.setItem('stepHistory', JSON.stringify(stepHistory));
    updateDisplay();
    updateChart();
});

function updateDisplay() {
    stepCountEl.textContent = stepCount;
}

// Chart.js
const ctx = document.getElementById('stepChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(stepHistory),
        datasets: [{
            label: 'Steps per Day',
            data: Object.values(stepHistory),
            backgroundColor: 'rgba(74, 144, 226, 0.7)',
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart() {
    chart.data.labels = Object.keys(stepHistory);
    chart.data.datasets[0].data = Object.values(stepHistory);
    chart.update();
}

// PWA install button
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install');
        }
        deferredPrompt = null;
    }
});
