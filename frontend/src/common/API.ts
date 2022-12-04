const baseURL = process.env.REACT_APP_API_SERVER

export const get = (path,func) => {
  fetch(baseURL + path)
  .then(response => response.json()
  .then(data => ({
    status: response.status,
    body: data
  })))
  .then(func
  ).catch(error => {
    console.error("componentDidMount:",error)
  });
}

export const post = (path,jsondata,func) => {
  fetch(baseURL + path,{
    method: 'POST',
    body: JSON.stringify(jsondata),
    headers: {'Content-Type': 'application/json'},
  })
  .then(response => response.json()
  .then(data => ({
    status: response.status,
    body: data
  })))
  .then(func
  ).catch(error => {
    console.error("componentDidMount:",error)
  });
}
