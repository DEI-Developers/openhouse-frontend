import {Link, useNavigate} from 'react-router-dom';
import {GoChevronRight, GoChevronLeft} from 'react-icons/go';

const Breadcrumb = ({pageName}) => {
  const navigate = useNavigate();

  return (
    <div>
      <nav aria-label="Back" className="sm:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-primary hover:text-gray-700"
        >
          <GoChevronLeft
            aria-hidden="true"
            className="-ml-1 mr-1 size-5 shrink-0 text-primary"
          />
          Regresar
        </button>
      </nav>
      <nav aria-label="Breadcrumb" className="hidden sm:flex">
        <ol role="list" className="flex items-center space-x-1">
          <li>
            <div className="flex">
              <Link
                to="/plataforma"
                className="text-sm font-medium text-primary hover:text-gray-700 hover:underline"
              >
                Plataforma
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <GoChevronRight
                aria-hidden="true"
                className="size-5 shrink-0 text-primary"
              />
              <p className="ml-1 text-sm font-medium text-primary hover:text-gray-700">
                {pageName}
              </p>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
