// script.js

document.getElementById('runBacktest').addEventListener('click', runBacktest);

function generateRandomData(days) {
    let prices = [];
    let price = 100; // Starting price

    for (let i = 0; i < days; i++) {
        price += (Math.random() - 0.5) * 5; // Random walk
        prices.push(Math.max(50, price)); // Ensure price stays above 50
    }
    return prices;
}

function simulateStrategy(prices) {
    let balance = 10000;
    let position = 0;
    let trades = [];

    for (let i = 0; i < prices.length - 1; i++) {
        if (prices[i] < 95 && position === 0) {
            position = balance / prices[i]; // Buy
            balance = 0;
            trades.push({ day: i + 1, action: 'Buy', price: prices[i] });
        } else if (prices[i] > 105 && position > 0) {
            balance = position * prices[i]; // Sell
            position = 0;
            trades.push({ day: i + 1, action: 'Sell', price: prices[i] });
        }
    }

    // Final sell if still holding
    if (position > 0) {
        balance = position * prices[prices.length - 1];
        trades.push({ day: prices.length, action: 'Sell', price: prices[prices.length - 1] });
    }

    return { profitLoss: balance - 10000, trades };
}

function runBacktest() {
    const prices = generateRandomData(365);
    const { profitLoss, trades } = simulateStrategy(prices);

    document.getElementById('profitLoss').textContent = `Profit/Loss: $${profitLoss.toFixed(2)}`;
    renderChart(prices, trades);
}

function renderChart(prices, trades) {
    const ctx = document.getElementById('performanceChart').getContext('2d');

    const tradeMarkers = trades.map(trade => ({
        x: trade.day,
        y: trade.price,
        label: `${trade.action} @ $${trade.price.toFixed(2)}`
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: prices.length }, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Price Over Time',
                    data: prices,
                    borderColor: '#3498db',
                    fill: false,
                },
                {
                    label: 'Trades',
                    data: tradeMarkers,
                    pointBackgroundColor: tradeMarkers.map(trade => trade.label.includes('Buy') ? 'green' : 'red'),
                    pointRadius: 5,
                    showLine: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Days' } },
                y: { title: { display: true, text: 'Price ($)' } }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => context.raw.label || `Price: $${context.raw.y}`
                    }
                }
            }
        }
    });
}





