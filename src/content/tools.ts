export function renderSuncess(type: string, data: unknown) {
  return JSON.stringify({
    type,
    code: 200,
    msg: 'success',
    data,
  })
}

export function renderError(type: string, msg: string) {
  return JSON.stringify({
    type,
    code: 500,
    msg,
    data: null,
  })
}
