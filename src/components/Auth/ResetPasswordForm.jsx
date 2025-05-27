import * as yup from 'yup';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate, useParams} from 'react-router-dom';
import passwordReset from '@services/Auth/passwordReset';
import CustomButton from '@components/UI/Form/CustomButton';
import CustomErrorAlert from '@components/UI/CustomErrorAlert';
import CustomSuccessAlert from '@components/UI/CustomSuccessAlert';
import CustomInputPassword from '@components/UI/Form/CustomInputPassword';

const ResetPasswordForm = () => {
  const {token} = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {register, handleSubmit, formState} = useForm({
    mode: 'onBlur',
    defaultValues: initialData,
    resolver: yupResolver(loginSchema),
  });

  const {isSubmitting, errors} = formState;

  const onResetPassword = async (data) => {
    setLoading(true);
    setError(false);
    setSuccess(false);

    passwordReset({
      token: token,
      password: data.password,
      passwordConfirmation: data.confirmPassword,
    })
      .then((response) => {
        if (response.success) {
          setSuccess(true);
          navigate('/iniciar-sesion');
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
      <h1 className="font-bold text-3xl text-center tracking-wide mb-8">
        Nueva contraseña
      </h1>
      <form
        noValidate
        onSubmit={handleSubmit(onResetPassword)}
        autoComplete="off"
        className="w-full space-y-4"
      >
        <CustomInputPassword
          errors={errors}
          register={register}
          isSubmitting={isSubmitting || loading}
        />

        <CustomInputPassword
          label="Confirmar contraseña"
          name="confirmPassword"
          errors={errors}
          register={register}
          isSubmitting={isSubmitting || loading}
        />

        {success && (
          <CustomSuccessAlert
            message="Su contraseña ha sido actualizada correctamente."
            onClose={() => setSuccess(false)}
          />
        )}

        {error && (
          <CustomErrorAlert
            message="Ocurrió un error al intentar actualizar su contraseña."
            onClose={() => setError(false)}
          />
        )}

        <CustomButton
          loading={isSubmitting || loading}
          label="ACTUALIZAR CONTRASEÑA"
          className="w-full flex justify-center items-center bg-primary text-white text-sm font-bold py-3.5 rounded-lg"
        />
      </form>
    </div>
  );
};

const initialData = {password: '', confirmPassword: ''};

const loginSchema = yup.object().shape({
  password: yup.string().required('Campo obligatorio.'),
  confirmPassword: yup.string().required('Campo obligatorio.'),
});

export default ResetPasswordForm;
