import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import openai from '../configs/openai.js';
// controller function to make revision

export const makeRevision = async (req: Request, res: Response) => {
  const userId = req.userId;

  let creditsCharged = false;
  try {
    const projectId = req.params.projectId;

    const { message } = req.body;

    if (typeof projectId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Please enter a valid prompt' });
    }

    const currentProject = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
      include: {
        versions: true,
      },
    });

    if (!currentProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Charge credits + create user message atomically
    await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.updateMany({
        where: {
          id: userId,
          credits: {
            gte: 5,
          },
        },
        data: {
          credits: {
            decrement: 5,
          },
        },
      });

      if (updatedUser.count === 0) {
        throw new Error('INSUFFICIENT_CREDITS');
      }

      await tx.conversation.create({
        data: {
          role: 'user',
          content: message,
          projectId,
        },
      });
    });

    creditsCharged = true;

    //   Enhance user prompt
    const promptEnhanceResponse = await openai.chat.completions.create({
      model: 'apodex/apodex-1.1-mini:free:free',
      messages: [
        {
          role: 'system',
          content: `You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

        Enhance this by:
        1. Being specific about what elements to change
        2. Mentioning design details (colors, spacing, sizes)
        3. Clarifying the desired outcome
        4. Using clear technical terms

        Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).`,
        },
        {
          role: 'user',
          content: `User's request: ${message}`,
        },
      ],
    });

    const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;

    await prisma.conversation.create({
      data: {
        role: 'assistant',
        content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
        projectId,
      },
    });

    await prisma.conversation.create({
      data: {
        role: 'assistant',
        content: 'Now making changes to your website..',
        projectId,
      },
    });

    //   Generate website code
    const codeGenerationsResponse = await openai.chat.completions.create({
      model: 'apodex/apodex-1.1-mini:free:free',
      messages: [
        {
          role: 'system',
          content: `
You are an expert web developer. 

    CRITICAL REQUIREMENTS:
    - Return ONLY the complete updated HTML code with the requested changes.
    - Use Tailwind CSS for ALL styling (NO custom CSS).
    - Use Tailwind utility classes for all styling changes.
    - Include all JavaScript in <script> tags before closing </body>
    - Make sure it's a complete, standalone HTML document with Tailwind CSS
    - Return the HTML Code Only, nothing else

    Apply the requested changes while maintaining the Tailwind CSS styling approach.`,
        },
        {
          role: 'user',
          content: `Here is the current website code: "${currentProject.current_code}" The user wants this changes: "${enhancedPrompt} "`,
        },
      ],
    });

    const cleanGeneratedCode = (code: string) => {
      return code
        .replace(/^```html\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    };

    const code = cleanGeneratedCode(
      codeGenerationsResponse.choices[0].message.content || '',
    );

    if (!code) {
      await prisma.conversation.create({
        data: {
          role: 'assistant',
          content:
            "I'm sorry, but I couldn't generate the updated code. Please try again with a different prompt.",
          projectId,
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: 5,
          },
        },
      });
      return;
    }

    const version = await prisma.version.create({
      data: {
        code: code,
        description: 'changes made',
        projectId,
      },
    });

    await prisma.conversation.create({
      data: {
        role: 'assistant',
        content:
          "I've made the changes to your website! You can now preview it.",
        projectId,
      },
    });

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        current_code: code,
        current_version_index: version.id,
      },
    });

    res.status(200).json({ message: 'Changes made successfully' });
  } catch (error: any) {
    console.error(error);

    if (error.message === 'INSUFFICIENT_CREDITS') {
      return res.status(403).json({
        message: 'Add more credits to make changes.',
      });
    }

    if (creditsCharged) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: 5,
          },
        },
      });
    }

    return res.status(500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

// controller function to rollback to a specific version

interface VersionReference {
  id: string;
}

export const rollbackToVersion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { projectId, versionId } = req.params;

    if (typeof projectId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
      include: { versions: true },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const version = project.versions.find(
      (version: VersionReference) => version.id === versionId,
    );

    if (!version) {
      return res.status(404).json({ message: 'Version not found.' });
    }

    await prisma.websiteProject.update({
      where: { id: projectId, userId },
      data: {
        current_code: version.code,
        current_version_index: version.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: 'assistant',
        content:
          "I've rolled back your website to selected version. You can not preview it.",
        projectId,
      },
    });

    res.status(200).json({ message: 'Version rolled back' });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

// controller function to delete project

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (typeof projectId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await prisma.websiteProject.delete({
      where: { id: projectId, userId },
    });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

// controller for getting project code preview

export const getProjectPreview = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (typeof projectId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId, userId },
      include: { versions: true },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

// get published projects

export const getPublishedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.websiteProject.findMany({
      where: { isPublished: true },
      include: { user: true },
    });

    res.status(200).json({ projects });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

// get a single project by id

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (typeof projectId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId },
    });

    if (!project || project.isPublished === false || !project?.current_code) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json({ code: project.current_code });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

// controller to save project code

export const saveProjectCode = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;
    const { code } = req.body;

    if (typeof projectId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        current_code: code,
        current_version_index: '',
      },
    });

    res.status(200).json({
      code: project.current_code,
      message: 'Project Saved Successfully.',
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};
