import React from 'react';
import { Result } from 'src/types/validation';
import { useState } from 'react';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';

interface ValidTextAreaProps {
  label: string;
  placeholder?: string;
  value: Result<string, any>;
  onChange: (value: string) => void;
}

export const ValidatedTextArea = ({
  label,
  placeholder,
  value,
  onChange,
}: ValidTextAreaProps) => {
  const [hasLostFocus, setLostFocus] = useState(false);
  const shouldShowErrors = hasLostFocus;
  return (
    <>
      <TextArea
        label={label}
        placeholder={placeholder}
        value={value.editValue}
        onChange={onChange}
        isError={shouldShowErrors && Boolean(value.errors)}
        onBlur={() => setLostFocus(true)}
      />
      {shouldShowErrors && <ValidationResult validationResult={value.errors} />}
    </>
  );
};
