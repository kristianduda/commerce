type ErrorMessage = {
  message: string;
};

type AjaxOptions = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: object;
};

export class AjaxError extends Error {
  statusCode: number;
  errors: ErrorMessage[];

  constructor(statusCode: number, message: string, errors: ErrorMessage[] = []) {
    super(message);
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

export const ajax = async <T>({ url, method, body }: AjaxOptions): Promise<T> => {
  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json();
  if (response.ok) {
    return data as T;
  }

  throw new AjaxError(response.status, data.message ?? response.statusText, data.errors);
};
