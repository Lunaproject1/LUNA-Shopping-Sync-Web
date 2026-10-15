import fs from 'node:fs/promises';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

// Disposable synthetic input for the appendCells contract test; no operational data.
const dir = process.argv[2];
if (!dir) throw Error('Output directory required');
const workbook = Workbook.create();
const sheet = workbook.worksheets.add('Audit');
sheet.getRange('A1:E1').values = [['id', 'text', 'updatedAt', 'amount', 'done']];
sheet.getRange('R2').values = [['SYNTHETIC_ORPHAN']];
sheet.getRange('A1:E1').format.fill = '#EEEEEE';
sheet.getRange('A1:E1').format.font.bold = true;
sheet.getRange('A1:E5').format.columnWidth = 27;
sheet.getRange('R1:R3').format.columnWidth = 27;
workbook.recalculate();
await fs.mkdir(dir, {recursive: true});
const preview = await workbook.render({sheetName: 'Audit', range: 'A1:E4', scale: 1});
await fs.writeFile(dir + '/fixture.png', new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(dir + '/fixture.xlsx');
console.log((await workbook.inspect({kind: 'table', range: 'Audit!A1:E4', include: 'values', maxChars: 1000})).ndjson);
