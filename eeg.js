// EEG Monitoring System with Stabilized Biometrics
let eegChart1, eegChart2, eegChart3, eegChart4;
let eegData = [[], [], [], []];
let bandValues = [15, 20, 35, 25, 10]; // Initial frequency band values
let isScanning = false;
let timeStep = 0;
let sessionTime = 0;
let scanInterval;
let updateCounter = 0;
let stressLevel = 0;
let focusLevel = 0;

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

    // Initialize all four EEG charts
    eegChart1 = createChart('eegChart1', eegData[0], channelColors[0], commonOptions);
    eegChart2 = createChart('eegChart2', eegData[1], channelColors[1], commonOptions);
    eegChart3 = createChart('eegChart3', eegData[2], channelColors[2], commonOptions);
    eegChart4 = createChart('eegChart4', eegData[3], channelColors[3], commonOptions);
    
    // Display initial band values
    displayBandValues();
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
    updateCounter = 0;
    displayBandValues(); // Display initial band values immediately
    if (typeof logConsole === 'function') logConsole("[SCAN] Initializing real-time neural link...");
    
    scanInterval = setInterval(() => {
        updateEEGData();
        updateCounter++;
        
        // Update biometrics every 10 cycles (slower updates = more stable)
        if (updateCounter % 10 === 0) {
            updateBiometrics();
        }
        updateTimer();
    }, 50);
}

function updateEEGData() {
    for (let i = 0; i < 4; i++) {
        // Generate realistic EEG-like waveforms
        const newValue = Math.sin(timeStep * (i + 1) * 0.5) * 20 + (Math.random() - 0.5) * 10;
        eegData[i].push(newValue);
        eegData[i].shift();
    }
    
    // Update charts
    eegChart1?.update('none');
    eegChart2?.update('none');
    eegChart3?.update('none');
    eegChart4?.update('none');
    
    timeStep += 0.2;
}

function displayBandValues() {
    updateBandDisplay('delta', bandValues[0], 50, 'deltaBar');
    updateBandDisplay('theta', bandValues[1], 50, 'thetaBar');
    updateBandDisplay('alpha', bandValues[2], 50, 'alphaBar');
    updateBandDisplay('beta', bandValues[3], 50, 'betaBar');
    updateBandDisplay('gamma', bandValues[4], 50, 'gammaBar');
}

function updateBiometrics() {
    // Signal quality (steady around 93-99%)
    const quality = Math.floor(93 + Math.random() * 6);
    
    // Heart rate (realistic 70-95 BPM)
    const hr = Math.floor(70 + Math.random() * 25);
    
    // Slowly changing stress level (smooth transitions)
    const stressChange = (Math.random() - 0.5) * 6; // -3 to +3 per update
    stressLevel = Math.max(5, Math.min(95, stressLevel + stressChange));
    const stress = Math.floor(stressLevel);
    
    // Focus level inversely related to stress but with variation
    focusLevel = 100 - stress + (Math.random() - 0.5) * 10;
    focusLevel = Math.max(5, Math.min(95, focusLevel));
    const focus = Math.floor(focusLevel);
    
    // Update signal quality display
    const qualityEl = document.getElementById('signalQuality');
    if (qualityEl) qualityEl.textContent = quality;
    
    // Update progress circle for signal quality
    const qualityCircle = document.getElementById('qualityCircle');
    if (qualityCircle) {
        const percentage = quality;
        const circumference = Math.PI * 2 * 45;
        const offset = circumference - (percentage / 100) * circumference;
        qualityCircle.style.strokeDashoffset = offset;
    }
    
    // Update heart rate
    const heartEl = document.getElementById('heartRate');
    if (heartEl) heartEl.textContent = hr;
    
    // Update stress fill bar
    const stressFill = document.getElementById('stressFill');
    if (stressFill) stressFill.style.width = stress + '%';
    
    // Update stress text
    const stressEl = document.getElementById('stress');
    if (stressEl) stressEl.textContent = stress + '%';
    
    // Update focus fill bar
    const focusFill = document.getElementById('focusFill');
    if (focusFill) focusFill.style.width = focus + '%';
    
    // Update focus text
    const focusEl = document.getElementById('focus');
    if (focusEl) focusEl.textContent = focus + '%';
    
    // Update stress badge status
    const stressBadge = document.getElementById('stressLabel');
    if (stressBadge) {
        stressBadge.className = 'stress-badge';
        if (stress < 30) {
            stressBadge.className += ' idle';
            stressBadge.textContent = 'IDLE';
        } else if (stress < 50) {
            stressBadge.className += ' normal';
            stressBadge.textContent = 'NORMAL';
        } else if (stress < 70) {
            stressBadge.className += ' moderate';
            stressBadge.textContent = 'MODERATE';
        } else {
            stressBadge.className += ' high';
            stressBadge.textContent = 'HIGH STRESS';
        }
    }
    
    // Update frequency band values - simulate realistic EEG bands
    // Bands should be values in range 10-50
    bandValues = [
        Math.max(10, bandValues[0] + (Math.random() - 0.5) * 3),  // Delta
        Math.max(12, bandValues[1] + (Math.random() - 0.5) * 3),  // Theta
        Math.max(20, bandValues[2] + (Math.random() - 0.5) * 4),  // Alpha (usually highest)
        Math.max(15, bandValues[3] + (Math.random() - 0.5) * 3),  // Beta
        Math.max(8, bandValues[4] + (Math.random() - 0.5) * 2)    // Gamma (usually lowest)
    ];
    
    // Update band displays with proper values and bars
    displayBandValues();
    
    // Log data to console
    if (typeof logConsole === 'function') {
        logConsole(`[DATA] Stress: ${stress}% | HR: ${hr} BPM | Quality: ${quality}%`);
    }
}

function updateBandDisplay(bandId, value, maxValue, barId) {
    // Update value text
    const el = document.getElementById(bandId);
    if (el) el.textContent = value.toFixed(1);
    
    // Update progress bar
    const bar = document.getElementById(barId);
    if (bar) {
        const percentage = (value / maxValue) * 100;
        bar.style.width = percentage + '%';
        bar.setAttribute('data-value', value.toFixed(1));
    }
}

function updateTimer() {
    sessionTime++;
    const minutes = Math.floor(sessionTime / 1200); // Each cycle = 50ms, 1200 cycles = 60 seconds
    const seconds = Math.floor((sessionTime % 1200) / 20);
    const mins = minutes.toString().padStart(2, '0');
    const secs = seconds.toString().padStart(2, '0');
    const el = document.getElementById('duration');
    if (el) el.textContent = `${mins}:${secs}`;
}

function replayDataset() {
    if (typeof logConsole === 'function') logConsole("[REPLAY] Loading historical EEG dataset...");
    setTimeout(() => {
        if (typeof logConsole === 'function') logConsole("[REPLAY] Session data restored and ready to analyze.");
        if (!isScanning) startLiveScan();
    }, 1000);
}

function stopScan() {
    if (isScanning) {
        clearInterval(scanInterval);
        isScanning = false;
        if (typeof logConsole === 'function') logConsole("[SCAN] Neural link terminated. Session saved.");
    }
}
