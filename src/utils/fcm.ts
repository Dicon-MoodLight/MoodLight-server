import firebaseAdmin, { messaging } from 'firebase-admin';
import Message = messaging.Message;

export async function requestFCM(
  notification: Message['notification'],
  token: string,
): Promise<void> {
  await firebaseAdmin.messaging().send({ notification, token });
}
