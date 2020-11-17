export const get = (apiRest) => {
    return fetch(`${location.origin}${apiRest}`).then(response => response.json())
}
