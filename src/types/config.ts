/*** Configuration for the server-side HydraDB HTTP persistence adapter. @config @readme @title HydraDB graph persistence configuration */
export interface HydraDbGraphPersistenceConfiguration {
  readonly endpoint: string;
  readonly token: string;
  readonly namespace: string;
  readonly graphId: string;
  readonly cellId: string;
  readonly timeoutMilliseconds?: number;
  readonly allowInsecureLoopbackHttp?: boolean;
}
