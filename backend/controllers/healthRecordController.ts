import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

// Define a custom Request type with user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Get all health records for a patient
export const getHealthRecords = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = req.query.patientId as string;
    
    if (!patientId) {
      res.status(400).json({ error: 'Patient ID is required' });
      return;
    }

    const records = await prisma.healthRecord.findMany({
      where: {
        patientId: patientId
      },
      include: {
        attachments: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching health records:', error);
    res.status(500).json({ error: 'Failed to fetch health records' });
  }
};

// Get a single health record
export const getHealthRecord = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recordId = req.params.id;

    const record = await prisma.healthRecord.findUnique({
      where: {
        id: recordId
      },
      include: {
        attachments: true,
        sharedWith: true
      }
    });

    if (!record) {
      res.status(404).json({ error: 'Health record not found' });
      return;
    }

    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching health record:', error);
    res.status(500).json({ error: 'Failed to fetch health record' });
  }
};

// Create a new health record
export const createHealthRecord = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, type, date, provider, content, patientId, attachments } = req.body;

    if (!patientId) {
      res.status(400).json({ error: 'Patient ID is required' });
      return;
    }

    // Create the health record
    const newRecord = await prisma.healthRecord.create({
      data: {
        title,
        type,
        date: new Date(date),
        provider,
        content,
        patientId,
        // Create attachments if provided
        attachments: attachments ? {
          create: attachments
        } : undefined
      },
      include: {
        attachments: true
      }
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating health record:', error);
    res.status(500).json({ error: 'Failed to create health record' });
  }
};

// Update a health record
export const updateHealthRecord = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recordId = req.params.id;
    const { title, type, date, provider, content, shared } = req.body;

    const updatedRecord = await prisma.healthRecord.update({
      where: {
        id: recordId
      },
      data: {
        title,
        type,
        date: date ? new Date(date) : undefined,
        provider,
        content,
        shared
      }
    });

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error updating health record:', error);
    res.status(500).json({ error: 'Failed to update health record' });
  }
};

// Delete a health record
export const deleteHealthRecord = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recordId = req.params.id;

    // First delete all attachments and shared accesses
    await prisma.attachment.deleteMany({
      where: {
        healthRecordId: recordId
      }
    });

    await prisma.sharedAccess.deleteMany({
      where: {
        healthRecordId: recordId
      }
    });

    // Then delete the health record
    await prisma.healthRecord.delete({
      where: {
        id: recordId
      }
    });

    res.status(200).json({ message: 'Health record deleted successfully' });
  } catch (error) {
    console.error('Error deleting health record:', error);
    res.status(500).json({ error: 'Failed to delete health record' });
  }
};

// Share a health record
export const shareHealthRecord = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recordId = req.params.id;
    const { email, viewPermission, downloadPermission, resharePermission, expiration } = req.body;

    // Check if the record exists
    const record = await prisma.healthRecord.findUnique({
      where: {
        id: recordId
      }
    });

    if (!record) {
      res.status(404).json({ error: 'Health record not found' });
      return;
    }

    // Check if sharing already exists
    const existingShare = await prisma.sharedAccess.findUnique({
      where: {
        email_healthRecordId: {
          email,
          healthRecordId: recordId
        }
      }
    });

    let sharedAccess;

    if (existingShare) {
      // Update existing sharing
      sharedAccess = await prisma.sharedAccess.update({
        where: {
          id: existingShare.id
        },
        data: {
          viewPermission: viewPermission ?? true,
          downloadPermission: downloadPermission ?? false,
          resharePermission: resharePermission ?? false,
          expiration: expiration ? new Date(expiration) : null
        }
      });
    } else {
      // Create new sharing
      sharedAccess = await prisma.sharedAccess.create({
        data: {
          email,
          healthRecordId: recordId,
          viewPermission: viewPermission ?? true,
          downloadPermission: downloadPermission ?? false,
          resharePermission: resharePermission ?? false,
          expiration: expiration ? new Date(expiration) : null
        }
      });
    }

    // Update the record shared status
    await prisma.healthRecord.update({
      where: {
        id: recordId
      },
      data: {
        shared: true
      }
    });

    res.status(200).json(sharedAccess);
  } catch (error) {
    console.error('Error sharing health record:', error);
    res.status(500).json({ error: 'Failed to share health record' });
  }
};

// Get shared health records
export const getSharedRecords = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userEmail = req.query.email as string;
    
    if (!userEmail) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const sharedRecords = await prisma.sharedAccess.findMany({
      where: {
        email: userEmail,
        // Only include records that haven't expired
        OR: [
          { expiration: null },
          { expiration: { gt: new Date() } }
        ]
      },
      include: {
        healthRecord: {
          include: {
            patient: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(200).json(sharedRecords);
  } catch (error) {
    console.error('Error fetching shared records:', error);
    res.status(500).json({ error: 'Failed to fetch shared records' });
  }
};

// Remove sharing
export const removeSharing = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shareId = req.params.id;

    await prisma.sharedAccess.delete({
      where: {
        id: shareId
      }
    });

    res.status(200).json({ message: 'Sharing removed successfully' });
  } catch (error) {
    console.error('Error removing sharing:', error);
    res.status(500).json({ error: 'Failed to remove sharing' });
  }
};
