import * as yup from 'yup';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import CustomButton from '@components/UI/Form/CustomButton';
import CustomInputPassword from '@components/UI/Form/CustomInputPassword';

const LoginForm = () => {
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
      <h1 className="font-bold text-3xl text-center tracking-wide mb-1">
        Iniciar Sesión
      </h1>
      <p className="text-center text-secondary mb-8">
        Ingrese su correo y contraseña para iniciar sesión
      </p>
      <form
        noValidate
        onSubmit={handleSubmit(onLogin)}
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

        <CustomInputPassword
          errors={errors}
          register={register}
          isSubmitting={isSubmitting || loading}
        />

        <CustomButton
          loading={isSubmitting || loading}
          label="INICIAR SESIÓN"
          className="w-full flex justify-center items-center bg-primary text-white text-sm font-bold py-3.5 rounded-lg"
        />

        <Link
          to="/recuperar-contraseña"
          className="text-primary text-xs font-bold text-right"
        >
          ¿Olvido su contraseña?
        </Link>
      </form>
    </div>
  );
};

const initialData = {email: '', password: ''};

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Campo obligatorio.')
    .email('Dirección de correo no válida.'),
  password: yup
    .string()
    .required('Campo obligatorio.')
    .min(6, 'Mínimo 6 caracteres.'),
});

export default LoginForm;
