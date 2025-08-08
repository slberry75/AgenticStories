import path from "path";
import fs from "fs/promises";
import chalk from "chalk";
import * as yaml from "js-yaml";
import JSZip from "jszip";

const TEMPLATE_DIRECTORY = path.resolve('templates');
const OUTPUT_DIRECTORY = path.resolve('assets/templates');

try {
    await fs.access(TEMPLATE_DIRECTORY);
    
    try {
        await fs.access(OUTPUT_DIRECTORY);
    }  catch(error) {
        try {
            await fs.mkdir(OUTPUT_DIRECTORY, { recursive: true });
            console.log(chalk.yellow(`Output directory ${OUTPUT_DIRECTORY} does not exist. Creating...`));
        }  catch(error) {
            console.log(chalk.red(`Cannot create output directory ${OUTPUT_DIRECTORY}`));
            console.log(chalk.red(error.message));
        }
    }
} catch(error) {
    console.log(chalk.red(`cannot access directory ${TEMPLATE_DIRECTORY}`));
    console.log(chalk.red(error.message));
    process.exit(1);
}

const files = await fs.readdir(TEMPLATE_DIRECTORY, { withFileTypes: true });
for (const file of files.filter(f => f.isDirectory()).map(f => f.name)) {
    const templatePath = path.join(TEMPLATE_DIRECTORY, file);
    console.log(`Scanning ${templatePath}`)
    const templateDir = await fs.readdir(templatePath);
    // check for template.yaml
    if (templateDir.includes('template.yaml')) {
        const template = yaml.load(await fs.readFile(path.join(templatePath, 'template.yaml'), 'utf-8'));
        const errors = [];

        if (!template.name)  errors.push('Missing name');
        if (!template.workflows) errors.push('Missing workflows');
        if (template.workflows.filter(w => (!w.agents) || w.agents.length == 0).length > 0) {
            errors.push('Not all workflows have agents defined');
        }  else if (template.workflows.filter(w => w.agents.filter(ag => !ag.prompt_file).length > 0).length > 0) {
            errors.push('Not all agents have prompt files defined');
        } else {
            // check that all prompt files exist
            for(const agent of template.workflows.flatMap(w => w.agents).map(ag => ag.prompt_file) ) {
                try {
                    const agentFile = await fs.access(path.join(templatePath, agent));
                } catch(error) {
                    errors.push(`cannot access prompt file ${agent}`);
                }
            }
        }
        if (errors.length > 0) {
            console.log(chalk.red(`${file} template not built.\nErrors:\n-------\n${errors.join('\n')}`));
        }  else {
            // build and output the template
            try {
                console.log(chalk.green(`Built template file: ${await packageTemplate(templatePath, OUTPUT_DIRECTORY)}`));
            } catch(error) {
                console.log(chalk.red(`Error building template ${file}: ${error.message}`));
            }
        }
    }  else {
        console.log(chalk.red(`${file} template not built.  Missing template.yaml`));
    }
};

async function packageTemplate(templatePath, outputDirectory) {
    const zip = new JSZip();
    const outputFileName = path.join(outputDirectory, `${path.basename(templatePath)}.agtpl`);
    await addFilesToZip(templatePath);

    // Generate zip buffer and write file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    await fs.writeFile(outputFileName, zipBuffer);
    return outputFileName;

    async function addFilesToZip(directory) {
        const entries = await fs.readdir(directory, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                await addFilesToZip(fullPath);
            } else {
                const fileContent = await fs.readFile(fullPath);
                zip.file(path.relative(templatePath, fullPath), fileContent);
            }
        }
    }
}