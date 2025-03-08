import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportTable } from "./import-table";
import { useState } from "react";
import { convertAmountToMiliunits } from "@/lib/utils";
import { format, parse } from "date-fns";

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

interface SelectedColumnState {
  [key: string]: string | null;
}

const requiredOptions = ["date", "payee", "amount"];

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const header = data[0];
  const body = data.slice(1);

  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>(
    {}
  );

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;

      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const onHandleContinue = () => {
    const getColumnIndex = (index: number) => {
      return `column_${index}`;
    };

    const mappedDate = {
      headers: header.map((_header, index) => {
        return selectedColumns[getColumnIndex(index)] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            return selectedColumns[getColumnIndex(index)] ? cell : null;
          });

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedDate.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedDate.headers[index];

        if (header !== null) {
          acc[header] = cell;
        }

        return acc;
      }, {});
    });

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat),
    }));

    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex items-center gap-2 flex-col lg:flex-row">
            <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={progress < requiredOptions.length}
              className="w-full lg:w-auto"
              onClick={onHandleContinue}
            >
              Continue {progress} / {requiredOptions.length}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            header={header}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
