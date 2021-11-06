import {
  collection,
  Firestore,
  getDocs,
  limit,
  query,
} from 'firebase/firestore';

export type AppConfig = {
  maintenance: boolean;
  maintenanceMessage: string;
  maintenancePeriod: string | null;
  supportVersion: string;
};

export const defaultAppConfig = (): AppConfig => ({
  maintenance: false,
  maintenanceMessage: '',
  maintenancePeriod: null,
  supportVersion: '1.0.0',
});

export const getAppConfig = async (db: Firestore): Promise<AppConfig> => {
  const first = query(collection(db, 'appConfig'), limit(1));
  const qs = await getDocs(first);

  const records = qs.docs.map(elem => {
    return elem.data();
  });

  if (!records || !records[0]) {
    return defaultAppConfig();
  }

  return records[0] as AppConfig;
};
