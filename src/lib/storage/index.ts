// PRAYELLE • Haute Hairwear — Storage Provider Factory
// Selects appropriate storage provider based on STORAGE_PROVIDER environment variable

import { StorageProvider } from './types';
import { LocalStorageProvider } from './localStorage';
import { CloudinaryStorageProvider } from './cloudinaryStorage';

let currentProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (currentProvider) return currentProvider;

  const providerType = process.env.STORAGE_PROVIDER || 'cloudinary';

  switch (providerType.toLowerCase()) {
    case 'local':
      currentProvider = new LocalStorageProvider();
      break;
    case 'cloudinary':
    default:
      currentProvider = new CloudinaryStorageProvider();
      break;
  }

  return currentProvider;
}

export * from './types';
