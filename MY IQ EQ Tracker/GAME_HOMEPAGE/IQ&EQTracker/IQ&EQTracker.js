let balance = 1000.00;
let stocksOwned = {
    AAPL: 0,
    GOOGL: 0,
    AMZN: 0
};
let stockPrices = {
    AAPL: 150.00,
    GOOGL: 2500.00,
    AMZN: 3500.00
};
let selectedStock = 'AAPL'; // Default selected stock

document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const stockPriceElement = document.getElementById('stock-price');
    const stocksOwnedElement = document.getElementById('stocks-owned');
    const buyBtn = document.getElementById('buy-btn');
    const sellBtn = document.getElementById('sell-btn');
    const stockSelect = document.getElementById('stock-select');

    const updateUI = () => {
        balanceElement.textContent = `RM ${balance.toFixed(2)}`;
        stockPriceElement.textContent = `RM ${stockPrices[selectedStock].toFixed(2)}`;
        stocksOwnedElement.textContent = stocksOwned[selectedStock];
    };

    const fetchStockPrice = () => {
        // Simulating random stock price changes for each stock
        Object.keys(stockPrices).forEach(stock => {
            const randomChange = (Math.random() - 0.5) * 50; // Adjust the fluctuation range as needed
            stockPrices[stock] += randomChange;
            stockPrices[stock] = Math.max(1, stockPrices[stock]); // Ensure stock price doesn't go below 1
        });
        updateUI();
    };

    setInterval(fetchStockPrice, 5000); // Update stock prices every 5 seconds

    buyBtn.addEventListener('click', () => {
        const price = stockPrices[selectedStock];
        if (balance >= price) {
            balance -= price;
            stocksOwned[selectedStock] += 1;
            updateUI();
        }
    });

    sellBtn.addEventListener('click', () => {
        const price = stockPrices[selectedStock];
        if (stocksOwned[selectedStock] > 0) {
            balance += price;
            stocksOwned[selectedStock] -= 1;
            updateUI();
        }
    });

    stockSelect.addEventListener('change', () => {
        selectedStock = stockSelect.value;
        updateUI();
    });

    updateUI();
});
