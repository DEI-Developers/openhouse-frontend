import {useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import ParticipationForm from '@components/Home/ParticipationForm';
import DynamicForm from '@components/Home/DynamicForm';
import getEnrollmentCatalogs from '@services/getEnrollmentCatalogs';

const Registration = () => {
  const {id} = useParams();

  const {data, isError} = useQuery({
    queryKey: ['enrollmentCatalogs', id],
    queryFn: () => getEnrollmentCatalogs(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  // If formTemplate exists and is active, render DynamicForm
  if (data?.formTemplate) {
    return (
      <DynamicForm
        template={data.formTemplate}
        enrollmentForm={data}
        targetAudienceImage={data.targetAudience?.image}
      />
    );
  }

  // Otherwise render the hardcoded ParticipationForm
  return <ParticipationForm targetAudienceId={id} />;
};

export default Registration;