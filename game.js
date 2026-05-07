// Game State
let money = 1000;
let day = 1;
let popularity = 50; // out of 100
let inventory = {
    beans: 50,
    milk: 50,
    cups: 50
};
let coffeePrice = 5.00;

// Franchise & Stocks State
let franchises = 0;
const FRANCHISE_COST = 5000;
const FRANCHISE_DAILY_INCOME = 200;

let stocks = [
    { symbol: 'CBUX', name: 'CoffeeBucks', price: 50, owned: 0 },
    { symbol: 'BEAN', name: 'Bean Corp', price: 20, owned: 0 },
    { symbol: 'ROST', name: 'Global Roasters', price: 100, owned: 0 }
];

// Costs
const BEANS_COST = 50;
const MILK_COST = 30;
const CUPS_COST = 20;

// Update UI Function
function updateUI() {
    document.getElementById('ui-day').innerText = day;
    document.getElementById('ui-money').innerText = money.toFixed(2);
    document.getElementById('ui-popularity').innerText = popularity;
    document.getElementById('ui-beans').innerText = inventory.beans;
    document.getElementById('ui-milk').innerText = inventory.milk;
    document.getElementById('ui-cups').innerText = inventory.cups;
    document.getElementById('ui-franchises').innerText = franchises;

    // Update Stocks UI
    const stockList = document.getElementById('stock-list');
    stockList.innerHTML = ''; // Clear current
    stocks.forEach((stock, index) => {
        const div = document.createElement('div');
        div.className = 'stock-item';
        div.innerHTML = `
            <div><strong>${stock.symbol}</strong>: $${stock.price.toFixed(2)} (Owned: ${stock.owned})</div>
            <div class="stock-actions">
                <button onclick="buyStock(${index})">Buy</button>
                <button onclick="sellStock(${index})">Sell</button>
            </div>
        `;
        stockList.appendChild(div);
    });
}

// Franchise Logic
document.getElementById('btn-buy-franchise').addEventListener('click', () => {
    if (money >= FRANCHISE_COST) {
        money -= FRANCHISE_COST;
        franchises++;
        updateUI();
        logEvent(`🎉 Bought a new Franchise! You now own ${franchises} franchises.`);
    } else {
        alert("Not enough money to buy a franchise! You need $" + FRANCHISE_COST);
    }
});

// Stocks Logic
function buyStock(index) {
    const stock = stocks[index];
    if (money >= stock.price) {
        money -= stock.price;
        stock.owned++;
        updateUI();
        logEvent(`Bought 1 share of ${stock.symbol} for $${stock.price.toFixed(2)}`);
    } else {
        alert("Not enough money to buy this stock!");
    }
}

function sellStock(index) {
    const stock = stocks[index];
    if (stock.owned > 0) {
        money += stock.price;
        stock.owned--;
        updateUI();
        logEvent(`Sold 1 share of ${stock.symbol} for $${stock.price.toFixed(2)}`);
    } else {
        alert("You don't own any shares of this stock!");
    }
}

function updateStockPrices() {
    stocks.forEach(stock => {
        // Fluctuate price by up to +/- 10%
        const changePercent = (Math.random() * 0.2) - 0.1;
        stock.price = stock.price * (1 + changePercent);
        if (stock.price < 1) stock.price = 1; // Minimum price
    });
}

// Log message to events log
function logEvent(message) {
    const logList = document.getElementById('log-list');
    const li = document.createElement('li');
    li.innerText = `Day ${day}: ${message}`;
    logList.insertBefore(li, logList.firstChild);
}

// Purchase Functions
function buyItem(item, cost, quantity) {
    if (money >= cost) {
        money -= cost;
        inventory[item] += quantity;
        updateUI();
        logEvent(`Bought ${quantity} ${item} for $${cost}`);
    } else {
        alert("Not enough money!");
    }
}

document.getElementById('btn-buy-beans').addEventListener('click', () => buyItem('beans', BEANS_COST, 50));
document.getElementById('btn-buy-milk').addEventListener('click', () => buyItem('milk', MILK_COST, 50));
document.getElementById('btn-buy-cups').addEventListener('click', () => buyItem('cups', CUPS_COST, 50));

// Set Price Listener
document.getElementById('price-input').addEventListener('change', (e) => {
    coffeePrice = parseFloat(e.target.value);
    if (coffeePrice < 1) {
        coffeePrice = 1;
        e.target.value = 1;
    }
});

// Random Events
const randomEvents = [
    { name: "Espresso machine broke down! Repairs cost $150.", moneyMod: -150, popMod: -5 },
    { name: "Local festival brings in huge crowds! Popularity +20.", moneyMod: 0, popMod: 20 },
    { name: "Health inspector visited and gave a perfect score! Popularity +10.", moneyMod: 0, popMod: 10 },
    { name: "Coffee bean shortage! A bad batch ruined 20 beans.", beanMod: -20, moneyMod: 0, popMod: 0 },
    { name: "Viral TikTok video about your shop! Popularity +15.", moneyMod: 0, popMod: 15 },
    { name: "Burglary attempt! Lost $50.", moneyMod: -50, popMod: 0 },
    { name: "Tax audit... you owed $100.", moneyMod: -100, popMod: 0 }
];

function triggerRandomEvent() {
    // 20% chance of a random event occurring each day
    if (Math.random() < 0.20) {
        const evt = randomEvents[Math.floor(Math.random() * randomEvents.length)];

        if (evt.moneyMod) money += evt.moneyMod;
        if (evt.popMod) popularity = Math.max(0, Math.min(100, popularity + evt.popMod));
        if (evt.beanMod) inventory.beans = Math.max(0, inventory.beans + evt.beanMod);

        // Ensure money doesn't go below 0 for this simple game
        if (money < 0) money = 0;

        logEvent(`🔥 EVENT: ${evt.name}`);
    }
}

// Advance Day Function
function advanceDay() {
    triggerRandomEvent();
    updateStockPrices();

    // Franchise Income
    if (franchises > 0) {
        let franchiseIncome = franchises * FRANCHISE_DAILY_INCOME;
        money += franchiseIncome;
        logEvent(`Received $${franchiseIncome} passive income from franchises.`);
    }

    // 1. Calculate max possible sales based on inventory
    let maxCoffeesPossible = Math.min(inventory.beans, inventory.milk, inventory.cups);

    // 2. Determine demand based on price and popularity
    // A standard coffee price might be $5. If they charge less, demand goes up. If more, demand goes down.
    let baseDemand = popularity; // If pop is 50, base demand is 50
    let priceFactor = 5 / coffeePrice;
    let actualDemand = Math.floor(baseDemand * priceFactor);

    // Add some randomness
    let dailyCustomers = actualDemand + Math.floor(Math.random() * 11) - 5; // +/- 5
    if (dailyCustomers < 0) dailyCustomers = 0;

    // 3. Determine how many coffees actually sold
    let coffeesSold = Math.min(maxCoffeesPossible, dailyCustomers);

    // 4. Update state
    inventory.beans -= coffeesSold;
    inventory.milk -= coffeesSold;
    inventory.cups -= coffeesSold;

    let dailyRevenue = coffeesSold * coffeePrice;
    money += dailyRevenue;

    // 5. Adjust popularity slightly based on sales
    if (coffeesSold < dailyCustomers) {
        // We ran out of stock, people are mad
        popularity = Math.max(0, popularity - 2);
    } else if (coffeesSold > 0) {
        // Successful sales
        popularity = Math.min(100, popularity + 1);
    }

    // Log daily summary
    logEvent(`Sold ${coffeesSold} coffees at $${coffeePrice.toFixed(2)}. Revenue: $${dailyRevenue.toFixed(2)}`);
    if (coffeesSold < dailyCustomers) {
        logEvent(`Missed out on ${dailyCustomers - coffeesSold} customers due to lack of inventory!`);
    }

    day++;
    updateUI();
}

document.getElementById('btn-advance').addEventListener('click', advanceDay);

// Initial UI Setup
updateUI();
