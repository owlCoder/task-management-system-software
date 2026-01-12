export type ReqParams<K extends string> = {
    [P in K]: string;
};