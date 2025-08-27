// Content script for LeetCode problem detection
class LeetCodeProblemDetector {
  constructor() {
    this.init();
  }

  init() {
    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'detectProblems') {
        this.detectProblems().then(sendResponse);
        return true; // Keep the message channel open for async response
      }
    });
  }

  async detectProblems() {
    try {
      // Try different methods to detect problems
      let problemCount = 0;

      // Method 1: Check if we're on a problem page and look for submission status
      if (this.isOnProblemPage()) {
        problemCount = await this.detectFromProblemPage();
      }
      
      // Method 2: Check profile/submissions page
      if (problemCount === 0) {
        problemCount = await this.detectFromProfilePage();
      }

      // Method 3: Check recent submissions
      if (problemCount === 0) {
        problemCount = await this.detectFromRecentSubmissions();
      }

      return {
        success: true,
        problemCount: problemCount,
        method: this.getDetectionMethod()
      };
    } catch (error) {
      console.error('Error detecting problems:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  isOnProblemPage() {
    return window.location.pathname.includes('/problems/') && 
           !window.location.pathname.includes('/submissions');
  }

  async detectFromProblemPage() {
    try {
      // Look for "Accepted" status or similar indicators
      const acceptedElements = document.querySelectorAll('[class*="accepted"], [class*="success"], [class*="green"]');
      const statusText = document.body.textContent.toLowerCase();
      
      if (statusText.includes('accepted') || statusText.includes('solved')) {
        return 1;
      }
      
      // Check for submission buttons or status indicators
      const submitButtons = document.querySelectorAll('button[data-cy="submit-code-btn"], button:contains("Submit")');
      if (submitButtons.length > 0) {
        // We're on a problem page, check if it's been solved
        return await this.checkProblemSolved();
      }
      
      return 0;
    } catch (error) {
      console.error('Error detecting from problem page:', error);
      return 0;
    }
  }

  async detectFromProfilePage() {
    try {
      // Navigate to profile/submissions if possible
      if (window.location.pathname.includes('/profile/') || 
          window.location.pathname.includes('/submissions/')) {
        
        // Look for solved problems count
        const solvedElements = document.querySelectorAll('[class*="solved"], [class*="accepted"], [class*="count"]');
        
        for (const element of solvedElements) {
          const text = element.textContent;
          const match = text.match(/(\d+)/);
          if (match) {
            return parseInt(match[1]);
          }
        }
      }
      
      return 0;
    } catch (error) {
      console.error('Error detecting from profile page:', error);
      return 0;
    }
  }

  async detectFromRecentSubmissions() {
    try {
      // Look for recent submission indicators
      const submissionElements = document.querySelectorAll('[class*="submission"], [class*="recent"]');
      
      if (submissionElements.length > 0) {
        // Count recent successful submissions
        let count = 0;
        submissionElements.forEach(element => {
          const text = element.textContent.toLowerCase();
          if (text.includes('accepted') || text.includes('solved')) {
            count++;
          }
        });
        return count;
      }
      
      return 0;
    } catch (error) {
      console.error('Error detecting from recent submissions:', error);
      return 0;
    }
  }

  async checkProblemSolved() {
    try {
      // This is a simplified check - in a real implementation, you might need to
      // check the user's submission history or use LeetCode's API
      const statusIndicators = document.querySelectorAll('[class*="status"], [class*="result"]');
      
      for (const indicator of statusIndicators) {
        const text = indicator.textContent.toLowerCase();
        if (text.includes('accepted') || text.includes('solved')) {
          return 1;
        }
      }
      
      return 0;
    } catch (error) {
      console.error('Error checking if problem solved:', error);
      return 0;
    }
  }

  getDetectionMethod() {
    if (this.isOnProblemPage()) {
      return 'problem_page';
    } else if (window.location.pathname.includes('/profile/')) {
      return 'profile_page';
    } else if (window.location.pathname.includes('/submissions/')) {
      return 'submissions_page';
    } else {
      return 'general_detection';
    }
  }
}

// Initialize the detector
new LeetCodeProblemDetector();

// Helper function to find elements containing specific text
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
} 