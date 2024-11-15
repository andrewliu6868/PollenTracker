import requests
from datetime import datetime, time
from django.conf import settings

EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send"

def schedule_push_notification(user, title, body, scheduled_time, token):
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {settings.EXPO_ACCESS_TOKEN}"
    }
    
    data = {
        "to": token,
        "title": title,
        "body": body,
        "sound": "default",
        "data": {"withSome": "data"}
    }

    response = requests.post(EXPO_PUSH_ENDPOINT, json=data, headers=headers)
    
    if response.status_code == 200:
        return response.json().get("id")
    else:
        print("Error scheduling notification:", response.text)
        return None

def schedule_reminder_notifications(reminder_times, medication, start_date, end_date, token):
    notification_ids = []
    current_date = datetime.now().date()

    for reminder_time_str in reminder_times:
        try:
            # Convert string to datetime object
            reminder_datetime = datetime.fromisoformat(reminder_time_str.replace("Z", "+00:00"))
            
            # Extract time from the datetime object
            reminder_time = reminder_datetime.time()
            
            # Ensure the time is valid for the current date
            notification_time = datetime.combine(current_date, reminder_time)

            # Schedule the notification if it's within the date range
            if start_date <= notification_time.date() <= end_date:
                notification_id = schedule_push_notification(
                    token,
                    title=f"Reminder: {medication.med_name}",
                    body=f"Take your medication: {medication.dosage}",
                    scheduled_time=notification_time
                )
                if notification_id:
                    notification_ids.append(notification_id)
        except Exception as e:
            print("Error scheduling notifications:", str(e))
    
    return notification_ids


def schedule_refill_notification(user, refill_date, medication, token):
    refill_datetime = datetime.strptime(refill_date, "%Y-%m-%d")
    return schedule_push_notification(
        user=user,
        title=f"Refill Reminder: {medication.med_name}",
        body="It's time to refill your medication!",
        scheduled_time=refill_datetime,
        token=token
    )

def cancel_notifications(notification_ids):
    for notification_id in notification_ids:
        try:
            response = requests.post(
                EXPO_PUSH_ENDPOINT + f"/{notification_id}/cancel",
                headers={"Authorization": f"Bearer {settings.EXPO_ACCESS_TOKEN}"}
            )
            if response.status_code != 200:
                print("Error canceling notification:", response.text)
        except Exception as e:
            print("Exception while canceling notification:", e)
