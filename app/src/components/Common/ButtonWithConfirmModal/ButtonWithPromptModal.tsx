import React, { useState } from 'react';
import { Button } from 'src/components/Common/Button/Button';
import { Modal } from 'src/components/Common/Modal/Modal';
import { ReactChild } from 'src/types';
import style from './ButtonWith.module.scss';
import { TextArea } from 'src/components/Common/TextArea/TextArea';

interface IProps {
  text: string;
  onConfirm: (promptAnswer: string) => void;
  children: ReactChild | ReactChild[];
  placeholder?: string;
}

export function ButtonWithPromptModal({
  text,
  onConfirm,
  placeholder,
  children,
}: IProps) {
  const [showModal, setShowModal] = useState(false);
  const [promptAnswer, setPromptAnswer] = useState('');

  const confirmAndClose = () => {
    onConfirm(promptAnswer);
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>{text}</Button>
      {showModal && (
        <Modal header={text} closeModal={() => setShowModal(false)}>
          <>
            {children}
            <div className={style.textArea}>
              <TextArea
                placeholder={placeholder}
                value={promptAnswer}
                onChange={(event) => setPromptAnswer(event)}
                backgroundColor={'White'}
                minRow={5}
              />
            </div>
            <Button
              color={'White'}
              onClick={confirmAndClose}
              disabled={promptAnswer.length < 3}
            >
              {text}
            </Button>
          </>
        </Modal>
      )}
    </>
  );
}
