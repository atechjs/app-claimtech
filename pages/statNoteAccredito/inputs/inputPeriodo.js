import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";
import { Controller } from "react-hook-form";
import InputLayout from "./inputLayout";

export default function InputPeriodo({ name, label, control }) {
  return (
    <InputLayout>
      <Controller
        name={name}
        control={control}
        defaultValue={dayjs()}
        rules={{ required: "La data è obbligatoria" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <DatePicker
            label={label}
            format="DD/MM/YYYY"
            value={value}
            control={control}
            onChange={(event) => onChange(event)}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message,
                size: "small",
              },
            }}
          />
        )}
      />
    </InputLayout>
  );
}
