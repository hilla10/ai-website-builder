import { useState, useEffect } from 'react';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import type { Project } from '../types';
import { useNavigate } from 'react-router-dom';
import { dummyProjects } from '../assets/assets';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';

const MyProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const fetchProjects = async () => {
    setProjects(dummyProjects);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    (async () => {
      await fetchProjects();
    })();
  }, []);

  return (
    <>
      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        {loading ? (
          <div className='flex items-center justify-center h-[80vh]'>
            <Loader2Icon className='size-7 animate-spin text-indigo-200' />
          </div>
        ) : projects.length > 0 ? (
          <div className='py-10 min-h-[80vh]'>
            <div className='flex items-center justify-between mb-12'>
              <h1 className='text-2xl font-medium text-white'>My Projects</h1>
              <button onClick={() => navigate('/')} className='gradient-button'>
                {' '}
                <PlusIcon size={18} /> Create New
              </button>
            </div>

            <div className='flex flex-wrap gap-3.5 '>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-[80vh]'>
            <h1 className='text-3xl font-semibold text-gray-300'>
              You have no projects yet!
            </h1>
            <button
              onClick={() => navigate('/')}
              className='text-white px-5 py-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all'>
              Create New
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MyProjects;
