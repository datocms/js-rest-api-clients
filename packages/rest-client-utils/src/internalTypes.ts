export type JobResult = {
  type: 'job_result';
  id: string;
  status: number;
  payload: null | {
    [k: string]: unknown;
  };
};
