import {BASE_PATH_URL} from '@config/index';
import CustomHeader from '@components/UI/CustomHeader';
import ParticipationForm from '@components/Home/ParticipationForm';
import ErrorBoundary from './ErrorBoundary';

const Home = () => {
  return (
    <div className="">
      <CustomHeader title="Formulario de Inscripción" />
      <img
        src={`${BASE_PATH_URL}/uca-header.jpg`}
        className="w-full"
        alt="UCA"
      />
      <ErrorBoundary>
        <ParticipationForm />
      </ErrorBoundary>
    </div>
  );
};

export default Home;
