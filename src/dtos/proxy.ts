export interface ProxyOpts {
  http: {
    /**
     * the http listening  port
     */
    port: number;
  };
  https?: {
    /**
     * the https listening port
     */
    port: number;

    /**
     * use the `abstract path` or `buffer`.
     */
    key: string | Buffer;

    /**
     * use the `abstract path` or `buffer`.
     */
    cert: string | Buffer;

    /**
     * use the `abstract path` or `buffer`.
     */
    ca?: string | Buffer;
  };

  /**
   * set `false` to disable logging.
   */
  logging?: boolean;
}

export type SearchTargetReturnType = {
  source: string;
  target: string | null;
  redirect: boolean;
};
