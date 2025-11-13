// LayerHub Full JSON Feature - Browser Console Test Script
// Run this in the browser console after loading the extension and test page

console.log("🧪 LAYERHUB FULL JSON MANUAL TEST SCRIPT");
console.log("========================================");

// Test 1: Push test events to dataLayer
function pushTestEvents() {
    console.log("\n📤 Pushing test events to dataLayer...");

    // Basic event
    window.dataLayer.push({
        event: 'test_full_json',
        message: 'Testing Full JSON feature',
        timestamp: Date.now(),
        boolean_test: true,
        null_test: null,
        number_test: 42
    });

    // Complex event
    window.dataLayer.push({
        event: 'complex_structure_test',
        user: {
            id: 'user123',
            profile: {
                name: 'Test User',
                preferences: {
                    theme: 'dark',
                    language: 'en'
                }
            }
        },
        products: [
            {id: 1, name: 'Product A', price: 29.99},
            {id: 2, name: 'Product B', price: 49.99}
        ],
        metadata: {
            source: 'test_script',
            version: '1.0.0',
            features: ['search', 'copy', 'syntax_highlighting']
        }
    });

    console.log("✅ Test events pushed to dataLayer");
}

// Test 2: Verify LayerHub extension is loaded
function verifyExtension() {
    console.log("\n🔍 Verifying LayerHub extension...");

    const panel = document.getElementById('lh-dl-root');
    if (panel) {
        console.log("✅ LayerHub panel found in DOM");

        const shadow = panel.shadowRoot;
        if (shadow) {
            console.log("✅ Shadow DOM accessible");

            const listPane = shadow.getElementById('lh-list');
            const detailPane = shadow.getElementById('lh-detail');

            if (listPane && detailPane) {
                console.log("✅ List and detail panes accessible");
                return true;
            } else {
                console.log("❌ List or detail pane not found");
                return false;
            }
        } else {
            console.log("❌ Shadow DOM not accessible");
            return false;
        }
    } else {
        console.log("❌ LayerHub panel not found - click extension icon first");
        return false;
    }
}

// Test 3: Manual testing checklist
function showTestChecklist() {
    console.log("\n📋 MANUAL TESTING CHECKLIST");
    console.log("============================");
    console.log("1. Click the LayerHub extension icon");
    console.log("2. Click on any event in the list");
    console.log("3. In the detail view, click the 'Full JSON' button");
    console.log("4. Verify the following:");
    console.log("   □ Layout changes to full JSON view");
    console.log("   □ Search bar appears at the top");
    console.log("   □ JSON is syntax highlighted with colors:");
    console.log("     - Purple: Property keys");
    console.log("     - Green: String values");
    console.log("     - Orange: Numbers");
    console.log("     - Blue: Boolean values");
    console.log("     - Gray: Null values and brackets");
    console.log("   □ Search functionality works:");
    console.log("     - Type in search bar");
    console.log("     - Matching text is highlighted in yellow");
    console.log("     - Syntax highlighting is preserved");
    console.log("   □ Copy button works:");
    console.log("     - Click 📋 Copy button");
    console.log("     - Button shows '✓ Copied!' feedback");
    console.log("     - JSON is copied to clipboard");
    console.log("     - Button reverts after 2 seconds");
    console.log("   □ Exit button works:");
    console.log("     - Click 'Exit Full JSON' button");
    console.log("     - Returns to normal tabbed view");
    console.log("     - Selected item is preserved");
    console.log("   □ Visual design:");
    console.log("     - Dark background (#0f172a)");
    console.log("     - Monospace font");
    console.log("     - Proper spacing and readability");
    console.log("     - Scrollable for large JSON");
}

// Test 4: Performance test with large object
function performanceTest() {
    console.log("\n⚡ Performance test with large JSON object...");

    const largeObject = {
        event: 'performance_test',
        largeArray: Array.from({length: 50}, (_, i) => ({
            id: i,
            data: `item_${i}`,
            nested: {
                level1: {level2: {level3: `deep_data_${i}`}}
            },
            timestamp: Date.now() + i
        })),
        metadata: {
            totalItems: 50,
            testType: 'performance',
            complexity: 'medium'
        }
    };

    const startTime = performance.now();
    window.dataLayer.push(largeObject);
    const endTime = performance.now();

    console.log(`✅ Large object pushed in ${(endTime - startTime).toFixed(2)}ms`);
    console.log("📊 Test this object in Full JSON mode for performance");
}

// Run all tests
function runFullTestSuite() {
    console.log("🚀 Starting LayerHub Full JSON test suite...");

    pushTestEvents();

    setTimeout(() => {
        const extensionReady = verifyExtension();
        if (extensionReady) {
            showTestChecklist();
            setTimeout(performanceTest, 1000);
        }
    }, 2000);

    console.log("\n📝 Follow the manual checklist above to complete testing");
}

// Export functions
window.LayerHubFullJsonTest = {
    pushTestEvents,
    verifyExtension,
    showTestChecklist,
    performanceTest,
    runFullTestSuite
};

// Auto-run
console.log("🔧 Test script loaded. Run LayerHubFullJsonTest.runFullTestSuite() to begin");