export interface UnregisterDto {
    /**
     * source of the registered url (valid http/https url)
     */
    source: string;
    /**
     * @description target of the registered url (valid http/https url)
     */
    target: string;
}
