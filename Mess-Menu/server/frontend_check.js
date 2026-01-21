// Native fetch is available in Node 18+
// Actually, node 18+ has native fetch.

async function checkFrontendAPIs() {
    try {
        const month = new Date().toISOString().slice(0, 7);
        const menuUrl = `http://localhost:5000/api/student/menu?month=${month}`;
        const foodUrl = `http://localhost:5000/api/admin/food-items`;

        console.log(`Checking Menu API: ${menuUrl}`);
        const menuRes = await fetch(menuUrl);
        if (menuRes.ok) {
            const menuData = await menuRes.json();
            console.log('Menu API Success!');
            console.log(`Menu Items Count: ${menuData.items ? menuData.items.length : 'N/A'}`);
        } else {
            console.error(`Menu API Failed: ${menuRes.status} ${menuRes.statusText}`);
            const text = await menuRes.text();
            console.error(text);
        }

        console.log(`\nChecking Food Items API: ${foodUrl}`);
        const foodRes = await fetch(foodUrl);
        if (foodRes.ok) {
            const foodData = await foodRes.json();
            console.log('Food Items API Success!');
            console.log(`Food Items Count: ${foodData.length}`);
            if (foodData.length > 0) {
                console.log(`Sample Image: ${foodData[0].image}`);
            }
        } else {
            console.error(`Food Items API Failed: ${foodRes.status} ${foodRes.statusText}`);
        }

    } catch (err) {
        console.error('Network Error:', err.message);
    }
}

checkFrontendAPIs();
