// ヘルスチェック用
// DB
export const dbHealthCheck = async () => {
  const healthCheckUrl = process.env.NEXT_PUBLIC_DB_HEALTHCHECK_URL || '';
  const token = process.env.NEXT_PUBLIC_DB_HEALTHCHECK_TOKEN || '';

  return await fetch(healthCheckUrl, {
    method: 'GET',
    headers: {
      Authorization: token
    }
  })
    .then((response) =>
      response.json().then((data) => ({
        status: response.status,
        body: data
      }))
    )
    .then((obj) => {
      const status = obj.status;
      return {
        status: `${status} - ${
          obj.body['ready'] && obj.body['ready'] === true ? 'OK ready状態' : 'NG ready状態でない'
        }`,
        color: status < 300 ? 'success.light' : 'error'
      };
    });
};
