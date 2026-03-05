// EEG Monitoring System with 4 Separate Channel Graphs
let eegChart1, eegChart2, eegChart3, eegChart4, bandChart;
let eegData = [[], [], [], []];
let bandValues = [10, 15, 35, 25, 15];
let isScanning = false;
let timeStep = 0;
let sessionTime = 0;
let scanInterval;

function initEEGCharts() {
    // Initialize data arrays
    for (let i = 0; i < 4; i++) {
        eegData[i] = Array(100).fill(0);
    }

    // Channel colors
    const channelColors = ['#5e5ce6', '#0071e3', '#34c759', '#ff9500'];
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: { display: false },
            y: { 
                min: -50, 
                max: 50,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#86868b', font: { size: 10 } }
            }
        },
        plugins: { legend: { display: false } },
        elements: { line: { tension: 0.4, borderWidth: 2 }, point: { radius: 0 } }
    };

    eegChart1 = createChart('eegChart1', eegData[0], channelColors[0], commonOptions);
    eegChart2 = createChart('eegChart2', eegData[1], channelColors[1], commonOptions);
    eegChart3 = createChart('eegChart3', eegData[2], channelColors[2], commonOptions);
    eegChart4 = createChart('eegChart4', eegData[3], channelColors[3], commonOptions);

    // Initialize Band Power Chart
    const ctxBand = document.getElementById('bandChart').getContext('2d');
    bandChart = new Chart(ctxBand, {
        type: 'bar',
        data: {
            labels: ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'],
            datasets: [{
                data: bandValues,
                backgroundColor: ['#5e5ce6', '#0071e3', '#34c759', '#ff9500', '#ff3b30'],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function createChart(id, data, color, options) {
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(100).fill(''),
            datasets: [{
                data: data,
                borderColor: color,
                fill: false
            }]
        },
        options: options
    });
}

function startLiveScan() {
    if (isScanning) return;
    isScanning = true;
    if (typeof logConsole === 'function') logConsole("Initializing live EEG scan...");
    
    scanInterval = setInterval(() => {
        updateEEGData();
        updateBiometrics();
        updateTimer();
    }, 100);
}

function updateEEGData() {
    for (let i = 0; i < 4; i++) {
        // Generate pseudo-random EEG-like wave
        const newValue = Math.sin(timeStep * (i + 1) * 0.5) * 20 + (Math.random() - 0.5) * 10;
        eegData[i].push(newValue);
        eegData[i].shift();
    }
    
    eegChart1.update('none');
    eegChart2.update('none');
    eegChart3.update('none');
    eegChart4.update('none');
    
    timeStep += 0.2;
}

function updateBiometrics() {
    // Simulate changing values
    const quality = Math.floor(95 + Math.random() * 5);
    const hr = Math.floor(65 + Math.random() * 15);
    const stress = Math.floor(Math.random() * 100);
    
    const elements = {
        'signalQuality': quality,
        'heartRate': hr,
        'stress': stress + '%'
    };
    
    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    }

    const stressFill = document.getElementById('stressFill');
    if (stressFill) stressFill.style.width = stress + '%';
    
    // Update frequency bands
    bandValues = bandValues.map(v => Math.max(5, v + (Math.random() - 0.5) * 5));
    if (bandChart) {
        bandChart.data.datasets[0].data = bandValues;
        bandChart.update('none');
    }
    
    // Update text values
    const bands = ['delta', 'theta', 'alpha', 'beta', 'gamma'];
    bands.forEach((b, i) => {
        const el = document.getElementById(b);
        if (el) el.textContent = bandValues[i].toFixed(1);
    });
}

function updateTimer() {
    sessionTime++;
    const mins = Math.floor(sessionTime / 600).toString().padStart(2, '0');
    const secs = Math.floor((sessionTime % 600) / 10).toString().padStart(2, '0');
    const el = document.getElementById('duration');
    if (el) el.textContent = `${mins}:${secs}`;
}

function replayDataset() {
    if (typeof logConsole === 'function') logConsole("Loading historical EEG dataset...");
    setTimeout(() => {
        if (typeof logConsole === 'function') logConsole("Replaying session data...");
        startLiveScan();
    }, 1000);
}
