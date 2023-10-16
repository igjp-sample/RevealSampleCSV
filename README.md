# INFRAGISTICS Reval BI Demo for real time refreshing

## Requirements

- Valid license key for Reveal (Both for Trial or Paid are available)

## How to run in your local PC

### Prerequisites

- Node.js ver.16 or higher

### Steps

1. Clone the repository or download souce code.
2. Create new `.env` file.
3. Edit the `.env` file and write down your license key in it with the `LICENSE_KEY={your key}` format.
4. Run `npm ci` to install all dependencies.
5. Run `npm start` to start the application.
6. Open `http://localhost:5112` in your browser.
7. You will see the pre-configured dashboard and the column chart.
8. Open another terminal.
9. Run `curl -X PATCH -H "Content-Type: application/json" -d '{"score": 60}' http://localhost:5112/api/data/1` to update the data.
10. **The dashboard will be updated automatically.**

## How to run in your GitHub Codespaces

### Prerequisites

- Your GitHub account

### Steps

1. Create a new GitHub Codespaces workspace with your GitHub account.
2. Create new `.env` file.
3. Edit the `.env` file and write down your license key in it with the `LICENSE_KEY={your key}` format.
4. Run `npm start` to start the application.
5. When the port forwarding is available, open the "PORTS" tab.
6. Right click the entry of "5112" and select "Preview in Editor".
7. You will see the pre-configured dashboard and the column chart.
8. Open another terminal.
9. Run `curl -X PATCH -H "Content-Type: application/json" -d '{"score": 60}' http://localhost:5112/api/data/1` to update the data.
10. **The dashboard will be updated automatically.**

https://github.com/igjp-sample/RevealSampleForRealTimeRefreshing/assets/102948935/d5c2015f-8fb0-4890-9f79-39d31eda7ff0

