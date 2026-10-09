import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dummyProjects } from '../assets/assets';
import { Loader2Icon } from 'lucide-react';
import ProjectPreview from './ProjectPreview';
import type { Project } from '../types';
import api from '@/configs/axios';
import { toast } from 'sonner';

const View = () => {
  const { projectId } = useParams();
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCode = async () => {
    try {
      const { data } = await api.get(`/api/project/published/${projectId}`);

      return data.code;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    const loadCode = async () => {
      try {
        const project = await fetchCode();

        setCode(project);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadCode();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2Icon className='size-7 animate-spin text-indigo-200' />
      </div>
    );
  }

  return (
    <div className='h-screen'>
      {code && (
        <ProjectPreview
          project={{ current_code: code } as Project}
          isGenerating={false}
          showEditorPanel={false}
        />
      )}
    </div>
  );
};

export default View;
