const API_URL = 'http://localhost:8000';
async function httpGetPlanets() {
  const data = await fetch(`${API_URL}/planets`).then(res => res.json());
  return data;
}

async function httpGetLaunches() {
  const data = await fetch(`${API_URL}/launches`).then(res => res.json());
  return data.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};