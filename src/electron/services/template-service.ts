import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import * as yaml from 'js-yaml';
import JSZip from 'jszip';
import { ZipUtils } from '../../shared/utils/zip-utils.js';
import { ServiceResult, ServiceError } from '../../shared/lib/service-objects.js';


//TODO: Way too many fail fast cases.   Need to log issues, but allow template discovery to continue
export class TemplateService {
    static async discoverTemplates():Promise<ServiceResult<TemplateInfo[]>> {
        let templatesInfo:TemplateInfo[] = [];
        const userTemplatePath = path.join(app.getPath('userData'), "templates");
        const builtInTemplatePath = path.join(__dirname, '../../assets/templates');
  
        const userTempResult = await this.scanTemplateDirectory(userTemplatePath, false);
        if (!userTempResult.success) {
            return userTempResult;
        }  else if (userTempResult.data && userTempResult.data.length > 0) {
            templatesInfo = templatesInfo.concat(userTempResult.data);  
        } 

        const builtInTempResult = await this.scanTemplateDirectory(builtInTemplatePath, true);
        if (!builtInTempResult.success) {
                return builtInTempResult; 
        }  else if (builtInTempResult.data && builtInTempResult.data.length > 0) {
            templatesInfo = templatesInfo.concat(builtInTempResult.data);
        }
        return ServiceResult.ok(templatesInfo);
    }

    private static async scanTemplateDirectory(directory: string, isBuiltIn: boolean): Promise<ServiceResult<TemplateInfo[]>> {
        const templates: TemplateInfo[] = [];
        try {
            const files = await fs.promises.readdir(directory, { withFileTypes: true });
            for (const file of files) {
                if (file.isFile() && file.name.endsWith('.agtpl')) {
                    const filePath = path.join(directory, file.name);
                    const zipResult = await ZipUtils.loadZipFile(filePath);
                    if (!zipResult.success) {
                        return ServiceResult.fail(
                            new ServiceError('validation', 'Failed to load template archive', path.join(directory, file.name), zipResult.error?.message)
                        )
                    }  else if (zipResult.data) {
                        const zipFile = ZipUtils.getZipFile(zipResult.data, 'template.yaml');
                        if (!zipFile) {
                            return ServiceResult.fail(
                                new ServiceError('validation', 'Template metadata file is missing', path.join(directory, file.name))
                            );
                        }  else {
                            const contentResult = await ZipUtils.extractTextFromZip(zipFile)
                            if (contentResult.error) {
                                return contentResult;
                            }  else if (contentResult.data) {
                                let metadata: TemplateMetadata;
                                try {
                                    metadata = yaml.load(contentResult.data) as TemplateMetadata;
                                } catch (error) {
                                    return ServiceResult.fail(
                                        new ServiceError('validation', 'Failed to parse template metadata', filePath, error instanceof Error ? error.message : undefined)
                                    );
                                }
                                templates.push({
                                    name: metadata.name,
                                    description: metadata.description,
                                    author: metadata.author,
                                    version: metadata.version,
                                    filePath: filePath,     
                                    isBuiltIn: isBuiltIn
                                });
                            }
                        }
                    }

                }
            }
        } catch (error) {
            return ServiceResult.fail(
                new ServiceError('filesystem', 'Failed to read template directory', directory, error instanceof Error ? error.message : undefined)
            );
        }
        return ServiceResult.ok(templates);
    }   
};