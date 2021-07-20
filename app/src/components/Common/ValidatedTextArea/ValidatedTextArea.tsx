import React from 'react';
import { useState } from 'react';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';
import { IError, isValid } from 'src/types/validation';

interface ValidTextAreaProps {
  label?: string;
  placeholder?: string;
  value: string;
  validation: (value: string) => unknown | IError[];
  onChange: (value: string) => void;
  onLightBackground?: boolean;
  minRow?: number;
  isError?: boolean;
}

export const ValidatedTextArea = ({
  label,
  placeholder,
  value,
  validation,
  onChange,
  onLightBackground = false,
  minRow,
  isError,
}: ValidTextAreaProps) => {
  const [showError, setShowError] = useState(isError);
  const validationResult = validation(value);
  isError = !isValid(validationResult);

  return (
    <>
      <TextArea
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isError={showError && isError}
        onBlur={() => setShowError(true)}
        onLightBackground={onLightBackground}
        minRow={minRow}
      />
      {showError && !isValid(validationResult) && (
        <ValidationResult
          validationResult={validationResult}
          onLightBackground={onLightBackground}
        />
      )}
    </>
  );
};
