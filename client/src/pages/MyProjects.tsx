import { useState, useEffect } from 'react';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import type { Project } from '../types';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import api from '@/configs/axios';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

const MyProjects = () => {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/user/projects');
      return data.projects;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const confirm = window.confirm(
        'Are you sure you want to delete this project? This action cannot be undone.',
      );
      if (!confirm) return;
      const { data } = await api.delete(`/api/project/${projectId}`);
      toast.success(data.message);
      await fetchProjects();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      navigate('/');
      toast('Please login to view your projects');
      return;
    }
    let cancelled = false;
    const loadProjects = async () => {
      try {
        const projects = await fetchProjects();

        if (cancelled) return;

        setProjects(projects);
      } catch (error) {
        if (!cancelled) {
          console.error(error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [isPending, navigate, projects, session?.user]);

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
                <ProjectCard
                  key={project.id}
                  project={project}
                  deleteProject={deleteProject}
                />
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
