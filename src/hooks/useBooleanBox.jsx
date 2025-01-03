import {useState} from 'react';

const useBooleanBox = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const onToggleBox = () => setIsOpen((prevState) => !prevState);

  const onClose = () => setIsOpen(false);

  return {isOpen, onToggleBox, onClose};
};

export default useBooleanBox;
