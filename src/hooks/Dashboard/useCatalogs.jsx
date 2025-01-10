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
    faculties: data?.faculties ?? [],
  };
};

export default useCatalogs;
