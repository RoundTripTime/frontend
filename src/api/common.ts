export type ID = string;
export type ISODateTime = string;
export type ISODate = string;

export type PaginatedResponse<T> = {
  items: T[];
  next_cursor: string | null;
};

export type Visibility = 'public' | 'private';

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

export type QueryParams = Record<string, string | number | boolean | undefined | null>;
