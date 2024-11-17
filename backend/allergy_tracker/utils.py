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
        "data": {"withSome": "data"},
        "send_after": scheduled_time.isoformat() if scheduled_time else None
    }

    response = requests.post(EXPO_PUSH_ENDPOINT, json=data, headers=headers)
    
    if response.status_code == 200:
        response_data = response.json()
        if "data" in response_data and response_data["data"].get("id"):
            return response_data["data"]["id"]
        else:
            print("Notification response missing ID:", response_data)
            return None
    else:
        print("Error scheduling notification:", response.text)
        return None

def schedule_reminder_notifications(reminder_times, medication, start_date, end_date, token):
    notification_ids = []
    current_date = datetime.now().date()

    for reminder_time_str in reminder_times:
        try:
            reminder_datetime = datetime.fromisoformat(reminder_time_str.replace("Z", "+00:00"))            
            reminder_time = reminder_datetime.time()            
            notification_time = datetime.combine(current_date, reminder_time)

            # schedule the notification if it's within the date range and in the future
            if start_date <= notification_time.date() <= end_date and notification_time > datetime.now():
                notification_id = schedule_push_notification(
                    token=token,
                    title=f"Reminder: {medication.med_name}",
                    body=f"Take your medication: {medication.dosage}",
                    scheduled_time=notification_time
                )
                if notification_id:
                    notification_ids.append(notification_id)
                else:
                    print(f"Failed to schedule notification for {medication.med_name}")
        except Exception as e:
            print("Error scheduling notifications:", str(e))
    
    print("[DEBUG] Scheduled Notification IDs:", notification_ids)
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
