// Report Generation Function
function generateReport() {
    logConsole('[REPORT] Generating analysis report...');
    
    // Get current values
    const alphaPower = parseFloat(document.getElementById('alpha').textContent);
    const betaPower = parseFloat(document.getElementById('beta').textContent);
    const deltaPower = parseFloat(document.getElementById('delta').textContent);
    const thetaPower = parseFloat(document.getElementById('theta').textContent);
    const gammaPower = parseFloat(document.getElementById('gamma').textContent);
    
    // Calculate stress level
    const stressRatio = betaPower / (alphaPower + 0.001);
    const stressPercentage = Math.min(100, stressRatio * 50);
    
    // Determine status
    let status = '';
    let assessment = '';
    let recommendations = '';
    
    if (stressPercentage < 30) {
        status = 'RELAXED';
        assessment = 'Your brain activity indicates a calm and relaxed mental state. ' +
                    'Alpha activity is dominant, which is associated with relaxed alertness and focused attention.';
        recommendations = '• Continue maintaining healthy sleep habits\n' +
                         '• Engage in regular mindfulness or meditation\n' +
                         '• Keep a balanced work-life schedule';
    } else if (stressPercentage < 60) {
        status = 'MODERATE STRESS';
        assessment = 'Your EEG shows increased beta activity, indicating elevated cognitive load and attention. ' +
                    'This level is normal during focused work or problem-solving tasks.';
        recommendations = '• Take short breaks every 30-45 minutes\n' +
                         '• Practice breathing exercises (5 minutes every hour)\n' +
                         '• Ensure adequate hydration and nutrition';
    } else {
        status = 'HIGH STRESS';
        assessment = 'Significant beta dominance has been detected, suggesting high mental stress or anxiety. ' +
                    'This pattern indicates prolonged cognitive engagement without adequate breaks.';
        recommendations = '• Take an immediate 10-15 minute break\n' +
                         '• Practice deep breathing or guided meditation\n' +
                         '• Consider delegating tasks or adjusting your schedule\n' +
                         '• If stress persists, consult a healthcare professional';
    }
    
    // Create report content
    const reportDate = new Date().toLocaleString();
    const reportContent = `
╔════════════════════════════════════════════════════════════════════╗
║           SYNAPSEPRSE EEG STRESS ANALYSIS REPORT                   ║
║                    Professional Assessment                          ║
╚════════════════════════════════════════════════════════════════════╝

Report Generated: ${reportDate}

─────────────────────────────────────────────────────────────────────
1. FREQUENCY BAND ANALYSIS
─────────────────────────────────────────────────────────────────────

Delta Power (0.5-4 Hz):     ${deltaPower.toFixed(2)} µV²
  • Associated with deep sleep and recovery
  • Current Level: ${deltaPower > 15 ? 'Elevated' : 'Normal'}

Theta Power (4-8 Hz):       ${thetaPower.toFixed(2)} µV²
  • Associated with drowsiness and creativity
  • Current Level: ${thetaPower > 15 ? 'Elevated' : 'Normal'}

Alpha Power (8-13 Hz):      ${alphaPower.toFixed(2)} µV²
  • Associated with relaxation and focused attention
  • Current Level: ${alphaPower > 30 ? 'Elevated (Relaxed)' : 'Moderate'}

Beta Power (13-30 Hz):      ${betaPower.toFixed(2)} µV²
  • Associated with alertness and cognitive engagement
  • Current Level: ${betaPower > 25 ? 'Elevated' : 'Normal'}

Gamma Power (30-45 Hz):     ${gammaPower.toFixed(2)} µV²
  • Associated with high-level cognition
  • Current Level: ${gammaPower > 15 ? 'Elevated' : 'Normal'}

─────────────────────────────────────────────────────────────────────
2. STRESS LEVEL ASSESSMENT
─────────────────────────────────────────────────────────────────────

Stress Index (Beta/Alpha Ratio): ${stressRatio.toFixed(3)}
Stress Level:                     ${stressPercentage.toFixed(1)}%
Classification:                   ${status}

Interpretation:
${assessment}

─────────────────────────────────────────────────────────────────────
3. CLINICAL ASSESSMENT
─────────────────────────────────────────────────────────────────────

Mental State: ${status}
Cognitive Load: ${stressPercentage < 30 ? 'Low' : stressPercentage < 60 ? 'Moderate' : 'High'}
Recommended Action: ${stressPercentage < 30 ? 'Continue current activities' : stressPercentage < 60 ? 'Maintain awareness and take breaks' : 'Immediate stress reduction recommended'}

─────────────────────────────────────────────────────────────────────
4. RECOMMENDATIONS
─────────────────────────────────────────────────────────────────────

${recommendations}

Additional Notes:
• This assessment is based on EEG-simulated data and is for demonstration purposes only
• For clinical interpretation, please consult a qualified neuroscientist or medical professional
• Regular EEG monitoring can help track stress patterns and mental wellness trends

─────────────────────────────────────────────────────────────────────
5. FOLLOW-UP RECOMMENDATIONS
─────────────────────────────────────────────────────────────────────

• Schedule regular EEG assessments monthly to track trends
• Maintain a stress diary correlating activities with EEG results
• Implement lifestyle modifications based on this assessment
• Consider combining EEG analysis with other biometric data
• Seek professional guidance if stress levels persistently remain elevated

╔════════════════════════════════════════════════════════════════════╗
║                 End of Report                                       ║
║  Generated by SynapseMonitor EEG Analysis Platform v1.0             ║
╚════════════════════════════════════════════════════════════════════╝

DISCLAIMER: This report is generated from simulated EEG data for 
demonstration purposes only. It is NOT intended for clinical diagnosis 
or medical decision-making. Always consult qualified healthcare 
professionals for actual medical assessments.
    `;
    
    // Create downloadable file
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SynapseMonitor_Report_${new Date().toISOString().slice(0, 10)}_${new Date().getHours()}-${new Date().getMinutes()}.txt`;
    link.click();
    
    logConsole('[SUCCESS] Report generated and downloaded successfully');
    logConsole('[FILENAME] ' + link.download);
    
    // Show alert
    alert(`Report Generated Successfully!\n\n` +
          `Stress Level: ${stressPercentage.toFixed(1)}%\n` +
          `Status: ${status}\n\n` +
          `The report has been downloaded as a text file.`);
}
