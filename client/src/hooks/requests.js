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
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(launch)
    });
  } catch (error) {
    return { ok: false }
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete"
    })
  } catch (error) {
    return { ok: false }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};