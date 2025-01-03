import {createPortal} from 'react-dom';
import {useRef, useEffect, useState} from 'react';

const ReactPortal = ({children, selector}) => {
  const ref = useRef(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMount(true);
  }, [selector]);

  return mount ? createPortal(children, ref.current) : null;
};

export default ReactPortal;
