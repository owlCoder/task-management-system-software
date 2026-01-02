// Libraries
import { RawAxiosResponseHeaders, AxiosResponseHeaders } from 'axios';
import { Readable } from 'stream';

export interface StreamResponse {
    stream: Readable;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
}