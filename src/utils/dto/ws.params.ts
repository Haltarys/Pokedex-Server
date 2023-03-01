// Since Socket.io does not support URL parameters, we have to use the socket body to pass the parameters.
// 'path' is the URL parameters (like in '/users/:id'), and 'body' is the request body or the query string object.

export interface WsParams {
  path: unknown;

  body?: unknown;
}
