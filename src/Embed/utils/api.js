
export const checkStatus = async (response) => {
  if (response.status >= 400 && response.status < 500) {
    const error = await response.json();
    throw error;
  } else if (response.status >= 500) {
    throw "Internal error";
  }
  return response;
}