import { ajax } from 'lib/cms/ajax';
import qs from 'qs';

const OPERATORS = [
  'equals',
  'contains',
  'not_equals',
  'in',
  'all',
  'not_in',
  'exists',
  'greater_than',
  'greater_than_equal',
  'less_than',
  'less_than_equal',
  'like',
  'within',
  'intersects',
  'near'
] as const;

type Operator = (typeof OPERATORS)[number];
type WhereField = {
  // eslint-disable-next-line no-unused-vars
  [key in Operator]?: unknown;
};
export type Where = {
  [key: string]: Where[] | WhereField | undefined;
  and?: Where[];
  or?: Where[];
};

export type PaginatedDocs<T> = {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage?: null | number;
  page?: number;
  pagingCounter: number;
  prevPage?: null | number;
  totalDocs: number;
  totalPages: number;
};

type Doc<T> = {
  message: string;
  doc: T;
};

type BaseParams = {
  depth?: number;
};

type FindParams = BaseParams & {
  where?: Where;
  depth?: number;
  sort?: string;
  page?: number;
  limit?: number;
};

type PayloadOptions = {
  baseUrl?: string;
};

export class Payload<T extends Record<string, unknown>> {
  readonly baseUrl?: string;

  constructor({ baseUrl }: PayloadOptions) {
    this.baseUrl = baseUrl;
  }

  find = <Key extends keyof T>(collection: Key, params: FindParams = {}) => {
    const query = qs.stringify(params, { addQueryPrefix: true });
    const url = `${this.baseUrl}/api/${String(collection)}${query}`;

    return ajax<PaginatedDocs<T[Key]>>({ method: 'GET', url });
  };

  findByID = <Key extends keyof T>(collection: Key, id: string, params: BaseParams = {}) => {
    const query = qs.stringify(params, { addQueryPrefix: true });
    const url = `${this.baseUrl}/api/${String(collection)}/${id}${query}`;

    return ajax<T[Key]>({ method: 'GET', url });
  };

  create = <Key extends keyof T>(collection: Key, body: Partial<T[Key]>) => {
    const url = `${this.baseUrl}/api/${String(collection)}`;

    return ajax<Doc<T[Key]>>({ method: 'POST', url, body });
  };

  update = <Key extends keyof T>(collection: Key, id: string, body: Partial<T[Key]>) => {
    const url = `${this.baseUrl}/api/${String(collection)}/${id}`;

    return ajax<Doc<T[Key]>>({ method: 'PATCH', url, body });
  };
}
