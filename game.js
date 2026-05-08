// Game State
let money = 1000;
let day = 1;
let popularity = 50; // out of 100
let inventory = {
    beans: 50,
    milk: 50,
    cups: 50,
    pastries: 10
};
let coffeePrice = 5.00;
let pastryPrice = 3.50;

// Real Estate State
const LOCATIONS = [
    { name: 'Coffee Cart', rent: 0, capBoost: 0 },
    { name: 'Kiosk', rent: 50, capBoost: 20 },
    { name: 'Cafe', rent: 200, capBoost: 50 },
    { name: 'Flagship Store', rent: 500, capBoost: 100 }
];
let currentLocationLevel = 0;

// Weather & Marketing State
const WEATHER_TYPES = ['Sunny ☀️', 'Rainy 🌧️', 'Cold ❄️', 'Perfect 🌈'];
let currentWeather = 'Sunny ☀️';

let marketing = {
    flyers: { active: false, cost: 10, buff: 5 },
    socialMedia: { active: false, cost: 30, buff: 15 },
    tvAds: { active: false, cost: 100, buff: 40 }
};

// Bank State
let bankLoan = 0;
const LOAN_INTEREST_RATE = 0.05; // 5% daily interest

// Staff & Upgrades State
let employees = 0;
const EMPLOYEE_COST = 150; // Cost to hire
const EMPLOYEE_WAGE = 50;  // Daily wage

let upgrades = [
    { id: 'neon_sign', name: 'Neon Sign', cost: 300, owned: false, desc: '+10 Base Popularity' },
    { id: 'premium_roaster', name: 'Premium Roaster', cost: 1000, owned: false, desc: 'Increases max sales limit by 20' },
    { id: 'loyalty_program', name: 'Loyalty Program', cost: 500, owned: false, desc: '+5 Base Popularity' },
    { id: 'free_wifi', name: 'Free Wi-Fi', cost: 800, owned: false, desc: '+15 Base Popularity' },
    { id: 'drive_thru', name: 'Drive-Thru Window', cost: 3000, owned: false, desc: 'Massive capacity boost' },
    { id: 'barista_training', name: 'Barista Training', cost: 1500, owned: false, desc: '+20 Base Popularity' },
    { id: 'pastry_display', name: 'Heated Pastry Display', cost: 600, owned: false, desc: 'Sells more pastries' },
    { id: 'eco_cups', name: 'Eco-Friendly Cups', cost: 400, owned: false, desc: '+8 Base Popularity' }
];

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
const PASTRIES_COST = 20; // Cost for 10 pastries

// Update UI Function
function updateUI() {
    document.getElementById('ui-day').innerText = day;
    document.getElementById('ui-money').innerText = money.toFixed(2);
    document.getElementById('ui-popularity').innerText = popularity;
    document.getElementById('ui-beans').innerText = inventory.beans;
    document.getElementById('ui-milk').innerText = inventory.milk;
    document.getElementById('ui-cups').innerText = inventory.cups;
    document.getElementById('ui-franchises').innerText = franchises;
    document.getElementById('ui-employees').innerText = employees;
    document.getElementById('ui-loan').innerText = bankLoan.toFixed(2);

    if(document.getElementById('ui-pastries')) {
        document.getElementById('ui-pastries').innerText = inventory.pastries;
        document.getElementById('ui-location').innerText = LOCATIONS[currentLocationLevel].name;
        document.getElementById('ui-rent').innerText = LOCATIONS[currentLocationLevel].rent;
    }

    // New UI Elements
    if(document.getElementById('ui-weather')) {
        document.getElementById('ui-weather').innerText = currentWeather;

        // Update Marketing Toggles
        document.getElementById('btn-mark-flyers').innerText = marketing.flyers.active ? 'Stop Flyers' : 'Start Flyers ($10/day)';
        document.getElementById('btn-mark-social').innerText = marketing.socialMedia.active ? 'Stop Social' : 'Start Social ($30/day)';
        document.getElementById('btn-mark-tv').innerText = marketing.tvAds.active ? 'Stop TV Ads' : 'Start TV Ads ($100/day)';
    }

    // Update Upgrades UI
    const upgradesList = document.getElementById('upgrades-list');
    upgradesList.innerHTML = '';
    upgrades.forEach((upgrade, index) => {
        const div = document.createElement('div');
        div.className = 'upgrade-item';
        div.innerHTML = `
            <h4>${upgrade.name}</h4>
            <p>${upgrade.desc}</p>
            ${upgrade.owned
                ? '<span><em>Owned</em></span>'
                : `<button class="secondary-btn" onclick="buyUpgrade(${index})">Buy ($${upgrade.cost})</button>`
            }
        `;
        upgradesList.appendChild(div);
    });

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

// Staff & Upgrades Logic
document.getElementById('btn-hire-staff').addEventListener('click', () => {
    if (money >= EMPLOYEE_COST) {
        money -= EMPLOYEE_COST;
        employees++;
        updateUI();
        logEvent(`Hired a new employee! You now have ${employees} staff members.`);
    } else {
        alert("Not enough money to hire an employee!");
    }
});

function buyUpgrade(index) {
    const upgrade = upgrades[index];
    if (!upgrade.owned) {
        if (money >= upgrade.cost) {
            money -= upgrade.cost;
            upgrade.owned = true;

            // Apply immediate one-time buffs if necessary
            if (upgrade.id === 'neon_sign') popularity += 10;
            if (upgrade.id === 'loyalty_program') popularity += 5;
            if (upgrade.id === 'free_wifi') popularity += 15;
            if (upgrade.id === 'barista_training') popularity += 20;
            if (upgrade.id === 'eco_cups') popularity += 8;
            if (popularity > 150) popularity = 150; // Increased cap for late game

            updateUI();
            logEvent(`Bought Upgrade: ${upgrade.name}!`);
        } else {
            alert("Not enough money to buy this upgrade!");
        }
    }
}

// Marketing Logic
function toggleMarketing(type) {
    marketing[type].active = !marketing[type].active;
    updateUI();
    logEvent(`${marketing[type].active ? 'Started' : 'Stopped'} ${type} marketing campaign.`);
}

// Banking Logic
document.getElementById('btn-take-loan').addEventListener('click', () => {
    bankLoan += 1000;
    money += 1000;
    updateUI();
    logEvent(`Took out a $1000 loan. Current debt: $${bankLoan.toFixed(2)}`);
});

document.getElementById('btn-pay-loan').addEventListener('click', () => {
    if (bankLoan > 0) {
        let payment = Math.min(money, bankLoan); // Pay what you can, up to the loan amount
        if (payment > 0) {
            money -= payment;
            bankLoan -= payment;
            updateUI();
            logEvent(`Paid $${payment.toFixed(2)} towards loan. Remaining debt: $${bankLoan.toFixed(2)}`);
        } else {
            alert("You have no money to pay the loan!");
        }
    } else {
        alert("You don't have any outstanding loans!");
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
if(document.getElementById('btn-buy-pastries')) {
    document.getElementById('btn-buy-pastries').addEventListener('click', () => buyItem('pastries', PASTRIES_COST, 10));
}

// Set Price Listener
document.getElementById('price-input').addEventListener('change', (e) => {
    coffeePrice = parseFloat(e.target.value);
    if (coffeePrice < 1) {
        coffeePrice = 1;
        e.target.value = 1;
    }
});

if(document.getElementById('pastry-price-input')) {
    document.getElementById('pastry-price-input').addEventListener('change', (e) => {
        pastryPrice = parseFloat(e.target.value);
        if (pastryPrice < 1) {
            pastryPrice = 1;
            e.target.value = 1;
        }
    });
}

// Real Estate Logic
function upgradeLocation() {
    if (currentLocationLevel < LOCATIONS.length - 1) {
        let upgradeCost = LOCATIONS[currentLocationLevel + 1].rent * 20; // One time fee
        if (money >= upgradeCost) {
            money -= upgradeCost;
            currentLocationLevel++;
            updateUI();
            logEvent(`Upgraded location to ${LOCATIONS[currentLocationLevel].name}!`);
        } else {
            alert(`Not enough money to upgrade. Need $${upgradeCost}.`);
        }
    } else {
        alert("You are already at the max location level!");
    }
}

// Random Events
const randomEvents = [
    { name: "Espresso machine broke down! Repairs cost $150.", moneyMod: -150, popMod: -5 },
    { name: "Local festival brings in huge crowds! Popularity +20.", moneyMod: 0, popMod: 20 },
    { name: "Health inspector visited and gave a perfect score! Popularity +10.", moneyMod: 0, popMod: 10 },
    { name: "Coffee bean shortage! A bad batch ruined 20 beans.", beanMod: -20, moneyMod: 0, popMod: 0 },
    { name: "Viral TikTok video about your shop! Popularity +15.", moneyMod: 0, popMod: 15 },
    { name: "Burglary attempt! Lost $50.", moneyMod: -50, popMod: 0 },
    { name: "Tax audit... you owed $100.", moneyMod: -100, popMod: 0 },
    { name: "A rival coffee shop opened next door. Popularity -15.", moneyMod: 0, popMod: -15 },
    { name: "Celebrity spotted drinking your coffee! Popularity +25.", moneyMod: 0, popMod: 25 },
    { name: "Supplier discount! Saved $50 on next order.", moneyMod: 50, popMod: 0 },
    { name: "Mice infestation... Paid $200 for exterminator.", moneyMod: -200, popMod: -10 },
    { name: "Employee called in sick, things ran slow. Popularity -5.", moneyMod: 0, popMod: -5 }
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

    // Set Random Weather
    currentWeather = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
    logEvent(`Weather today is: ${currentWeather}`);

    // Marketing Costs
    let dailyMarketingCost = 0;
    let marketingBuff = 0;
    for (let key in marketing) {
        if (marketing[key].active) {
            dailyMarketingCost += marketing[key].cost;
            marketingBuff += marketing[key].buff;
        }
    }

    if (dailyMarketingCost > 0) {
        money -= dailyMarketingCost;
        logEvent(`Paid $${dailyMarketingCost} for active marketing campaigns.`);
    }

    // Franchise Income
    if (franchises > 0) {
        let franchiseIncome = franchises * FRANCHISE_DAILY_INCOME;
        money += franchiseIncome;
        logEvent(`Received $${franchiseIncome} passive income from franchises.`);
    }

    // Staff Wages
    if (employees > 0) {
        let dailyWages = employees * EMPLOYEE_WAGE;
        money -= dailyWages;
        logEvent(`Paid $${dailyWages} in wages to ${employees} employees.`);
    }

    // Rent
    if (LOCATIONS[currentLocationLevel].rent > 0) {
        money -= LOCATIONS[currentLocationLevel].rent;
        logEvent(`Paid $${LOCATIONS[currentLocationLevel].rent} in daily rent.`);
    }

    // Bank Loan Interest
    if (bankLoan > 0) {
        let interest = bankLoan * LOAN_INTEREST_RATE;
        bankLoan += interest;
        logEvent(`Bank charged $${interest.toFixed(2)} in loan interest. Total debt: $${bankLoan.toFixed(2)}`);
    }

    // 1. Calculate max possible sales based on inventory
    let baseMaxPossible = Math.max(0, Math.min(inventory.beans, inventory.milk, inventory.cups));

    // 2. Determine demand based on price and popularity
    // A standard coffee price might be $5. If they charge less, demand goes up. If more, demand goes down.
    let baseDemand = popularity;

    // Marketing Boost
    baseDemand += marketingBuff;

    // Employees boost base demand slightly (they serve faster, nicer)
    baseDemand += (employees * 5);

    // Weather Boost
    if (currentWeather === 'Rainy 🌧️' || currentWeather === 'Cold ❄️') baseDemand += 10; // People want warm coffee
    if (currentWeather === 'Perfect 🌈') baseDemand += 20;

    let priceFactor = 5 / coffeePrice;
    let actualDemand = Math.floor(baseDemand * priceFactor);

    // Add some randomness
    let dailyCustomers = actualDemand + Math.floor(Math.random() * 11) - 5; // +/- 5
    if (dailyCustomers < 0) dailyCustomers = 0;

    if (upgrades.find(u => u.id === 'premium_roaster').owned) dailyCustomers += 20;

    // 3. Determine how many coffees actually sold
    // Location and Drive-thru boost customer traffic/capacity
    dailyCustomers += LOCATIONS[currentLocationLevel].capBoost;
    if (upgrades.find(u => u.id === 'drive_thru').owned) dailyCustomers += 50;

    let coffeesSold = Math.min(baseMaxPossible, dailyCustomers);

    // 4. Update state (Coffee)
    inventory.beans -= coffeesSold;
    inventory.milk -= coffeesSold;
    inventory.cups -= coffeesSold;

    let coffeeRevenue = coffeesSold * coffeePrice;
    money += coffeeRevenue;

    // 4.5 Update state (Pastries Cross-sell)
    let pastriesSold = 0;
    if (coffeesSold > 0 && inventory.pastries > 0) {
        // Assume 20% of coffee buyers also want a pastry, minus price penalty
        let pastryInterestRate = upgrades.find(u => u.id === 'pastry_display').owned ? 0.40 : 0.20;
        let pastryDemand = Math.floor(coffeesSold * pastryInterestRate * (3.5 / pastryPrice));
        pastriesSold = Math.min(inventory.pastries, pastryDemand);
        inventory.pastries -= pastriesSold;

        let pastryRevenue = pastriesSold * pastryPrice;
        money += pastryRevenue;
        logEvent(`Sold ${pastriesSold} pastries at $${pastryPrice.toFixed(2)}. Revenue: $${pastryRevenue.toFixed(2)}`);
    }

    let dailyRevenue = coffeeRevenue + (pastriesSold * pastryPrice);

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
