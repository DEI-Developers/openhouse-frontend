import * as yup from 'yup';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomButton from '@components/UI/Form/CustomButton';
import CustomInputPassword from '@components/UI/Form/CustomInputPassword';

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const {register, handleSubmit, formState} = useForm({
    mode: 'onBlur',
    defaultValues: initialData,
    resolver: yupResolver(loginSchema),
  });

  const {isSubmitting, errors} = formState;

  const onLogin = async (data) => {
    setLoading(true);
    setTimeout(() => {
      console.log(data);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full sm:max-w-md pt-6 mx-auto">
      <h1 className="font-bold text-3xl text-center tracking-wide mb-8">
        Nueva contraseña
      </h1>
      <form
        noValidate
        onSubmit={handleSubmit(onLogin)}
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

        <CustomButton
          loading={isSubmitting || loading}
          label="INICIAR SESIÓN"
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
