let eegChart, bandChart;
let eegData = [[], [], [], []];
let bandValues = [10, 15, 35, 25, 15];
let isScanning = false;
let timeStep = 0;
let sessionTime = 0;

function initEEGCharts() {
    const eegCtx = document.getElementById('eegChart').getContext('2d');
    const bandCtx = document.getElementById('bandChart').getContext('2d');

    for (let i = 0; i < 4; i++) eegData[i] = Array(100).fill(0);

    eegChart = new Chart(eegCtx, {
        type: 'line',
        data: {
            labels: Array(100).fill(''),
            datasets: [
                { label: 'CH1', data: eegData[0], borderColor: '#5e5ce6', borderWidth: 2, tension: 0.4, pointRadius: 0 },
                { label: 'CH2', data: eegData[1], borderColor: '#0071e3', borderWidth: 2, tension: 0.4, pointRadius: 0 },
                { label: 'CH3', data: eegData[2], borderColor: '#34c759', borderWidth: 2, tension: 0.4, pointRadius: 0 },
                { label: 'CH4', data: eegData[3], borderColor: '#ff9500', borderWidth: 2, tension: 0.4, pointRadius: 0 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { min: -100, max: 100, grid: { color: 'rgba(0,0,0,0.03)' } }, x: { display: false } },
            plugins: { legend: { display: false } }, animation: false
        }
    });

    bandChart = new Chart(bandCtx, {
        type: 'bar',
        data: {
            labels: ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'],
            datasets: [{
                data: bandValues,
                backgroundColor: ['#5856d6', '#0071e3', '#34c759', '#ff9500', '#ff2d55'],
                borderRadius: 12
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100, display: false }, x: { grid: { display: false } } },
            plugins: { legend: { display: false } }
        }
    });
}

function startLiveScan() {
    if (isScanning) return;
    isScanning = true;
    addConsoleLog('[SCAN] Initializing real-time neural link...');
    
    setInterval(() => {
        timeStep++;
        for (let i = 0; i < 4; i++) {
            const val = Math.sin(timeStep * 0.2 + i) * 40 + (Math.random() - 0.5) * 60;
            eegData[i].push(val); eegData[i].shift();
            eegChart.data.datasets[i].data = eegData[i];
        }
        eegChart.update('none');

        if (timeStep % 10 === 0) {
            bandValues = bandValues.map(v => Math.max(10, Math.min(60, v + (Math.random() - 0.5) * 5)));
            bandChart.data.datasets[0].data = bandValues;
            bandChart.update();
            updateStats();
        }
    }, 100);
}

function updateStats() {
    const stress = Math.round(20 + Math.random() * 40);
    const stressEl = document.getElementById('stress');
    const labelEl = document.getElementById('stressLabel');
    
    stressEl.textContent = stress + '%';
    labelEl.textContent = stress > 50 ? 'High Cognitive Load' : 'Optimal Focus';
    labelEl.style.color = stress > 50 ? '#ff3b30' : '#34c759';

    document.getElementById('heartRate').textContent = Math.round(72 + Math.random() * 4);
    document.getElementById('signalQuality').textContent = Math.round(95 + Math.random() * 5);
    
    sessionTime++;
    const m = Math.floor(sessionTime / 60).toString().padStart(2, '0');
    const s = (sessionTime % 60).toString().padStart(2, '0');
    document.getElementById('duration').textContent = `${m}:${s}`;
}

function replayDataset() {
    addConsoleLog('[REPLAY] Accessing database...');
    startLiveScan();
}
