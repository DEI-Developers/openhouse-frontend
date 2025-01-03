import Loader from '../Loader';

const SubmitButton = ({Icon = null, type, label, loading, ...rest}) => {
  let buttonText = (
    <>
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </>
  );

  if (loading) {
    buttonText = (
      <>
        <Loader className="h-5 w-5" />
        <span>Cargando...</span>
      </>
    );
  }

  return (
    <button type={type} {...rest}>
      {buttonText}
    </button>
  );
};

export default SubmitButton;
