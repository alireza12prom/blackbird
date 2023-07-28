export interface Subscriber {
    hostname: string;
    path: string;
    ws: boolean;
    redirect: boolean;
}
export interface Repository {
    hostname: string;
    path: string;
    rr: {
        http: number;
        ws: number;
    };
    subscriber: Subscriber[];
}
export interface Exists {
    hostname: string;
}
export interface AddDto {
    source: {
        hostname: string;
        path: string;
    };
    target: {
        hostname: string;
        path: string;
        ws: boolean;
        redirect: boolean;
    };
}
export interface RemoveDto {
    source: {
        hostname: string;
        path: string;
    };
    target: {
        hostname: string;
        path: string;
    };
}
export interface FindDto {
    hostname: string;
    path?: string;
}
export interface IsUniqueDto {
    source: {
        hostname: string;
        path: string;
    };
    target: {
        hostname: string;
        path: string;
    };
}
