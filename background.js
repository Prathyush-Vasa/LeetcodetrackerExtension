// Background service worker for LeetCode Tracker extension

// Get current week (Monday as start)
function getCurrentWeek() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate days to subtract to get to Monday
  // If today is Sunday (0), subtract 6 days to get to last Monday
  // If today is Monday (1), subtract 0 days
  // If today is Tuesday (2), subtract 1 day, etc.
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysToSubtract);
  
  // Set time to start of day to ensure consistent comparison
  startOfWeek.setHours(0, 0, 0, 0);
  
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
  chrome.storage.local.get(['currentWeek', 'weekData'], (result) => {
    const currentWeek = getCurrentWeek();
    const storedWeek = result.currentWeek;
    const storedWeekData = result.weekData;
    
    console.log('Checking week reset:', {
      storedWeek: storedWeek,
      currentWeek: currentWeek,
      needsReset: storedWeek !== currentWeek,
      hasExistingData: !!storedWeekData
    });
    
    if (storedWeek !== currentWeek) {
      // New week, but let's preserve the old data for backup
      if (storedWeekData && storedWeek) {
        console.log('Backing up previous week data:', storedWeekData);
        // Store backup of previous week
        chrome.storage.local.set({
          [`weekData_${storedWeek}`]: storedWeekData
        });
      }
      
      // Reset data for new week
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
      
      console.log('Week reset to:', currentWeek, 'Previous week was:', storedWeek);
    } else {
      console.log('Same week, no reset needed. Current week:', currentWeek);
      
      // Ensure we have valid week data
      if (!storedWeekData || Object.keys(storedWeekData).length === 0) {
        console.log('No valid week data found, initializing defaults');
        const defaultWeekData = {
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0
        };
        
        chrome.storage.local.set({
          weekData: defaultWeekData,
          currentWeek: currentWeek
        });
      }
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