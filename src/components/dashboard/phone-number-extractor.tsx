"use client";
import React, { useState, ChangeEvent, useRef } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PhoneNumberExtractor: React.FC = () => {
  const { toast } = useToast();
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [commaInput, setCommaInput] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const extractPhoneNumbers = (input: string): string[] => {
    const phoneRegex = /(?:\+?234|0)[789]\d{9}/g;
    const matches = input.match(phoneRegex);
    if (!matches) {
      toast({
        title: "Invalid Phone numbers",
        description: "No valid Nigerian phone numbers found",
        variant: "destructive",
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
      if (file.name.endsWith(".csv")) {
        if (typeof content === "string") {
          Papa.parse(content, {
            complete: (results) => {
              const numbers = results.data.flat().join(" ");
              setPhoneNumbers(extractPhoneNumbers(numbers));
            },
          });
        }
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        if (content instanceof ArrayBuffer) {
          const workbook = XLSX.read(new Uint8Array(content), {
            type: "array",
          });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const numbers = data.flat().join(" ");
          setPhoneNumbers(extractPhoneNumbers(numbers));
        }
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDeleteFile = () => {
    setPhoneNumbers([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCommaInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    setCommaInput(input);

    const rawNumbers = input.split(",").map((num) => num.trim());
    const validNumbers: string[] = [];

    rawNumbers.forEach((num) => {
      const extractedNumbers = extractPhoneNumbers(num);
      if (extractedNumbers.length > 0) {
        validNumbers.push(...extractedNumbers);
      } else {
        toast({
          title: "Invalid Number",
          description: `${num} is not a valid Nigerian phone number`,
          variant: "destructive",
        });
      }
    });

    setPhoneNumbers(validNumbers);
  };

  const handleSubmit = () => {
    console.log("Submitting phone numbers:", phoneNumbers);
  };

  return (
    <>
      <Toaster />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Enter Phone Number</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
                <Label htmlFor="file">Upload CSV or Excel file</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={handleDeleteFile}
                  className="text-destructive p-1"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mb-5">
              <Label htmlFor="commaInput">Manual phone number entry</Label>
              <Textarea
                rows={6}
                id="commaInput"
                placeholder="08030823423, 09090399302"
                value={commaInput}
                onChange={handleCommaInput}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Phone Numbers</CardTitle>
            <CardDescription>
              Your entered phone numbers will show here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-5">
              <div className="flex flex-wrap gap-4">
                {phoneNumbers.map((number, index) => (
                  <div
                    key={index}
                    className="p-2 bg-secondary rounded-2xl text-sm text-secondary-foreground"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleSubmit}>Submit Phone Numbers</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PhoneNumberExtractor;
