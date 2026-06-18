import {useParams} from 'react-router-dom';
import ParticipationForm from '@components/Home/ParticipationForm';

const Registration = () => {
  const {id} = useParams();
  return <ParticipationForm targetAudienceId={id} />;
};

export default Registration;