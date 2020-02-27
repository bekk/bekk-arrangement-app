import React from 'react';
import { IError, isIErrorList } from 'src/types/validation';
import { useState } from 'react';
import { ValidationResult } from '../ValidationResult/ValidationResult';
import { TextInput } from '../TextInput/TextInput';

interface ValidTextInputProps {
  label: string;
  placeholder?: string;
  value: string;
  validation: (value: string) => unknown | IError[];
  onChange: (value: string) => void;
}

export const ValidatedTextInput = ({
  label,
  placeholder,
  value,
  validation,
  onChange,
}: ValidTextInputProps) => {
  const errors = validation(value);

  const [hasLostFocus, setLostFocus] = useState(false);
  const shouldShowErrors = hasLostFocus;

  return (
    <>
      <TextInput
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isError={shouldShowErrors && isIErrorList(errors)}
        onBlur={() => setLostFocus(true)}
      />
      {shouldShowErrors && isIErrorList(errors) && (
        <ValidationResult validationResult={errors} />
      )}
    </>
  );
};
