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
  textareaLabel?: string;
}

export function ButtonWithPromptModal({
  text,
  onConfirm,
  placeholder,
  children,
  textareaLabel,
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
              <p>{textareaLabel}</p>
              <TextArea
                placeholder={placeholder}
                value={promptAnswer}
                onChange={setPromptAnswer}
                backgroundColor={'White'}
                minRow={5}
              />
            </div>
            <div className={style.groupedButtons}>
              <Button
                color={'White'}
                onClick={confirmAndClose}
                disabled={promptAnswer.length < 3}
              >
                {text}
              </Button>
              <Button color={'Black'} onClick={() => setShowModal(false)}>
                Avbryt
              </Button>
            </div>
          </>
        </Modal>
      )}
    </>
  );
}
