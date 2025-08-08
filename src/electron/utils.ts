import app from 'electron';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { ServiceResult } from '../shared/lib.js';

export const isDev = () => process.env.NODE_ENV === 'development';

export function debug(...args: any[]) {
    if (isDev()) {
        console.debug('[DEBUG]', ...args);
    }
}

export async function writeJsonFileAtomic(filePath: string, data: any) : Promise<ServiceResult<void>> {
    const tmpFileName = crypto.randomBytes(8).toString('hex') + '.tmp';
    const tempFilePath = path.join(path.dirname(filePath), tmpFileName);
    try {
        await fs.promises.writeFile(tempFilePath, JSON.stringify(data, null, 2), 'utf-8');
        await fs.promises.rename(tempFilePath, filePath);
        return ServiceResult.success();
    }  catch (error) {
        await fs.promises.rm(tempFilePath);
        return ServiceResult.fail({
            type: 'filesystem',
            message: `Failed to write JSON file atomically (${filePath})`,
            details: error instanceof Error ? error.message + (error.stack ?? '') : undefined
        });
    }  
} 