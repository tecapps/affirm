export type ApiResponse = {
  error: boolean | undefined;
  status: number | undefined;
  message: string | Record<string, unknown>;
};
