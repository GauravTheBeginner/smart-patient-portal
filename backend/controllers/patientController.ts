
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get patient information
export const getPatientInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id }
    });
    
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPatient = await prisma.patient.create({
      data: req.body
    });
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update patient information
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: req.body
    });
    
    res.status(200).json(updatedPatient);
  } catch (error: any) {
    console.error('Error updating patient:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
