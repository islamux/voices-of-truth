import { NextApiRequest, NextApiResponse } from 'next';
import AvatarService from '@/services/avatarService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (typeof userId !== 'string') {
    return res.status(400).json({ error: 'معرف المستخدم غير صالح' });
  }

  try {
    const avatarUrl = await AvatarService.getAvatarUrl(userId);
    res.status(200).json({ avatarUrl });
  } catch (error) {
    console.error('خطأ في استرجاع الصورة:', error);
    res.status(500).json({ error: 'فشل في استرجاع الصورة' });
  }
}