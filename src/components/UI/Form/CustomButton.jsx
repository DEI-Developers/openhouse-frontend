import Loader from '../Loader';

const CustomButton = ({label, loading, ...props}) => {
  let body = (
    <>
      <span>{label}</span>
    </>
  );

  if (loading) {
    body = (
      <>
        <Loader className="w-5 h-5 mr-2" />
        <span>CARGANDO...</span>
      </>
    );
  }

  return <button {...props}>{body}</button>;
};

export default CustomButton;
