import { useState } from "react";

export function useFormType() {
  const [formType, setFormType] = useState("");
  ``;
  const handleFormType: Function = () => {
    setFormType(newFormType);
  };

  return [formType, handleFormType];
}

export default useFormType;
// Use use reducer
