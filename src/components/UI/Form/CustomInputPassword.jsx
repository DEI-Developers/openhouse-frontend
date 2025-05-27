import {useState} from 'react';
import CustomInput from './CustomInput';
import {IoEye, IoEyeOutline} from 'react-icons/io5';

const CustomInputPassword = ({
  label = 'Contraseña',
  name = 'password',
  errors,
  register,
  isSubmitting,
  containerClassName = '',
  ...props
}) => {
  const [passwordIsHidden, setPasswordIsHidden] = useState(true);

  const toogleHiddenPassword = () => setPasswordIsHidden((show) => !show);

  return (
    <div className={`relative ${containerClassName}`}>
      <CustomInput
        type={passwordIsHidden ? 'password' : 'text'}
        name={name}
        label={label}
        error={errors.password}
        disabled={isSubmitting}
        register={register}
        placeholder="********"
        {...props}
      />
      <button
        type="button"
        className="absolute right-4 top-9"
        onClick={toogleHiddenPassword}
      >
        {passwordIsHidden ? (
          <IoEyeOutline size={22} className="text-gray-500" />
        ) : (
          <IoEye size={22} className="text-primary" />
        )}
      </button>
    </div>
  );
};

export default CustomInputPassword;
