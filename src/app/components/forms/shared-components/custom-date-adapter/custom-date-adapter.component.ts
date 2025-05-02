// custom-date-adapter.ts
import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  parse(value: string): Date | null {
    if (!value) return null;
    
    // Parse date in DD/MM/YYYY format
    const parts = value.split('/');
    if (parts.length === 3) {
      let day = Number(parts[0]);
      let month = Number(parts[1]) - 1; // Month is 0-indexed in JavaScript Date
      let year = Number(parts[2]);
      if(day < 1 || day > 31) day = 1;
      if(month < 0 || month > 11) month = 1;
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const date = new Date(year, month, day);
        return date;
      }
    }
    return super.parse(value);
  }

  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      // Ensure two-digit format for day and month
      const dayStr = day.toString().padStart(2, '0');
      const monthStr = month.toString().padStart(2, '0');
      
      return `${dayStr}/${monthStr}/${year}`;
    }
    return super.format(date, displayFormat);
  }
}