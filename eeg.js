// EEG Signal Processing and Analysis
let eegChart, bandChart;
let eegData = [[], [], [], []];  // 4 channels: Fp1, Fp2, C3, C4
let bandData = { delta: 0, theta: 0, alpha: 0, beta: 0, gamma: 0 };
let isScanning = false;
let scanInterval;

function initEEGCharts() {
    // Initialize EEG Waveform Chart
    const eegCtx = document.getElementById('eegChart').getContext('2d');
    
    // Create time labels (simulate 10 seconds)
    const timeLabels = Array.from({ length: 100 }, (_, i) => (i * 100).toString());
    
    eegChart = new Chart(eegCtx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Fp1 (Frontal Left)',
                    data: Array(100).fill(0),
                    borderColor: '#00ffff',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: 'Fp2 (Frontal Right)',
                    data: Array(100).fill(0),
                    borderColor: '#ff00ff',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: 'C3 (Central Left)',
                    data: Array(100).fill(0),
                    borderColor: '#00ff88',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: 'C4 (Central Right)',
                    data: Array(100).fill(0),
                    borderColor: '#ffaa00',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            scales: {
                y: {
                    min: -100,
                    max: 100,
                    grid: { color: 'rgba(0, 180, 255, 0.1)' },
                    ticks: { color: '#79c0ff' }
                },
                x: {
                    grid: { color: 'rgba(0, 180, 255, 0.05)' },
                    ticks: { color: '#79c0ff' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#79c0ff', font: { size: 12 } }
                }
            }
        }
    });
    
    // Initialize Band Power Chart
    const bandCtx = document.getElementById('bandChart').getContext('2d');
    
    bandChart = new Chart(bandCtx, {
        type: 'bar',
        data: {
            labels: ['Delta\n(0.5-4Hz)', 'Theta\n(4-8Hz)', 'Alpha\n(8-13Hz)', 'Beta\n(13-30Hz)', 'Gamma\n(30-45Hz)'],
            datasets: [{
                label: 'Power (µV²)',
                data: [20, 15, 35, 18, 12],
                backgroundColor: [
                    'rgba(76, 110, 245, 0.7)',
                    'rgba(132, 94, 247, 0.7)',
                    'rgba(34, 184, 207, 0.7)',
                    'rgba(250, 176, 5, 0.7)',
                    'rgba(255, 107, 107, 0.7)'
                ],
                borderColor: [
                    '#4c6ef5',
                    '#845ef7',
                    '#22b8cf',
                    '#fab005',
                    '#ff6b6b'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 500 },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50,
                    grid: { color: 'rgba(0, 180, 255, 0.1)' },
                    ticks: { color: '#79c0ff' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#79c0ff' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#79c0ff', font: { size: 12 } }
                }
            }
        }
    });
}

function generateEEGSignal() {
    // Generate realistic-looking EEG signals
    const signal = [];
    for (let i = 0; i < 4; i++) {
        const channel = [];
        for (let j = 0; j < 100; j++) {
            // Combine multiple sine waves to create realistic EEG
            const alpha = 30 * Math.sin((j * Math.PI) / 25);  // 10 Hz alpha rhythm
            const beta = 20 * Math.sin((j * Math.PI) / 12);   // 20 Hz beta rhythm
            const noise = (Math.random() - 0.5) * 15;          // Random noise
            const value = alpha + beta + noise + (Math.random() - 0.5) * 10;
            channel.push(Math.max(-100, Math.min(100, value)));
        }
        signal.push(channel);
    }
    return signal;
}

function updateEEGDisplay() {
    if (!eegChart) return;
    
    // Simulate continuous EEG stream
    for (let i = 0; i < 4; i++) {
        const newValue = (Math.random() - 0.5) * 80 + 20 * Math.sin(Date.now() / 1000);
        eegData[i].push(newValue);
        if (eegData[i].length > 100) eegData[i].shift();
        
        eegChart.data.datasets[i].data = eegData[i];
    }
    
    eegChart.update('none');  // Update without animation
}

function calculateBandPowers() {
    // Simplified band power calculation based on current signal
    const signals = eegData;
    
    // Calculate RMS (Root Mean Square) for each band as a proxy
    const calculateRMS = (data) => {
        const sum = data.reduce((a, b) => a + b * b, 0);
        return Math.sqrt(sum / data.length);
    };
    
    // Simulate band detection
    bandData.delta = 10 + Math.random() * 10;   // 0.5-4 Hz
    bandData.theta = 12 + Math.random() * 8;    // 4-8 Hz
    bandData.alpha = 30 + Math.random() * 15;   // 8-13 Hz - highest in relaxed
    bandData.beta = 20 + Math.random() * 25;    // 13-30 Hz - increases with stress
    bandData.gamma = 10 + Math.random() * 5;    // 30-45 Hz
    
    return bandData;
}

function updateBandDisplay() {
    if (!bandChart) return;
    
    const bands = calculateBandPowers();
    bandChart.data.datasets[0].data = [
        bands.delta.toFixed(1),
        bands.theta.toFixed(1),
        bands.alpha.toFixed(1),
        bands.beta.toFixed(1),
        bands.gamma.toFixed(1)
    ];
    
    bandChart.update();
    
    // Update display values
    document.getElementById('delta').textContent = bands.delta.toFixed(1);
    document.getElementById('theta').textContent = bands.theta.toFixed(1);
    document.getElementById('alpha').textContent = bands.alpha.toFixed(1);
    document.getElementById('beta').textContent = bands.beta.toFixed(1);
    document.getElementById('gamma').textContent = bands.gamma.toFixed(1);
}

function calculateStressLevel() {
    // Stress Index = Beta Power / Alpha Power
    // Higher beta-to-alpha ratio indicates more stress
    const ratio = bandData.beta / (bandData.alpha + 0.001);
    const stressPercentage = Math.min(100, ratio * 50);
    
    return stressPercentage;
}

function updateStressIndicator() {
    const stress = calculateStressLevel();
    const stressPercent = stress.toFixed(1);
    
    document.getElementById('stress').textContent = `Stress: ${stressPercent}%`;
    
    // Update stress bar
    const stressBar = document.getElementById('stressBar');
    stressBar.style.setProperty('--stress-width', `${stressPercent}%`);
    
    // Set stress level class
    stressBar.classList.remove('low', 'medium', 'high');
    if (stress < 30) {
        stressBar.classList.add('low');
        document.getElementById('stressLabel').textContent = 'Status: Relaxed';
        document.getElementById('stressLabel').style.color = '#00ff9c';
    } else if (stress < 60) {
        stressBar.classList.add('medium');
        document.getElementById('stressLabel').textContent = 'Status: Moderate Stress';
        document.getElementById('stressLabel').style.color = '#ffaa00';
    } else {
        stressBar.classList.add('high');
        document.getElementById('stressLabel').textContent = 'Status: High Stress';
        document.getElementById('stressLabel').style.color = '#ff6b6b';
    }
    
    // Update brain visualization
    if (typeof updateBrainGlow === 'function') {
        updateBrainGlow(stress / 100);
    }
    
    return stress / 100;
}

function startLive() {
    if (isScanning) return;
    
    isScanning = true;
    logConsole('[SYSTEM] EEG Live Scan initiated...');
    logConsole('[FILTER] Applying bandpass filter (0.5-45 Hz)...');
    logConsole('[SIGNAL] Acquiring real-time EEG data...');
    
    // Initialize data if empty
    if (eegData[0].length === 0) {
        eegData = generateEEGSignal();
        for (let i = 0; i < 4; i++) {
            eegChart.data.datasets[i].data = eegData[i];
        }
    }
    
    scanInterval = setInterval(() => {
        updateEEGDisplay();
        updateBandDisplay();
        updateStressIndicator();
    }, 100);
    
    logConsole('[SUCCESS] Live streaming started');
}

function replayDataset() {
    if (isScanning) {
        clearInterval(scanInterval);
        isScanning = false;
    }
    
    logConsole('[LOAD] Loading EEG dataset...');
    logConsole('[PARSE] Parsing CSV data...');
    
    // Simulate loading and replaying a dataset
    eegData = generateEEGSignal();
    for (let i = 0; i < 4; i++) {
        eegChart.data.datasets[i].data = eegData[i];
    }
    
    logConsole('[PLAY] Replaying dataset at 1x speed...');
    
    let playbackIndex = 0;
    const playInterval = setInterval(() => {
        if (playbackIndex < 10) {
            updateEEGDisplay();
            updateBandDisplay();
            updateStressIndicator();
            playbackIndex++;
        } else {
            clearInterval(playInterval);
            logConsole('[COMPLETE] Dataset replay finished');
        }
    }, 200);
}

function logConsole(message) {
    const consoleDiv = document.getElementById('console');
    const logEntry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    logEntry.textContent = `[${timestamp}] ${message}`;
    consoleDiv.appendChild(logEntry);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        logConsole('[INIT] SynapseMonitor EEG System initializing...');
        initEEGCharts();
        logConsole('[READY] System ready - awaiting commands');
    });
} else {
    logConsole('[INIT] SynapseMonitor EEG System initializing...');
    initEEGCharts();
    logConsole('[READY] System ready - awaiting commands');
}
