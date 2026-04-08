import fs from 'fs';
import path from 'path';

const filePath = path.resolve(__dirname, '../Data/shared-data.json');

export const sharedData = {
  get incidentNumber(): string {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data.incidentNumber || '';
    } catch {
      return '';
    }
  },
  set incidentNumber(value: string) {
    fs.writeFileSync(filePath, JSON.stringify({ incidentNumber: value }, null, 2));
  }
};