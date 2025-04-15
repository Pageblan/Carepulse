"use server"

import { Medicine } from '@/types/appwrite.types';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { API_KEY, DATABASE_ID, databases, MEDICINE_ID, PROJECT_ID } from '../appwrite.config';
import { parseStringify } from '../utils';
 
export const listMedicines = async (): Promise<Medicine[]> => {
  try {
    const response = await databases.listDocuments<Medicine>(DATABASE_ID!, MEDICINE_ID!);
    return response.documents;
  } catch (error) {
    console.error("An error occurred while retrieving the medicine details:", error);
    return [];
  }
};

export const getMedicineById = async (id: string) => {
  try {
    const response = await databases.getDocument(DATABASE_ID!, MEDICINE_ID!, id);
    return parseStringify (response); // Return the medicine details
  } catch (error) {
    console.error("An error occurred while retrieving the medicine details:", error);
    return null; // Return null if an error occurs
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const apiUrl = decodeURIComponent(url);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Appwrite-Project': PROJECT_ID!,
        'X-Appwrite-Key': API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('image')) {
      throw new Error('The requested resource is not a valid image');
    }

    const imageBuffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error fetching image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}

export const loadimage = async (imageUrl: string, elementId:string) => {
  try {
    if (true) { // You can add your API key check here
      const response = await fetch(imageUrl, {
        headers: {
          'X-Appwrite-Project': process.env.NEXT_PUBLIC_PROJECT_ID!,
          'X-Appwrite-Key': process.env.NEXT_PUBLIC_API_KEY!,
        }
      });
  
      if (!response.ok) {
        throw new Error('Image fetch failed');
      }
    
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (document) {
        const imageDiv = document.getElementById(elementId) as HTMLImageElement;
        if (imageDiv) imageDiv.src = url;
      } 
    } else {
      throw new Error("AppWrite API key must be provided.")
    }
  } catch (ex) {
    console.error(ex);
  }
};