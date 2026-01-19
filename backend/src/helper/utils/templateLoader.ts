import * as fs from 'fs';
import * as path from 'path';

export function loadTemplate(fileName: string): string {
//   const templatePath = path.join(__dirname, '../../', 'template', fileName);
const templatePath = path.join(__dirname, '../../template', fileName);
  
  try {
    return fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    console.error(`Error reading template file: ${fileName}`, error);
    throw new Error('Template file not found.');
  }
}
