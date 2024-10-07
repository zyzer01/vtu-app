'use client'
import React, { useState, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";

const PhoneNumberExtractor: React.FC = () => {
  const {toast} = useToast()
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState<string>('');

  const extractPhoneNumbers = (input: string): string[] => {
    // This regex matches common phone number formats
    const phoneRegex = /(?:\+?234|0)[789]\d{9}/g;
    const matches = input.match(phoneRegex);
    if (!matches) {
      toast({
        title: "Invalid Phone numbers",
        description: "No valid Nigerian phone numbers found",
        variant: "destructive"
      });
      return [];
    }
    return matches;
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (file.name.endsWith('.csv')) {
        if (typeof content === 'string') {
          Papa.parse(content, {
            complete: (results) => {
              const numbers = results.data.flat().join(' ');
              setPhoneNumbers(extractPhoneNumbers(numbers));
            }
          });
        }
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        if (content instanceof ArrayBuffer) {
          const workbook = XLSX.read(new Uint8Array(content), { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const numbers = data.flat().join(' ');
          setPhoneNumbers(extractPhoneNumbers(numbers));
        }
      }
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleManualInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setManualInput(event.target.value);
    setPhoneNumbers(extractPhoneNumbers(event.target.value));
  };

  const handleSubmit = () => {
    // Here you would call your subscription API with the phoneNumbers array
    console.log('Submitting phone numbers:', phoneNumbers);
  };

  return (
    <div>
      <Toaster />
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">File</Label>
      <Input id="picture" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
    </div>
      <textarea
        value={manualInput}
        onChange={handleManualInput}
        placeholder="Enter phone numbers manually"
      />
      <div>
        <h2>Extracted Phone Numbers:</h2>
        <ul>
          {phoneNumbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      </div>
      <button onClick={handleSubmit}>Submit Phone Numbers</button>
    </div>
  );
};

export default PhoneNumberExtractor;
