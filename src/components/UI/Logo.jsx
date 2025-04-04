import {BASE_PATH_URL} from '@config/index';

const Logo = ({className = ''}) => (
  <div className="flex justify-center items-end">
    <img
      src={`${BASE_PATH_URL}/uca-logo.png`}
      className="h-10 w-10 mr-2"
      alt="UCA"
    />
    <div className={`text-lg font-bold ${className}`}>
      <span className="text-primary">Vive la UCA</span>
    </div>
  </div>
);

export default Logo;
