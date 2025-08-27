// Background service worker for LeetCode Tracker extension

// Get current week (Monday as start)
function getCurrentWeek() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday = 1
  return startOfWeek.toISOString().split('T')[0];
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('LeetCode Tracker extension installed');
    
    // Initialize default storage
    chrome.storage.local.set({
      weekData: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      },
      currentWeek: getCurrentWeek(),
      installDate: new Date().toISOString()
    });
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('LeetCode Tracker extension started');
  checkAndResetWeek();
});

// Handle browser startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Browser started, checking week reset');
  checkAndResetWeek();
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getWeekData') {
    chrome.storage.local.get(['weekData', 'currentWeek'], (result) => {
      sendResponse(result);
    });
    return true; // Keep message channel open
  }
  
  if (request.action === 'updateWeekData') {
    chrome.storage.local.set({
      weekData: request.weekData,
      currentWeek: request.currentWeek
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'resetWeek') {
    const newWeekData = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0
    };
    
    chrome.storage.local.set({
      weekData: newWeekData,
      currentWeek: getCurrentWeek()
    }, () => {
      sendResponse({ success: true, weekData: newWeekData });
    });
    return true;
  }
});

// Check if we need to reset the week
function checkAndResetWeek() {
  chrome.storage.local.get(['currentWeek'], (result) => {
    const currentWeek = getCurrentWeek();
    
    if (result.currentWeek !== currentWeek) {
      // New week, reset data
      const newWeekData = {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      };
      
      chrome.storage.local.set({
        weekData: newWeekData,
        currentWeek: currentWeek
      });
      
      console.log('Week reset to:', currentWeek);
    }
  });
}

// Set up periodic check for week reset (every hour)
setInterval(checkAndResetWeek, 60 * 60 * 1000);

// Handle tab updates to check if we're on LeetCode
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('leetcode.com')) {
    // We're on LeetCode, could potentially trigger some background tasks
    console.log('LeetCode tab detected:', tab.url);
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup, but we can also add additional logic here
  console.log('Extension icon clicked on tab:', tab.url);
}); 