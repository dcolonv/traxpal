'use server';

import { CategorizationRuleType } from '@/lib/types/categorization_rules';
import { RuleTypeEnum } from '@/lib/types/enums';
import {
  StatementHeaderType,
  StatementInformationType,
  StatementTransactionType,
  StatementType,
} from '@/lib/types/statements';
import { parse } from 'date-fns';
import { extractFileDetailLinesClaude } from '../ai/bank_details';
import { fetchAllCategorizationRules } from '../database/categorization_rules';

const applyCategorizationRules = (
  transactions: StatementType[],
  categorization_rules: CategorizationRuleType[],
): StatementTransactionType[] => {
  return transactions.map((trx) => {
    for (const rule of categorization_rules) {
      let isRuleApplied = false;
      if (rule.rule === RuleTypeEnum.start_with) {
        isRuleApplied = trx.description.startsWith(rule.criteria);
      } else if (rule.rule === RuleTypeEnum.contains) {
        isRuleApplied = trx.description.includes(rule.criteria);
      }

      if (isRuleApplied) {
        return {
          date: trx.date,
          description: trx.description,
          credit: trx.credit,
          debit: trx.debit,
          reference: trx.reference,
          category: rule.category,
          subcategory: rule.subcategory,
        };
      }
    }

    return {
      date: trx.date,
      description: trx.description,
      credit: trx.credit,
      debit: trx.debit,
      reference: trx.reference,
    };
  });
};

const contentToTransactions = (
  content: string[],
  {
    header,
    firstLine,
    lastLine,
    separator,
    headerSeparator,
    dateFormat,
    headers,
  }: {
    header: string;
    firstLine: string;
    lastLine: string;
    separator: string;
    headerSeparator: string;
    dateFormat: string;
    headers: StatementHeaderType;
  },
) => {
  const headerIndex = content.findIndex((line) =>
    line.trim().startsWith(header.trim()),
  );

  if (headerIndex === -1) {
    console.error("Couldn't find the correct headers of bank movement details");
    throw new Error(
      "Couldn't find the correct headers of bank movement details",
    );
  }

  const startIndex = content.findIndex((line) =>
    line.trim().startsWith(firstLine.trim()),
  );

  if (startIndex === -1) {
    console.error("Couldn't find the correct start of bank movement details");
    throw new Error("Couldn't find the correct start of bank movement details");
  }

  const endIndex = content.findIndex((line) =>
    line.trim().startsWith(lastLine.trim()),
  );

  if (endIndex === -1) {
    console.error("Couldn't find the correct end of bank movement details");
    throw new Error("Couldn't find the correct end of bank movement details");
  }

  // It swap headers, convert the object from {date: 'Fecha'} to {Fecha: 'date'}
  const flippedHeaders = Object.keys(headers).reduce(
    (obj, h) => {
      return { ...obj, [headers[h as keyof typeof headers]]: h };
    },
    {} as { [key: string]: string },
  );

  const headerLine = content[headerIndex];

  // fileHeaders will get an array of strings ie. ['Fecha', 'Description', 'Credito', 'Debito']
  const fileHeaders: string[] =
    // if header separator is diffent of the rest of file separator, then separate and filter (this has to be done for desyfin file, format does not match headers with rest of the file)
    headerSeparator !== separator
      ? headerLine
          .split(headerSeparator)
          .filter((header) => !!header.trim())
          .map((header) => header.trim())
      : headerLine.split(headerSeparator).map((header) => header.trim());

  // Get content from first line to last line
  const contentLines = content.slice(startIndex, endIndex + 1);

  const transactions = contentLines.map((contentLine) => {
    // statement get an array of strings with content ie. ['10 Junio 2020', 'Transferencia a Pedro', '1000', '0'];
    const statement = contentLine.split(separator);
    // convert statement array into an object matching fileHeader index with statement index
    const mappedTransaction = fileHeaders.reduce(
      (statementObj, fileHeader, idx) => {
        // match fileHeader header with transaction header => {Fecha: 'date'}
        if (flippedHeaders[fileHeader]) {
          // return {...obj, 'date': '10 Junio 2020'}
          if (flippedHeaders[fileHeader] === 'date') {
            return {
              ...statementObj,
              [flippedHeaders[fileHeader]]: parse(
                statement[idx]?.trim() || '',
                dateFormat,
                new Date(),
              ),
            };
          }
          return {
            ...statementObj,
            [flippedHeaders[fileHeader]]: statement[idx]?.trim() || '',
          };
        }
        return statementObj;
      },
      {} as StatementType,
    );

    return mappedTransaction;
  });

  return transactions;
};

export const processBankStatementFileContent = async (
  content: string[],
): Promise<{
  bank_transactions: StatementTransactionType[];
  information: StatementInformationType;
}> => {
  const {
    header,
    firstLine,
    lastLine,
    separator,
    headerSeparator,
    dateFormat,
    headers,
    information,
  }: {
    header: string;
    firstLine: string;
    lastLine: string;
    separator: string;
    headerSeparator: string;
    dateFormat: string;
    headers: StatementHeaderType;
    information: StatementInformationType;
  } = await extractFileDetailLinesClaude(content);

  const transactions = contentToTransactions(content, {
    header,
    firstLine,
    lastLine,
    separator,
    headerSeparator,
    dateFormat,
    headers,
  });

  const { categorization_rules } = await fetchAllCategorizationRules();

  const categorizedBankTransactions = applyCategorizationRules(
    transactions,
    categorization_rules,
  );

  return {
    bank_transactions: categorizedBankTransactions,
    information,
  };
};
