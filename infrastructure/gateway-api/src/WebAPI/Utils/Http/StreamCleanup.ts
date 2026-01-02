import { Response } from "express";
import { Readable } from "stream";

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