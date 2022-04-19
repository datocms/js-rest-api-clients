export type JobResult = {
  type: 'job_result';
  id: string;
  attributes: {
    status: number;
    payload: null | {
      [k: string]: unknown;
    };
  };
};
