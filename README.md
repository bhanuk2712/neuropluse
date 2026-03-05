# SynapseMonitor – EEG Stress Analysis Platform

SynapseMonitor is a professional, science-themed web application that simulates real-time EEG-based stress analysis using brainwave frequency bands.  
The interface is designed to resemble modern neuroscience monitoring software, with a dark, dashboard-style layout, 3D brain visualization, and live EEG-style activity views.

## Overview

SynapseMonitor demonstrates how EEG signals can be conceptually processed to estimate human stress levels using band power analysis.  
The platform focuses on realism in presentation: multi-channel EEG waveforms, frequency band metrics, a dynamic stress index, and a console-style processing log, all presented as an interactive neuroscience lab dashboard.

## Core Features

- **3D Brain Visualization**  
  A rotating 3D brain model rendered with Three.js, positioned as the central focus of the interface.  
  When the simulated system detects elevated stress (increased Beta activity relative to Alpha), the brain highlights or glows in red-tinted tones to represent heightened cortical activation.

- **Multi-Channel EEG Monitor**  
  Four simulated EEG channels labeled Fp1, Fp2, C3, and C4 are displayed as continuously scrolling waveforms, visually mimicking the behavior of clinical EEG machines.  
  The signals are animated to look like plausible EEG rhythms rather than static or purely random noise.

- **Band Power Analysis Panel**  
  A dedicated panel shows live values for the main EEG frequency bands:
  - Delta (0.5–4 Hz) – deep sleep
  - Theta (4–8 Hz) – drowsiness
  - Alpha (8–13 Hz) – relaxation
  - Beta (13–30 Hz) – alertness / stress
  - Gamma (30–45 Hz) – high-level cognition  

  These band values update dynamically during the simulation to illustrate how different rhythms contribute to the brain state.

- **Stress Detection Logic**  
  Stress is conceptually estimated using the ratio of Beta power to Alpha power.  
  When Beta power becomes dominant over Alpha, the computed stress level increases and is displayed as a percentage, along with a color-coded visual indicator (e.g., green → yellow → red) to reflect low, moderate, and high stress states.

- **System Console Panel**  
  A console-style panel prints real-time “processing” messages to simulate a scientific signal processing pipeline, including steps such as:
  - Initializing EEG system  
  - Loading dataset  
  - Applying bandpass filter (0.5–45 Hz)  
  - Computing power spectral density  
  - Extracting band powers  
  - Running stress classification model  

  This gives the impression of an active backend analysis engine, even though the platform is implemented as a front-end demonstration.

- **Interactive Controls**  
  The application includes user controls that allow viewers or judges to interact with the system:
  - **Start Live Scan** – Starts the simulated live EEG stream, updating brain activity, waveforms, and band metrics in real time.  
  - **Replay Dataset** – Plays back a pre-defined EEG-like dataset as if it were previously recorded, useful for demonstrating specific stress scenarios.  
  - **Generate Report** – Creates a downloadable report summarizing the simulated analysis, including Alpha power, Beta power, and the final stress classification.

## Intended Use

SynapseMonitor is built as a **biomedical engineering and neuroscience demonstration tool**.  
It is meant for presentations, academic projects, and portfolio showcases to illustrate how EEG-based stress analysis might look in a professional software environment.

- Not connected to real EEG hardware in this version.  
- Not a clinical or diagnostic tool.  
- All signals and outputs are simulated for educational and visualization purposes only.

## User Experience

- Dark, modern UI styled to resemble real EEG lab software and hospital monitoring dashboards.  
- Smooth animations and transitions to keep the interface visually engaging while maintaining a professional, research-grade feel.  
- Layout organized into clear regions: central 3D brain, wide EEG monitor strip, band power metrics, stress indicator, and system console.

## Deployment

SynapseMonitor is designed as a static web application and can be hosted on platforms like GitHub Pages.  
No backend server is required; all visualizations and simulations are performed in the browser using HTML, CSS, JavaScript, Three.js, and Canvas.

## Disclaimer

This project is intended **purely for educational and demonstrative purposes**.  
It does not perform real medical analysis and must not be used for clinical decision-making or health diagnostics.
