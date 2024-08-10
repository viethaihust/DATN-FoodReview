export async function handleError(response: Response): Promise<Error> {
  const errorText = await response.text();
  const status = response.status;

  const errorMessages: { [key: number]: string } = {
    400: `Bad request.`,
    401: `Unauthorized.`,
    404: `Not found.`,
    500: `Internal server error.`,
  };

  const error = new Error(`HTTP error ${status}`);

  const errorMessage = errorMessages[status];

  error.message = errorMessage
    ? `${error.message}: ${errorMessage} ${errorText}`
    : `${error.message}: Network response was ${status}. ${errorText}`;

  console.error("Error fetching data:", error.message);

  return error;
}
