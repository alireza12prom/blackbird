export interface RegisterDto {
    /**
     * @description source url (valid http/https url)
     */
    source: string;
    /**
     * @description source url (valid http/https url)
     */
    target: string;
    opts?: {
        /**
         * @default false
         * @description if target support `socket` then set this option to `true`.
         */
        ws?: boolean;
        /**
         * @default false
         * @description if the target support `https` set this option to `true`.
         */
        redirect?: boolean;
    };
}
