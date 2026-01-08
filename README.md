# Car Investment & Fuel Efficiency Comparison Tool

A single-page web application designed to help users make financially sound decisions when choosing between a fuel-efficient, expensive car and a cheaper, less efficient alternative.

## 🚀 Live Demo
*Host your link here after deployment (e.g., https://yourusername.github.io/repo-name/)*

## 💡 The Problem
Choosing a car based purely on "fuel efficiency" can be misleading. While a more expensive car (like a hybrid or EV) saves money at the pump, that extra upfront cost could have been invested in a Fixed Deposit (FD) or another yield-bearing asset. 

This tool factors in the **Opportunity Cost** of that price difference to show you the true financial "break-even" point.

## ✨ Features
- **Total Cost of Ownership (TCO):** Tracks cumulative costs including purchase price and fuel over 10 years.
- **Opportunity Cost Logic:** Adds the missed investment returns (interest) of the price difference to the more expensive car's total cost.
- **Regional Presets:** Quickly switch between Sri Lanka, USA, UK, Europe, and India with localized currencies, fuel prices, and interest rates.
- **Interactive Visualizations:**
  - **Dual-Line Graph:** See exactly where the total cost lines intersect.
  - **Yearly Breakdown Table:** A detailed year-by-year analysis of fuel savings vs. lost investment gains.
- **Real-Time Calculation:** Results update instantly as you adjust any parameter.

## 🧮 How it Works
The tool calculates the **Total Cost** for each year $(n)$ as follows:

$$Total\ Cost = Purchase\ Price + \sum (Annual\ Fuel\ Cost) + Opportunity\ Cost$$

### What is Opportunity Cost?
If you buy the cheaper car, you have a surplus of cash. We assume this surplus is invested at the provided interest rate. To compare fairly, we add those **missed interest earnings** to the cost of the more expensive car.

## 🛠️ Tech Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+).
- **Styling:** [Bootstrap 5](https://getbootstrap.com/) for layout and responsiveness.
- **Charting:** [Chart.js](https://www.chartjs.org/) for the interactive 10-year projection.
- **CI/CD:** GitHub Actions for automated deployment to GitHub Pages.

## 💻 Local Development
Simply clone the repository and open `index.html` in any modern web browser:
```bash
git clone https://github.com/yourusername/fuel-vs-investment.git
cd fuel-vs-investment
# Open index.html in your browser
```

## 🚢 Deployment
This project is configured for **GitHub Pages** via GitHub Actions. Every push to the `main` branch automatically triggers a new deployment. 

To enable this:
1. Push the code to your GitHub repository.
2. Go to **Settings > Pages** in your repo.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
