import {Helmet} from 'react-helmet-async';

const CustomHeader = ({title}) => {
  const customTitle = `${title} - Vive la UCA`;
  return (
    <Helmet>
      <title>{customTitle}</title>
      <meta property="og:title" content={customTitle} />
    </Helmet>
  );
};

export default CustomHeader;
