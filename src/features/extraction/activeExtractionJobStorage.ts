import * as SecureStore from 'expo-secure-store';

export type StoredExtractionJob = {
  jobId: string;
  sourceUrl?: string;
};

const ACTIVE_EXTRACTION_JOB_KEY = 'roundtrip.activeExtractionJob';
const NOTIFIED_EXTRACTION_JOB_KEY = 'roundtrip.notifiedExtractionJob';

export async function getStoredExtractionJob(): Promise<StoredExtractionJob | null> {
  const rawJob = await SecureStore.getItemAsync(ACTIVE_EXTRACTION_JOB_KEY);

  if (!rawJob) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawJob) as Partial<StoredExtractionJob>;

    if (!parsed.jobId) {
      return null;
    }

    return {
      jobId: parsed.jobId,
      sourceUrl: parsed.sourceUrl,
    };
  } catch {
    await clearStoredExtractionJob();
    return null;
  }
}

export async function setStoredExtractionJob(job: StoredExtractionJob) {
  await SecureStore.setItemAsync(ACTIVE_EXTRACTION_JOB_KEY, JSON.stringify(job));
}

export async function clearStoredExtractionJob() {
  await SecureStore.deleteItemAsync(ACTIVE_EXTRACTION_JOB_KEY);
}

export async function hasNotifiedExtractionJob(jobId: string) {
  return (await SecureStore.getItemAsync(NOTIFIED_EXTRACTION_JOB_KEY)) === jobId;
}

export async function markExtractionJobNotified(jobId: string) {
  await SecureStore.setItemAsync(NOTIFIED_EXTRACTION_JOB_KEY, jobId);
}
