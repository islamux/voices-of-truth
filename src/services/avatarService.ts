import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// تعريف أحجام الصور
const AVATAR_SIZES = {
  xs: 32,
  sm: 64,
  md: 128,
  lg: 256,
  xl: 512
};

type AvatarSize = keyof typeof AVATAR_SIZES;

// دليل تخزين الصور
const AVATARS_DIR = path.join(process.cwd(), 'public', 'avatars');
const METADATA_FILE = path.join(AVATARS_DIR, 'metadata.json');

// أنواع البيانات
interface AvatarMetadata {
  userId: string;
  original: string;
  versions: {
    [size in AvatarSize]?: string;
  };
  permissions: 'public' | 'private' | 'friends_only';
  createdAt: string;
}

// إنشاء الدليل إذا لم يكن موجوداً
const ensureDirExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

// خدمة إدارة الصور
const AvatarService = {
  // تحميل صورة جديدة
  uploadAvatar: async (userId: string, fileBuffer: Buffer, permissions: 'public' | 'private' | 'friends_only' = 'public'): Promise<AvatarMetadata> => {
    await ensureDirExists(AVATARS_DIR);
    
    // التحقق من صحة الصورة
    const image = sharp(fileBuffer);
    const metadata = await image.metadata();
    if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
      throw new Error('صيغة الصورة غير مدعومة');
    }

    // إنشاء معرف فريد للصورة
    const avatarId = uuidv4();
    const baseFilename = `${userId}_${avatarId}`;

    // توليد الإصدارات المختلفة
    const versions: Record<AvatarSize, string> = {} as Record<AvatarSize, string>;

    // حفظ الإصدارات
    for (const [sizeName, size] of Object.entries(AVATAR_SIZES)) {
      const sizeKey = sizeName as AvatarSize;
      const filename = `${baseFilename}_${sizeKey}.webp`;
      const filePath = path.join(AVATARS_DIR, filename);
      
      await image
        .clone()
        .resize(size, size)
        .webp({ quality: 80 })
        .toFile(filePath);
      
      versions[sizeKey] = filename;
    }

    // حفظ الصورة الأصلية
    const originalFilename = `${baseFilename}_original.${metadata.format}`;
    const originalPath = path.join(AVATARS_DIR, originalFilename);
    await image.toFile(originalPath);

    // إنشاء بيانات وصفية
    const avatarMetadata: AvatarMetadata = {
      userId,
      original: originalFilename,
      versions,
      permissions,
      createdAt: new Date().toISOString()
    };

    // حفظ البيانات الوصفية
    let allMetadata: Record<string, AvatarMetadata> = {};
    try {
      const data = await fs.readFile(METADATA_FILE, 'utf8');
      allMetadata = JSON.parse(data);
    } catch {
      // تجاهل الخطأ إذا الملف غير موجود
    }
    
    allMetadata[userId] = avatarMetadata;
    await fs.writeFile(METADATA_FILE, JSON.stringify(allMetadata, null, 2));

    return avatarMetadata;
  },

  // استرجاع رابط الصورة
  getAvatarUrl: async (userId: string, size: AvatarSize = 'md'): Promise<string> => {
    try {
      const data = await fs.readFile(METADATA_FILE, 'utf8');
      const allMetadata: Record<string, AvatarMetadata> = JSON.parse(data);
      const metadata = allMetadata[userId];
      
      if (!metadata) {
        return '/avatars/default-avatar.png';
      }

      const filename = metadata.versions[size] || metadata.original;
      return `/avatars/${filename}`;
    } catch {
      return '/avatars/default-avatar.png';
    }
  },

  // التحقق من الصلاحيات
  checkPermissions: (metadata: AvatarMetadata, currentUserId: string): boolean => {
    if (metadata.permissions === 'public') return true;
    if (metadata.permissions === 'private') return metadata.userId === currentUserId;
    // friends_only: سيتم تطبيق منطق الصداقة لاحقاً
    return metadata.userId === currentUserId;
  }
};

export default AvatarService;