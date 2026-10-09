import { Link } from 'react-router-dom';
import type { Project } from '../types';

interface CommunityProps {
  project: Project;
}

const CommunityCard = ({ project }: CommunityProps) => {
  

  return (
    <Link
      key={project.id}
      to={`/view/${project.id}`}
      target='_blank'
      className='community group'>
      {/* Desktop-like mini preview */}
      <div className='relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800 '>
        {project.current_code ? (
          <iframe
            srcDoc={project.current_code}
            className='absolute top-0 left-0 w-300 h-200 origin-top-left pointer-events-none '
            sandbox='allow-scripts allow-same-origin'
            style={{ transform: 'scale(0.25)' }}
          />
        ) : (
          <div className='flex items-center justify-center h-full text-gray-500 '>
            <p> No preview</p>
          </div>
        )}
      </div>
      {/* content */}
      <div className='p-4 text-white bg-linear-180 from-transparent group-hover:from-indigo-950 to-transparent transition-colors '>
        <div className='flex items-start justify-between '>
          <h2 className='text-lg font-medium line-clamp-2'>{project.name}</h2>
          <button className='px-2.5 py-0.5 mt-1 ml-2 text-xs bg-gray-800 border border-gray-700 rounded-full '>
            Website
          </button>
        </div>
        <p className='text-gray-400 mt-1 text-sm line-clamp-2'>
          {project.initial_prompt}
        </p>

        <div className='flex justify-between items-center mt-6 '>
          <span className='text-xs text-gray-500'>
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <div className='flex gap-3 text-white text-sm'>
            <button className='px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-colors flex items-center gap-2 '>
              <span className='bg-gray-200 size-4.5 rounded-full text-black font-semibold flex items-center justify-center'>
                {project.user?.name?.slice(0, 1)}
              </span>
              {project.user?.name}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
