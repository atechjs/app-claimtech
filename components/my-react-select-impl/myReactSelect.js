import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

export default function MyReactSelect({
  control,
  label,
  name,
  validation,
  options,
  isClearable,
  isDisabled,
  isLoading,
  isMulti,
  isSearchable,
  isCreatable,
  menuPosition,
  isFullWidth,
  styles,
  autoFocus,
  autoSize,
  menuPortalTarget,
}) {
  const [allOptions, setAllOptions] = useState(options);
  useEffect(() => {
    setAllOptions(options);
  }, [options]);

  function getChangedValue({ isMulti, newValue }) {
    if (!newValue) {
      return null;
    }
    if (isMulti) {
      return newValue.map((v) => v.value);
    }
    return newValue.value;
  }

  function getInternalValue({ allOptions, isMulti, value }) {
    if (isMulti) {
      if (!value) {
        return null;
      }
      return value
        .map((optionValue) =>
          allOptions.find((option) => option.value === optionValue)
        )
        .reduce((valueItems, valueItem) => {
          if (!valueItem) {
            return valueItems;
          }

          return [...valueItems, valueItem];
        }, []);
    }

    return allOptions.find((option) => option.value === value) || null;
  }

  function handleNewOption({ isMulti, isCreatable, newValue, setAllOptions }) {
    if (isCreatable && newValue) {
      if (isMulti) {
        newValue.forEach((newOption) => {
          if ("__isNew__" in newOption && newOption.__isNew__) {
            setAllOptions((prevOptions) => [...prevOptions, newOption]);
          }
        });
      } else {
        if (newValue && "__isNew__" in newValue && newValue.__isNew__) {
          setAllOptions((prevOptions) => [...prevOptions, newValue]);
        }
      }
    }
  }
  return (
    <Stack direction={"column"}>
      <Typography variant="button">{label}</Typography>
      <Controller
        control={control}
        name={name}
        rules={validation}
        render={({ field: { onChange, value, ...field } }) => {
          function handleChange(newValue) {
            handleNewOption({ isCreatable, isMulti, newValue, setAllOptions });
            onChange(getChangedValue({ isMulti, newValue }));
          }

          const internalValue = getInternalValue({
            allOptions,
            isMulti,
            value,
          });

          return (
            <Select
              isRequired={Boolean(validation?.required)}
              isClearable={isClearable}
              isDisabled={isDisabled}
              isLoading={isLoading}
              isMulti={isMulti}
              isSearchable={isSearchable}
              options={options}
              onChange={handleChange}
              value={internalValue}
              menuPosition={menuPosition}
              styles={styles}
              noOptionsMessage={() => "Nessun opzione"}
              isFullWidth={isFullWidth}
              autoFocus={autoFocus}
              autosize={autoSize}
              menuPortalTarget={menuPortalTarget}
              {...field}
            />
          );
        }}
      />
    </Stack>
  );
}
