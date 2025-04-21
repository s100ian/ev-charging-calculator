# EV Charging Calculator

A simple web application to calculate electric vehicle charging metrics based on car and charging details.

## Features

- **Car Information Input:** Set usable battery capacity (kWh) and energy consumption (kWh/100km).
- **Charging Details Input:** Configure charging voltage (V), duration (hours), current state of charge (SoC %), and charging current (Amps).
- **Calculated Results:** Displays estimated SoC after charging, charging power (kW), charging speed (%/h and km/h), and range added per session (km).
- **Responsive Design:** Primarily designed for mobile use.
- **Persistent State:** Input values are saved in the browser's local storage.

## Technologies Used

- React
- TypeScript
- Vite
- CSS

## Development Approach

This application was developed using an iterative, AI-assisted approach ("Vibe coding technique"), focusing on rapid prototyping and refinement based on requirements.

## Installation & Usage

1.  Clone the repository:
    ```bash
    git clone https://github.com/s100ian/ev-charging-calculator.git
    cd ev-charging-calculator
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## Deployment

The application is deployed using GitHub Pages. The `deploy` script in `package.json` handles the build and deployment process.
