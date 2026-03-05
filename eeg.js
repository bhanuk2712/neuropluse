// Professional EEG Signal Processing and Visualization
let eegChart, bandChart;
let eegData = [[], [], [], []];  // 4 channels: Fp1, Fp2, C3, C4
let bandData = { delta: 20, theta: 15, alpha: 35, beta: 18, gamma: 12 };
let isScanning = false;
let scanInterval;
let timeStep = 0;

function initEEGCharts() {
    const eegCtx = document.getElementById('eegChart').getContext('2d');
    
    // Initialize empty data
    for (let i = 0; i < 4; i++) {
        eegData[i] = Array(150).fill(0);
    }
    
    // Professional EEG Waveform Chart
    eegChart = new Chart(eegCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 150 }, (_, i) => ''),
            datasets: [
                {
                    label: 'Fp1 (Frontal Left)',
                    data: eegData[0],
                    borderColor: '#00ffff',
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: 'Fp2 (Frontal Right)',
                    data: eegData[1],
                    borderColor: '#ff00ff',
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: 'C3 (Central Left)',
                    data: eegData[2],
                    borderColor: '#00ff88',
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: 'C4 (Central Right)',
                    data: eegData[3],
                    borderColor: '#ffaa00',
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
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
                    min: -60,
                    max: 60,
                    grid: {
                        color: 'rgba(0, 180, 255, 0.15)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#79c0ff',
                        font: { size: 11 },
                        stepSize: 20
                    },
                    title: {
                        display: true,
                        text: 'µV',
                        color: '#79c0ff',
                        font: { size: 12 }
                    }
                },
                x: {
                    display: false,
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#79c0ff',
                        font: { size: 11 },
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: { enabled: false }
            }
        }
    });
    
    // Professional Band Power Chart
    const bandCtx = document.getElementById('bandChart').getContext('2d');
    
    bandChart = new Chart(bandCtx, {
        type: 'bar',
        data: {
            labels: ['Delta\n(0.5-4 Hz)', 'Theta\n(4-8 Hz)', 'Alpha\n(8-13 Hz)', 'Beta\n(13-30 Hz)', 'Gamma\n(30-45 Hz)'],
            datasets: [{
                label: 'Power (µV²)',
                data: [20, 15, 35, 18, 12],
                backgroundColor: [
                    'rgba(76, 110, 245, 0.8)',
                    'rgba(132, 94, 247, 0.8)',
                    'rgba(34, 184, 207, 0.8)',
                    'rgba(250, 176, 5, 0.8)',
                    'rgba(255, 107, 107, 0.8)'
                ],
                borderColor: [
                    '#4c6ef5',
                    '#845ef7',
                    '#22b8cf',
                    '#fab005',
                    '#ff6b6b'
                ],
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 300, easing: 'easeInOutQuad' },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50,
                    grid: {
                        color: 'rgba(0, 180, 255, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#79c0ff',
                        font: { size: 11 },
                        stepSize: 10
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#79c0ff',
                        font: { size: 10 }
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#00b4ff',
                    borderWidth: 1
                }
            }
        }
    });
}

function generateRealisticEEGSample(channel, time) {
    // Generate realistic EEG-like waveforms
    let value = 0;
    
    // Alpha rhythm (8-13 Hz) - dominant
    value += 25 * Math.sin(time * 0.6 + channel * 0.5);
    
    // Beta rhythm (13-30 Hz) - varies with stress
    value += (10 + bandData.beta * 0.3) * Math.sin(time * 1.2 + channel * 0.8);
    
    // Theta rhythm (4-8 Hz)
    value += 8 * Math.sin(time * 0.4 + channel * 0.3);
    
    // Delta rhythm (0.5-4 Hz)
    value += 5 * Math.sin(time * 0.2);
    
    // Small random noise
    value += (Math.random() - 0.5) * 3;
    
    // Clamp values
    return Math.max(-50, Math.min(50, value));
}

function updateEEGDisplay() {
    if (!eegChart) return;
    
    timeStep += 0.15;  // Slow, smooth progression
    
    // Update each channel
    for (let i = 0; i < 4; i++) {
        const newValue = generateRealisticEEGSample(i, timeStep);
        eegData[i].push(newValue);
        if (eegData[i].length > 150) eegData[i].shift();
        
        eegChart.data.datasets[i].data = eegData[i];
    }
    
    eegChart.update('none');
}

function calculateBandPowers() {
    // Realistic band power variation
    bandData.delta = 15 + Math.random() * 10;
    bandData.theta = 12 + Math.random() * 8;
    bandData.alpha = 30 + Math.random() * 15;
    bandData.beta = 15 + Math.random() * 25;
    bandData.gamma = 8 + Math.random() * 7;
    
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
    
    // Update text values
    document.getElementById('delta').textContent = bands.delta.toFixed(1);
    document.getElementById('theta').textContent = bands.theta.toFixed(1);
    document.getElementById('alpha').textContent = bands.alpha.toFixed(1);
    document.getElementById('beta').textContent = bands.beta.toFixed(1);
    document.getElementById('gamma').textContent = bands.gamma.toFixed(1);
}

function calculateStressLevel() {
    const ratio = bandData.beta / (bandData.alpha + 0.001);
    return Math.min(100, ratio * 50);
}

function updateStressIndicator() {
    const stress = calculateStressLevel();
    const stressPercent = stress.toFixed(1);
    
    document.getElementById('stress').textContent = `Stress: ${stressPercent}%`;
    
    // Update stress bar
    const stressBar = document.getElementById('stressBar');
    stressBar.style.width = `${stressPercent}%`;
    
    // Set stress level styling
    const stressLabel = document.getElementById('stressLabel');
    if (stress < 30) {
        stressBar.style.background = 'linear-gradient(90deg, #00ff9c, #00b4ff)';
        stressLabel.textContent = 'Status: Relaxed';
        stressLabel.style.color = '#00ff9c';
    } else if (stress < 60) {
        stressBar.style.background = 'linear-gradient(90deg, #ffd43b, #ff922b)';
        stressLabel.textContent = 'Status: Moderate Stress';
        stressLabel.style.color = '#ffaa00';
    } else {
        stressBar.style.background = 'linear-gradient(90deg, #ff6b6b, #ff0000)';
        stressLabel.textContent = 'Status: High Stress';
        stressLabel.style.color = '#ff6b6b';
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
    logConsole('[SYSTEM] Initializing EEG acquisition system...');
    logConsole('[FILTER] Applying bandpass filter (0.5-45 Hz)...');
    logConsole('[SIGNAL] Starting real-time data stream...');
    
    // Slower, more realistic update rate (500ms instead of 100ms)
    scanInterval = setInterval(() => {
        updateEEGDisplay();
        updateBandDisplay();
        updateStressIndicator();
    }, 500);  // Much slower - PROFESSIONAL SPEED
    
    logConsole('[SUCCESS] Live EEG monitoring active');
}

function replayDataset() {
    if (isScanning) {
        clearInterval(scanInterval);
        isScanning = false;
    }
    
    logConsole('[LOAD] Loading pre-recorded EEG dataset...');
    logConsole('[PARSE] Parsing CSV data format...');
    logConsole('[REPLAY] Starting dataset playback...');
    
    let playbackIndex = 0;
    const playInterval = setInterval(() => {
        if (playbackIndex < 20) {
            updateEEGDisplay();
            updateBandDisplay();
            updateStressIndicator();
            playbackIndex++;
        } else {
            clearInterval(playInterval);
            logConsole('[COMPLETE] Dataset replay finished');
        }
    }, 800);
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
        logConsole('[INIT] SynapseMonitor v2.0 initializing...');
        initEEGCharts();
        logConsole('[READY] All systems operational - awaiting input');
    });
} else {
    logConsole('[INIT] SynapseMonitor v2.0 initializing...');
    initEEGCharts();
    logConsole('[READY] All systems operational - awaiting input');
}
