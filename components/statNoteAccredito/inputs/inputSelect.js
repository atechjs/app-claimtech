import React from "react";
import InputLayout from "./inputLayout";
import MyReactSelect from "../../../components/my-react-select-impl/myReactSelect";

export default function InputSelect({ name, label, options, control }) {
  return (
    <InputLayout>
      {options ? (
        <MyReactSelect
          control={control}
          name={name}
          label={label}
          options={options}
          autosize={true}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          labelPosition={"left"}
        />
      ) : null}
    </InputLayout>
  );
}
