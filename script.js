class WebAppOpener {
    constructor() {
        this.form = document.getElementById('openerForm');
        this.statusDiv = document.getElementById('status');
        this.statusTitle = document.getElementById('statusTitle');
        this.statusText = document.getElementById('statusText');
        this.countdown = document.getElementById('countdown');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        this.currentWindow = null;
        this.timer = null;
        this.countdownInterval = null;
        this.delayInterval = null;
        this.windowCheckInterval = null;
        this.remainingTime = 0;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.cancelBtn.addEventListener('click', () => this.cancelTimer());
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const url = formData.get('url');
        const delay = parseInt(formData.get('delay'));
        const duration = parseInt(formData.get('duration'));
        
        if (!this.validateURL(url)) {
            this.showError('Please enter a valid URL (must include http:// or https://)');
            return;
        }
        
        if (delay < 1 || delay > 300) {
            this.showError('Delay must be between 1 and 300 seconds');
            return;
        }
        
        if (duration < 1 || duration > 3600) {
            this.showError('Auto-close timer must be between 1 and 3600 seconds');
            return;
        }
        
        this.startDelayCountdown(url, delay, duration);
    }
    
    validateURL(url) {
        try {
            new URL(url);
            return url.startsWith('http://') || url.startsWith('https://');
        } catch {
            return false;
        }
    }
    
        startDelayCountdown(url, delay, duration) {
        console.log(`Starting ${delay} second countdown before opening ${url}`);
        
        // Clear any existing timers
        this.cancelTimer();
        
        // Open countdown window immediately
        try {
            const windowFeatures = 'width=1200,height=800,scrollbars=yes,resizable=yes,status=yes,toolbar=yes,menubar=yes,location=yes';
            this.currentWindow = window.open('about:blank', '_blank', windowFeatures);
            
            if (!this.currentWindow || this.currentWindow.closed) {
                this.showError('Failed to open window. Please allow popups for this site.');
                return;
            }
            
            // Create countdown page
            this.currentWindow.document.write(`
                <html>
                <head>
                    <title>Web App Opener - Countdown</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Arial, sans-serif; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white; 
                            text-align: center; 
                            padding: 50px; 
                            margin: 0;
                            height: 100vh;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        }
                        .countdown { 
                            font-size: 4rem; 
                            font-weight: bold; 
                            margin: 30px;
                            font-family: 'Courier New', monospace;
                        }
                        .message { 
                            font-size: 1.3rem; 
                            margin-bottom: 20px;
                            opacity: 0.9;
                        }
                        .url { 
                            background: rgba(255,255,255,0.2); 
                            padding: 15px 25px; 
                            border-radius: 10px; 
                            margin: 20px;
                            word-break: break-all;
                            font-size: 1.1rem;
                        }
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                        }
                    </style>
                </head>
                <body>
                    <h1>🚀 Web App Opener</h1>
                    <div class="message">Opening in:</div>
                    <div class="countdown" id="countdown">${delay}</div>
                    <div class="url">${url}</div>
                    <div class="message">Will auto-close after ${duration} seconds</div>
                    <div class="message">⚠️ Manual login required due to browser security</div>
                </body>
                </html>
            `);
            
            console.log('Countdown window opened');
            
        } catch (error) {
            console.log('Error opening countdown window:', error);
            this.showError('Error opening window: ' + error.message);
            return;
        }
        
        this.remainingTime = delay;
        this.showDelayStatus(`Countdown active - will open ${url}`, delay, duration);
        
        // Update countdown immediately
        this.updateCountdown();
        
        // Start delay countdown
        this.delayInterval = setInterval(() => {
            this.remainingTime--;
            this.updateCountdown();
            
            // Update countdown in window
            if (this.currentWindow && !this.currentWindow.closed) {
                const countdownEl = this.currentWindow.document.getElementById('countdown');
                if (countdownEl) {
                    countdownEl.textContent = this.remainingTime;
                    if (this.remainingTime <= 3) {
                        countdownEl.style.color = '#ff6b6b';
                        countdownEl.style.animation = 'pulse 1s infinite';
                    }
                }
            }
            
            if (this.remainingTime <= 0) {
                console.log('Delay finished, navigating to website');
                clearInterval(this.delayInterval);
                this.delayInterval = null;
                this.navigateToWebsite(url, duration);
            }
        }, 1000);
    }
    
    navigateToWebsite(url, duration) {
        if (!this.currentWindow || this.currentWindow.closed) {
            this.hideStatus();
            this.showError('Window was closed before navigation');
            return;
        }
        
        try {
            // Navigate to the target URL
            this.currentWindow.location.href = url;
            console.log('Navigated to:', url);
            
            // Wait for page to start loading then start auto-close timer
            setTimeout(() => {
                this.startAutoCloseTimer(duration);
            }, 1000);
            
        } catch (error) {
            console.log('Navigation error:', error);
            this.hideStatus();
            this.showError('Error navigating to website: ' + error.message);
        }
    }
    
    updateCountdown() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.countdown.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low (3 seconds for delay, 10 seconds for auto-close)
        const warningThreshold = this.delayInterval ? 3 : 10;
        if (this.remainingTime <= warningThreshold) {
            this.countdown.style.color = '#ff6b6b';
            this.countdown.style.animation = 'pulse 1s infinite';
        } else {
            this.countdown.style.color = 'white';
            this.countdown.style.animation = 'none';
        }
    }
    
    showDelayStatus(text, delay, duration) {
        this.statusTitle.textContent = 'Countdown Overlay Active';
        this.statusText.textContent = `${text} (then auto-close after ${duration}s)`;
        this.statusDiv.classList.remove('hidden');
    }
    

    
    startAutoCloseTimer(duration) {
        if (!this.currentWindow || this.currentWindow.closed) {
            console.log('Window was closed before auto-close timer could start');
            this.hideStatus();
            this.showError('Window was closed before auto-close timer could start');
            return;
        }
        
        console.log(`Starting ${duration} second auto-close timer`);
        
        try {
            // Clear any existing auto-close timers first
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            
            // Set up auto-close phase
            this.remainingTime = duration;
            this.showStatus(`Auto-close timer active - ${duration} seconds remaining`, duration);
            
            // Update countdown display immediately
            this.updateCountdown();
            
            // Start the auto-close countdown interval
            this.countdownInterval = setInterval(() => {
                this.remainingTime--;
                this.updateCountdown();
                
                console.log(`Auto-close countdown: ${this.remainingTime} seconds remaining`);
                
                if (this.remainingTime <= 0) {
                    console.log('Auto-close timer reached zero, closing window');
                    clearInterval(this.countdownInterval);
                    this.countdownInterval = null;
                    this.closeWindow();
                }
            }, 1000);
            
            // Set primary timeout to close window (backup)
            this.timer = setTimeout(() => {
                console.log('Primary auto-close timeout reached, closing window');
                this.closeWindow();
            }, duration * 1000);
            
            // Monitor window status during auto-close
            this.windowCheckInterval = setInterval(() => {
                if (this.currentWindow && this.currentWindow.closed) {
                    console.log('Window was manually closed during auto-close timer');
                    this.cancelTimer();
                    this.showError('Window was closed manually during viewing time');
                }
            }, 2000);
            
        } catch (error) {
            console.log('Error starting auto-close timer:', error);
            this.hideStatus();
            this.showError('Error starting auto-close timer: ' + error.message);
        }
    }
    

    
    updateCountdown() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.countdown.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low
        if (this.remainingTime <= 10) {
            this.countdown.style.color = '#ff6b6b';
            this.countdown.style.animation = 'pulse 1s infinite';
        } else {
            this.countdown.style.color = 'white';
            this.countdown.style.animation = 'none';
        }
    }
    
    closeWindow() {
        console.log('closeWindow() called');
        this.clearTimers();
        
        if (this.currentWindow && !this.currentWindow.closed) {
            console.log('Window exists and is open, attempting to close...');
            try {
                this.currentWindow.close();
                console.log('close() method called');
                
                // Check if the window was actually closed
                setTimeout(() => {
                    if (this.currentWindow && !this.currentWindow.closed) {
                        console.log('Window is still open after close attempt');
                        this.hideStatus();
                        this.showError('Timer completed, but browser prevented auto-close. Please close the tab manually.');
                    } else {
                        console.log('Window successfully closed');
                        this.hideStatus();
                        this.showSuccess('Timer completed! Window closed successfully.');
                    }
                }, 200);
            } catch (error) {
                console.log('Error closing window:', error);
                this.hideStatus();
                this.showError('Timer completed, but unable to close window: ' + error.message);
            }
        } else {
            console.log('Window was already closed or does not exist');
            this.hideStatus();
            this.showSuccess('Timer completed! (Window was already closed)');
        }
    }
    
    cancelTimer() {
        if (this.currentWindow && !this.currentWindow.closed) {
            try {
                this.currentWindow.close();
            } catch (error) {
                console.log('Could not close window:', error.message);
            }
        }
        
        this.clearTimers();
        this.hideStatus();
    }
    
    clearTimers() {
        console.log('Clearing all timers');
        
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        if (this.delayInterval) {
            clearInterval(this.delayInterval);
            this.delayInterval = null;
        }
        
        if (this.windowCheckInterval) {
            clearInterval(this.windowCheckInterval);
            this.windowCheckInterval = null;
        }
    }
    
    showStatus(text, duration) {
        this.statusTitle.textContent = 'Viewing Time - Auto-Close Active';
        this.statusText.textContent = text;
        this.statusDiv.classList.remove('hidden');
    }
    
    hideStatus() {
        this.statusDiv.classList.add('hidden');
    }
    
    showError(message) {
        // Create temporary error display
        this.showTemporaryMessage(message, 'error');
    }
    
    showSuccess(message) {
        // Create temporary success display
        this.showTemporaryMessage(message, 'success');
    }
    
    showTemporaryMessage(message, type) {
        // Remove any existing temporary messages
        const existing = document.querySelector('.temp-message');
        if (existing) {
            existing.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `temp-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        Object.assign(messageDiv.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '15px 25px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            animation: 'slideDown 0.3s ease-out',
            backgroundColor: type === 'error' ? '#ff6b6b' : '#51cf66',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
        });
        
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideUp 0.3s ease-in';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 4000);
    }
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @keyframes slideUp {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebAppOpener();
}); 