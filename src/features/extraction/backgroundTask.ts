import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { pollActiveExtractionJob } from './pollActiveExtractionJob';

export const EXTRACTION_BACKGROUND_TASK = 'roundtrip-extraction-poll';
export const EXTRACTION_BACKGROUND_MINIMUM_INTERVAL_MINUTES = 15;

// TODO(server-push): 서버 push notification 전까지만 사용하는 보조 background polling task다.
TaskManager.defineTask(EXTRACTION_BACKGROUND_TASK, async () => {
  try {
    await pollActiveExtractionJob();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerExtractionBackgroundTask() {
  await BackgroundTask.registerTaskAsync(EXTRACTION_BACKGROUND_TASK, {
    minimumInterval: EXTRACTION_BACKGROUND_MINIMUM_INTERVAL_MINUTES,
  });
}

export async function unregisterExtractionBackgroundTask() {
  await BackgroundTask.unregisterTaskAsync(EXTRACTION_BACKGROUND_TASK);
}
