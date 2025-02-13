import {useQuery} from '@tanstack/react-query';
import getCatalogs from '@services/getCatalogs';

const useCatalogs = () => {
  const {data} = useQuery({
    queryKey: ['catalogs'],
    queryFn: getCatalogs,
    refetchOnWindowFocus: false,
  });

  return {
    roles: data?.roles ?? [],
    permissions: data?.permissions ?? [],
    events: data?.events ?? [],
    faculties: data?.faculties ?? [],
    careers: data?.careers ?? [],
    lastEvent: data?.events?.length > 0 ? data.events[0] : null,
  };
};

export default useCatalogs;
