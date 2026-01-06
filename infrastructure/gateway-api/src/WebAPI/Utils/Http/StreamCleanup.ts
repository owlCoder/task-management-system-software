import { Response } from "express";
import { Readable } from "stream";

/**
 * Attaches cleanup and error-handling listeners to a stream and response.
 * @param {Readable} stream - The readable stream being piped to the response.
 * @param {Response} res - The response object.
 */
export function setupStreamCleanup(stream: Readable, res: Response): void {
    const cleanup = () => {
        if (!stream.destroyed) stream.destroy();
    };

    stream.on('error', (_err) => {
        cleanup();
        if (!res.headersSent) {
            res.status(500).json({ message: 'Stream failed' });
        } else {
            res.end();
        }
    });

    res.on('error', cleanup);
    res.on('close', cleanup);
}