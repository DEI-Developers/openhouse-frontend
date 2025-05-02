import * as yup from 'yup';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import CustomButton from '@components/UI/Form/CustomButton';
import forgotPassword from '@services/Auth/forgotPassword';
import CustomErrorAlert from '@components/UI/CustomErrorAlert';
import CustomSuccessAlert from '@components/UI/CustomSuccessAlert';

const ForgotPasswordForm = () => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {register, handleSubmit, formState} = useForm({
    mode: 'onBlur',
    defaultValues: initialData,
    resolver: yupResolver(loginSchema),
  });

  const {isSubmitting, errors} = formState;

  const onForgotPassword = async (data) => {
    setLoading(true);
    setError(false);
    setSuccess(false);

    forgotPassword(data)
      .then((response) => {
        if (response.success) {
          setSuccess(true);
        } else {
          setError(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full sm:max-w-md pt-6 mx-auto">
      <h1 className="font-bold text-3xl text-center tracking-wide mb-1">
        Recuperar contraseña
      </h1>
      <p className="text-center text-secondary mb-8">
        Para recuperar su contraseña por favor ingrese su correo electrónico
      </p>
      <form
        noValidate
        onSubmit={handleSubmit(onForgotPassword)}
        autoComplete="off"
        className="w-full space-y-4"
      >
        <CustomInput
          type="text"
          name="email"
          label="Correo electrónico"
          error={errors.email}
          disabled={isSubmitting || loading}
          register={register}
          placeholder="00084417@uca.edu.sv"
        />

        {success && (
          <CustomSuccessAlert
            message="Se ha enviado un correo electrónico con instrucciones para restablecer su contraseña."
            onClose={() => setSuccess(false)}
          />
        )}

        {error && (
          <CustomErrorAlert
            message="No se pudo enviar el correo electrónico. Por favor, verifique su dirección de correo."
            onClose={() => setError(false)}
          />
        )}

        <CustomButton
          loading={isSubmitting || loading}
          label="ENVIAR"
          className="w-full flex justify-center items-center bg-primary text-white text-sm font-bold py-3.5 rounded-lg"
        />
      </form>
    </div>
  );
};

const initialData = {email: ''};

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Campo obligatorio.')
    .email('Dirección de correo no válida.'),
});

export default ForgotPasswordForm;
