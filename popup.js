class LeetCodeTracker {
  constructor() {
    this.weekData = {};
    this.currentWeek = this.getCurrentWeek();
    this.init().catch(error => {
      console.error('Error initializing tracker:', error);
    });
  }

  async init() {
    await this.loadWeekData();
    this.setupEventListeners();
    this.updateDisplay();
  }

  getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday = 1
    return startOfWeek.toISOString().split('T')[0];
  }

  async loadWeekData() {
    try {
      console.log('Loading week data...');
      const result = await chrome.storage.local.get(['weekData', 'currentWeek']);
      console.log('Loaded data:', result);
      
      if (result.currentWeek !== this.currentWeek) {
        // New week, reset data
        console.log('New week detected, resetting data');
        this.weekData = this.getDefaultWeekData();
        await this.saveWeekData();
      } else {
        this.weekData = result.weekData || this.getDefaultWeekData();
        console.log('Using existing week data:', this.weekData);
      }
      
      // Ensure we have valid data
      if (!this.weekData || Object.keys(this.weekData).length === 0) {
        console.log('No valid week data found, using defaults');
        this.weekData = this.getDefaultWeekData();
        await this.saveWeekData();
      }
    } catch (error) {
      console.error('Error loading week data:', error);
      this.weekData = this.getDefaultWeekData();
    }
  }

  getDefaultWeekData() {
    return {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0
    };
  }

  async saveWeekData() {
    try {
      await chrome.storage.local.set({
        weekData: this.weekData,
        currentWeek: this.currentWeek
      });
    } catch (error) {
      console.error('Error saving week data:', error);
    }
  }

  setupEventListeners() {
    // Add button event listeners
    document.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const day = e.target.dataset.day;
        this.updateProblemCount(day, 1);
      });
    });

    // Subtract button event listeners
    document.querySelectorAll('.subtract-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const day = e.target.dataset.day;
        this.updateProblemCount(day, -1);
      });
    });

    // Reset week button
    document.getElementById('resetWeek').addEventListener('click', () => {
      this.resetWeek();
    });

    // Auto-detect button
    document.getElementById('autoDetect').addEventListener('click', () => {
      this.autoDetectProblems();
    });
    
    // Refresh data button
    document.getElementById('refreshData').addEventListener('click', () => {
      this.refreshData();
    });
  }

  async updateProblemCount(day, change) {
    const newCount = Math.max(0, this.weekData[day] + change);
    this.weekData[day] = newCount;
    
    // Update display
    this.updateDisplay();
    
    // Save to storage
    await this.saveWeekData();
    
    // Show animation
    this.showCountAnimation(day);
    
    // Show status message
    this.showStatus(`Updated ${day}: ${newCount} problems`, 'success');
  }

  showCountAnimation(day) {
    const countElement = document.getElementById(`${day}-count`);
    countElement.classList.add('updated');
    
    setTimeout(() => {
      countElement.classList.remove('updated');
    }, 300);
  }

  updateDisplay() {
    console.log('Updating display with data:', this.weekData);
    
    // Update individual day counts
    Object.keys(this.weekData).forEach(day => {
      const countElement = document.getElementById(`${day}-count`);
      if (countElement) {
        countElement.textContent = this.weekData[day];
        console.log(`Updated ${day}: ${this.weekData[day]}`);
      }
    });

    // Update total count and progress bar
    const totalProblems = Object.values(this.weekData).reduce((sum, count) => sum + count, 0);
    const currentCountElement = document.getElementById('currentCount');
    const progressFillElement = document.getElementById('progressFill');
    
    if (currentCountElement) {
      currentCountElement.textContent = totalProblems;
      console.log(`Total problems: ${totalProblems}`);
    }
    
    if (progressFillElement) {
      const progressPercentage = Math.min((totalProblems / 50) * 100, 100);
      progressFillElement.style.width = `${progressPercentage}%`;
      console.log(`Progress: ${progressPercentage}%`);
      
      // Change color based on progress
      if (progressPercentage >= 100) {
        progressFillElement.style.background = 'linear-gradient(90deg, #FFD700, #FFA500)';
      } else if (progressPercentage >= 75) {
        progressFillElement.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
      } else if (progressPercentage >= 50) {
        progressFillElement.style.background = 'linear-gradient(90deg, #FF9800, #F57C00)';
      } else {
        progressFillElement.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
      }
    }
  }

  async resetWeek() {
    if (confirm('Are you sure you want to reset this week\'s progress?')) {
      this.weekData = this.getDefaultWeekData();
      await this.saveWeekData();
      this.updateDisplay();
      this.showStatus('Week reset successfully!', 'success');
    }
  }

  async autoDetectProblems() {
    try {
      this.showStatus('Attempting to detect problems from LeetCode...', 'info');
      
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('leetcode.com')) {
        this.showStatus('Please navigate to LeetCode first!', 'error');
        return;
      }

      // Send message to content script to detect problems
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'detectProblems' });
      
      if (response && response.success) {
        const today = this.getDayOfWeek();
        this.weekData[today] = response.problemCount;
        await this.saveWeekData();
        this.updateDisplay();
        this.showStatus(`Auto-detected ${response.problemCount} problems for today!`, 'success');
      } else {
        this.showStatus('Could not auto-detect problems. Please add manually.', 'error');
      }
    } catch (error) {
      console.error('Error in auto-detect:', error);
      this.showStatus('Auto-detect failed. Please add problems manually.', 'error');
    }
  }

  getDayOfWeek() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  }

  showStatus(message, type = 'info') {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      statusElement.textContent = '';
      statusElement.className = 'status';
    }, 3000);
  }
  
  // Method to manually refresh data from storage
  async refreshData() {
    console.log('Manually refreshing data...');
    await this.loadWeekData();
    this.updateDisplay();
    this.showStatus('Data refreshed!', 'success');
  }
}

// Initialize the tracker when the popup loads
document.addEventListener('DOMContentLoaded', () => {
  new LeetCodeTracker();
}); 