export default function notify(
  title: string,
  body: string,
  onClick?: (this: Notification, ev: Event) => any
) {
  try {
    new window.Notification(title, {
      body,
    }).onclick = onClick || null;
  } catch (e) {
    console.error('Failed to send notification', e);
  }
}
